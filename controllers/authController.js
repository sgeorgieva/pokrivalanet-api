const jsonwebtoken = require('jsonwebtoken');
const signature = require('cookie-signature')
const cookie = require('cookie');
const zlib = require('zlib');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const pool2 = require('../utils/pool2');

exports.register = catchAsync(async (req, res, next) => {
  try {
    const userName = req.body.username;
    let password = req.body.password;

    if (!userName || !password) {
      return next(new AppError('Invalid username or password'), 400);
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const user =  await pool2.insertUser(userName, password);
     
    const jsontoken = jsonwebtoken.sign({user: user}, process.env.SECRET_KEY, { expiresIn: '30m'} );
    // res.cookie('token', jsontoken, { httpOnly: true, secure: false, SameSite: 'strict' , expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.

    res.status(201).json({
      success: true,
      statusText: "User successfuly registered",
      token: jsontoken,
      isAuthenticated: false
    });
  } catch(error) {
    return next(new AppError(error), 400);
  }

  next();
});

exports.login = catchAsync(async (req, res, next) => {
  try {
    const userName = req.body.username;
    const password = req.body.password;
    user = await pool2.getUserByUsername(userName);

    if (!user) {
      return next(new AppError('Invalid username or password'), 401);
    }

    const isValidPassword = compareSync(password, user[0][0].password);

    if (isValidPassword) {
      user.password = undefined;
      const token = 'your-jwt-token';
      const cookieOptions = {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        SameSite: 'strict', 
        expires: new Date(Number(new Date()) + 15 * 60 * 1000)
      };

      let signed = 's:' + signature.sign(token, process.env.SECRET_KEY);
      let cookieString = cookie.serialize('jwtToken', signed, cookieOptions);

      // Calling gzip method
      zlib.gzip(cookieString, async(err, buffer) => {
        if (!err) {
          cookieString = await buffer.toString('base64');
          res.setHeader('Set-Cookie', cookieString);
          res.cookie('access_token', cookieString)
            .status(200)
              .json({
                status: 'success',
                statusText: "User login successfully",
                username: user[0][0].username,
                isAdmin: user[0][0].role_id === 1,
                isAuthenticated: true,
                expirationTime: cookieOptions.expires,
                token: cookieString
              });
        } else {
          // console.log('err', err);
          return next(new AppError(err), 400);
        }
      })} else {
        return next(new AppError("Invalid username or password"), 401);        
      }
    } catch(error) {
      console.log('error: ' + error);
      return next(new AppError(error), 400);
    }
});

//  Verify Token
exports.verifyToken = catchAsync(async(req, res, next) => {
  // console.log('req', req);
  const token = req.cookies.access_token;
  // console.log('token', token);
  
  if (!token) {
    return next(new AppError('Access Denied! Unauthorized User'), 403);
  }
  
  try {
    const data = jwt.verify(token, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        return next(new AppError('Invalid Token...'), 403);
      } else {
        // console.log('authData.user.role', authData.user.role);
        const role = authData.user.role;

        if (role === "admin") {
          next();
        } else {
          return next(new AppError('Access Denied! You are not an Admin'), 401);
        }
      }
    })
  } catch (err) {
    return next(new AppError('err'), 403);
  }
});

exports.logout = catchAsync(async (req, res, next) => { 
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ statusText: "Successfully logged out!" });
});