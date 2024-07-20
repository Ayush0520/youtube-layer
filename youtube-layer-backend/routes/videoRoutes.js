const express = require('express');
const { uploadAndStoreVideo } = require('../controllers/videoController');

const router = express.Router();

router.post('/upload', uploadAndStoreVideo);

module.exports = router;
