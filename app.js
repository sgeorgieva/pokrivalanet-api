const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const cors = require("cors");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");
const path = require("path");
const dns = require("dns");
const dotenv = require("dotenv");
const AppError = require("./utils/appError");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const truckRouter = require("./routes/truckRoutes");
const priceRouter = require("./routes/priceRoutes");
const windproofCurtainsRouter = require("./routes/windproofCurtainsRoutes");
const contactRouter = require("./routes/contactRoutes");
const globalErrorHandler = require("./controllers/errorController");

dotenv.config({ path: "./config.env" });

// Set default result order for DNS resolution
dns.setDefaultResultOrder("ipv4first");

const app = express();

// This is required to handle urlencoded data
app.use(express.urlencoded({ extended: true }));

// This to handle json data coming from requests mainly post
app.use(express.json());

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "pokrivala.net"],
      },
    },
    dnsPrefetchControl: {
      allow: true,
    },
  })
);

// Data sanitization against XSS (cross-side script attack)
app.use(xss());

app.disable("x-powered-by");
app.use(compression());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  headers: true,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: false,
  skipSuccessfulRequests: false,
  keyGenerator: function (req) {
    return req.ip;
  },
  handler: function (req, res, next) {
    return next(
      new AppError("Too many requests, please try again later.", 429)
    );
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  headers: true,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: false,
  skipSuccessfulRequests: false,
  keyGenerator: function (req) {
    console.log("req", req);
    // console.log("req.rateLimit", req.rateLimit);
    return req.ip;
  },
  handler: function (req, res, next) {
    return next(
      new AppError("Too many requests, please try again later.", 429)
    );
  },
});

app.use("/", limiter);
// app.use("/login", loginLimiter);

//Set Cors
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PRODUCTION_URL
      : process.env.REACT_APP_DEVELOPMENT_URL,
  methods: "GET,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Accept", "Origin", "X-Csrf-Token"],
  credentials: true,
  optionSuccessStatus: 201,
};

// enable CORS using npm package
app.use(cors(corsOptions));

const csrfMiddleware = csurf({
  cookie: true,
});

// Require body-parser (to receive post data from clients)
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(csrfMiddleware);

// parse application/json
app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log('req.headers', req.headers);
  next();
});

// GLOBAL ROTUES
app.use("/api/auth", loginLimiter, authRouter);
app.use("/api/users", userRouter);
app.use("/api/price", priceRouter);
app.use("/api/trucks", truckRouter);
app.use("/api/windproofcurtains", windproofCurtainsRouter);
app.use("/api", contactRouter);

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
