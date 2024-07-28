const express = require('express');
const { uploadAndStoreVideo, getVideosByUsername, getVideoUrl, updateVideoStatus } = require('../controllers/videoController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Middleware to handle file uploads
const checkUserType = require('../middleware/checkUserType');

const router = express.Router();

router.post('/upload', protect, checkUserType('editor'), upload.single('video'), uploadAndStoreVideo);
router.get('/user/:username', protect, getVideosByUsername);
router.get('/url/:videoId', protect, getVideoUrl);
router.put('/status', protect, updateVideoStatus);

module.exports = router;
