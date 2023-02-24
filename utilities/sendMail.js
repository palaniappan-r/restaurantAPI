const nodemailer = require("nodemailer");
const catchError = require("./catchError");
const dotevConfig = require('dotenv').config()

const sendMail = catchError(async (receiver , subj ,msg) => {

  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true, 
    auth: {
      user: process.env.MAIL_ID, 
      pass: process.env.MAIL_PASS
    },
  });

 
  let info = await transporter.sendMail({
    from: process.env.MAIL_ID, 
    to: receiver, 
    subject: subj, 
    text: msg, 
  });
})


module.exports = sendMail