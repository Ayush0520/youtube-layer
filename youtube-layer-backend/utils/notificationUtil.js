const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmailNotification = asyncHandler(async ({ to, subject, text }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
});

module.exports = {
    sendEmailNotification
};
