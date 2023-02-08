const nodemailer = require("nodemailer");
const catchError = require("./catchError");
const dotevConfig = require('dotenv').config()

const sendMail = catchError(async (receiver , subj ,msg) => {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false, 
    auth: {
      user: process.env.MAIL_ID, 
      pass: process.env.MAIL_PASS
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_ID, // sender address
    to: receiver, // list of receivers
    subject: subj, // Subject line
    text: msg, // plain text body
  });
})


module.exports = sendMail