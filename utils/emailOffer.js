const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  let transporter = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    port: process.env.PORT_EMAIL,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASSWORD_EMAIL
    }
  });

  // 2) Define the email options
  const mailOptions = {
    // from: options.email,
    email: options.email,
    subject: options.subject,
    html: options.html,
    to: process.env.USER_EMAIL,
    attachments: options.attachments
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;