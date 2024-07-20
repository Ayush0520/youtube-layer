const express = require('express');
const { google } = require('googleapis');
const { handleOAuthCallback } = require('../controllers/youtubeController');

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.REDIRECT_URI
);

const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.upload'
];

router.get('/auth/youtube', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    res.redirect(url);
});

router.get('/auth/youtube/callback', handleOAuthCallback);

module.exports = router;
