const express = require('express');
const { sendEmailNotification } = require('../controllers/notificationController');

const router = express.Router();

router.post('/send', sendEmailNotification);

module.exports = router;
