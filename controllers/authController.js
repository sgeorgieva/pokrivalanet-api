const jsonwebtoken = require('jsonwebtoken');
const signature = require('cookie-signature')
const cookie = require('cookie');
const zlib = require('zlib');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const catchAsync = require('./../utils/catchAsync');
const pool2 = require('../utils/pool2');

exports.register = catchAsync(async (req, res, next) => {
  try {
    const userName = req.body.username;
    let password = req.body.password;

    if (!userName || !password) {
      res.status(400).json({
        success: false,
        statusText: 'Invalid username or password'
      });
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
    res.status(400).json({
      success: false,
      statusText: error
    });
  }

  next();
});

exports.login = catchAsync(async (req, res, next) => {
  try {
    const userName = req.body.username;
    const password = req.body.password;
    user = await pool2.getUserByUsername(userName);

    if (!user) {
      res.status(401).json({
        success: false,
        statusText: "Invalid username or password"
      });
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
          // console.log(err);
          return;
        }
      })} else {
        res.status(401).json({
          success: false,
          statusText: "Invalid username or password"
        });
      }
    } catch(error){
      // console.log('error: ' + error);
      res.status(400).json({
        success: false,
        statusText: error
      });
    }
});

//  Verify Token
exports.verifyToken = catchAsync(async(req, res, next) => {
  // console.log('req', req);
  const token = req.cookies.access_token;
  // console.log('token', token);
  
  if (!token) {
    return res.send({
      "code": 403,
      "status": "Access Denied! Unauthorized User"
    });
  }
  
  try {
    const data = jwt.verify(token, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        return res.send({
          "code": 403,
          "status": "Invalid Token..."
        });
      } else {
        // console.log('authData.user.role', authData.user.role);
        const role = authData.user.role;

        if (role === "admin") {
          next();
        } else {
          return res.send({
            "code": 401,
            "status": "AAccess Denied! You are not an Admin"
          });
        }
      }
    })
  } catch {
    return res.sendStatus(403);
  }
});

exports.logout = catchAsync(async (req, res, next) => { 
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ statusText: "Successfully logged out!" });
});