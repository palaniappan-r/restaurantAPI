const nodemailer = require("nodemailer");
const catchError = require("./catchError");
const dotevConfig = require('dotenv').config()

const sendMail = catchError(async (receiver , subj ,msg) => {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "hotmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ID, 
      pass: process.env.MAIL_PASS
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'palaniappan.r.testing@outlook.com', // sender address
    to: receiver, // list of receivers
    subject: subj, // Subject line
    text: msg, // plain text body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
})


module.exports = sendMail