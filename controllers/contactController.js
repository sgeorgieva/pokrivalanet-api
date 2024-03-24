const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/emailContact');
const sql = require('../utils/sql');

exports.contact = catchAsync(async (req, res, next) => {
  const { name, email, subject, message } = req.body;
  const content = `Name: ${name}\nEmail: ${email} \n\n Message: ${message} `;
  
  try {
    sendEmail({
      from: email,
      email: email,
      subject: subject,
      content: content
    });

    res.status(200).json({
      status: 'success',
      message:
        "Thanks for your messege!\n Soon some of our team will respond you."
    });
  } catch (err) {
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }

  const response = await sql.contactSaveMessage(req.body);
  
  if (response === "success") {
    try {
      res.status(200).json({ message: "Contact message sucessfully saved!" });
    } catch (error) { 
      return next(
        new AppError(error),
        400
      );
    }
  } else {
    return next(
      new AppError("Something went wrong"),
      500
    );
  }
});

// verify reCAPTCHA response
exports.verifyToken = catchAsync(async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send('Empty object provided');
    }

    let token = req.body;
    let response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.REACT_APP_googleSecretApiKey}&response=${token}`);
    return res.status(200).json({
      success: true,
      message: "Token successfully verified",
      data: response.data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying token"
    });
  }
});
