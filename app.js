const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const AppError = require('./utils/appError');
const truckRouter = require('./routes/truckRoutes');
const windproofCurtainsRouter = require('./routes/windproofCurtainsRouter');
const contactRouter = require('./routes/contactRoutes');
const globalErrorHandler = require('./controllers/errorControlller');

const app = express();

// This is required to handle urlencoded data
app.use(express.urlencoded({ extended: true }));

// This to handle json data coming from requests mainly post
app.use(express.json()); 

// Set security HTTP headers
app.use(helmet());

// Data sanitization against XSS (cross-side script attack)
app.use(xss());

app.disable('x-powered-by');
app.use(compression());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/', limiter);

//Set Cors
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 201,
};

// enable CORS using npm package
app.use(cors(corsOptions));

// parse application/json
app.use(bodyParser.json());

// Require body-parser (to receive post data from clients)
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// GLOBAL ROTUES
app.use('/api/trucks', truckRouter);
app.use('/api/windproofcurtains', windproofCurtainsRouter);
app.use('/api', contactRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;