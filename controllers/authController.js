const zlib = require("zlib");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const { sql } = require("../utils/sql.js");
// const signature = require("cookie-signature");
// const cookie = require("cookie");

exports.register = catchAsync(async (req, res, next) => {
  try {
    const userName = req.body.username;
    let password = req.body.password;

    if (!userName || !password) {
      return next(new AppError("Invalid username or password"), 400);
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const user = await sql.insertUser(userName, password);

    const jsontoken = jwt.sign({ user: user }, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });

    res.status(201).json({
      success: true,
      statusText: "User successfuly registered",
      token: jsontoken,
      isAuthenticated: false,
    });
  } catch (error) {
    return next(new AppError(error), 400);
  }

  next();
});

exports.login = catchAsync(async (req, res, next) => {
  try {
    const userName = req.body.username;
    const password = req.body.password;
    user = await sql.getUserByUsername(userName);

    if (!userName || !password || !user) {
      return next(new AppError("invalid_credentials_message", 401));
    }

    const isValidPassword = compareSync(password, user[0][0].password);

    if (isValidPassword) {
      user.password = undefined;
      //creating a access token
      const accessToken = jwt.sign(
        { username: user[0][0].username, password: user[0][0].password },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" }
      );

      // let signed = "s:" + signature.sign(token, process.env.ACCESS_TOKEN_SECRET);
      // let accessToken = cookie.serialize("jwtToken", signed, cookieOptions);

      // Creating refresh token not that expiry of refresh
      // token is greater than the access token
      let refreshToken = jwt.sign(
        { username: user[0][0].username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      // Calling gzip method
      zlib.gzip(refreshToken, async (err, buffer) => {
        if (!err) {
          refreshToken = await buffer.toString("base64");
          res
            .status(200)
            .cookie("jwt", refreshToken, {
              secure: true,
              httpOnly: true,
              SameSite: "Strict",
              Path: "/",
              expires: new Date(Number(new Date()) + 60 * 195 * 1000),
              "Max-Age": 99999999
            })
            .json({
              status: "success",
              statusText: "login_message",
              username: user[0][0].username,
              expirationTime: new Date(Number(new Date()) + 60 * 195 * 1000),
              isAdmin: user[0][0].role_id === 1,
              isAuthenticated: true,
              accessToken,
            });
        } else {
          return next(new AppError("invalid_credentials_message", 400));
        }
      });
    } else {
      return next(new AppError("invalid_credentials_message", 401));
    }
  } catch (error) {
    return next(new AppError("global_error_server_message", 500));
  }
});

// Refresh token
exports.refresh = catchAsync(async (req, res, next) => {
  if (req?.cookies?.jwt) {
    let jwtCookie = Buffer.from(req.cookies.jwt, 'base64');
    zlib.unzip(jwtCookie, (err, buffer) => {
      if (!err) {
        jwtCookie = buffer.toString("utf-8");
   
        // Verifying refresh token
        if (jwtCookie) {
          jwt.verify(
            jwtCookie,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
              if (err) {
                // Wrong Refesh Token
                return next(new AppError("unauthorized_access_error_message", 401));
              } else {
                // Correct token we send a new access token
                const accessToken = jwt.sign(
                  {username: user[0][0].username, password: user[0][0].password},
                  process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m"}
                );
                return res.json({ accessToken });
              }
            }
          );
        }
      }
    });
  } else {
    return next(new AppError("unauthorized_access_error_message", 401));
  }
});

exports.logout = catchAsync(async (req, res, next) => {
  return res
    .clearCookie('jwt', '', {
      domain: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PRODUCTION_URL : "localhost",
      maxAge: null,
      overwrite: true,
      path: '/'
    })
    .status(200)
    .json({ statusText: "logout_message" })
    .end();
});