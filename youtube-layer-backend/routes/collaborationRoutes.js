const express = require('express');
const { sendCollaborationRequest, respondToCollaborationRequest, getRequestsByUsername } = require('../controllers/collaborationController');
const protect = require('../middleware/authMiddleware');
const checkUserType = require('../middleware/checkUserType');

const router = express.Router();

router.post('/send', protect, checkUserType('youtuber'), sendCollaborationRequest);
router.put('/respond', protect, checkUserType('editor'), respondToCollaborationRequest);
router.get('/:username', protect, getRequestsByUsername);

module.exports = router;