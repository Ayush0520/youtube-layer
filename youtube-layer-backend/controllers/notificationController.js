const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmailNotification = asyncHandler(async (req, res) => {
    const { to, subject, text } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500);
            throw new Error(error.message);
        }
        res.status(200).json({ message: 'Email sent: ' + info.response });
    });
});

module.exports = {
    sendEmailNotification
};
