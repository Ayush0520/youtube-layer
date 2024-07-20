const express = require('express');
const { sendCollaborationRequest, respondToCollaborationRequest } = require('../controllers/collaborationController');

const router = express.Router();

router.post('/send', sendCollaborationRequest);
router.put('/respond', respondToCollaborationRequest);

module.exports = router;