const asyncHandler = require('express-async-handler');
const Collaboration = require('../models/collaboration');

const sendCollaborationRequest = asyncHandler(async (req, res) => {
    const { senderUsername, receiverUsername } = req.body;
    const request = new Collaboration(senderUsername, receiverUsername, 'pending');
    await Collaboration.create(request);
    res.status(201).json({ message: 'Collaboration request sent' });
});

const respondToCollaborationRequest = asyncHandler(async (req, res) => {
    const { requestId, status } = req.body; // status can be 'accepted' or 'rejected'
    await Collaboration.updateStatus(requestId, status);
    res.status(200).json({ message: `Collaboration request ${status}` });
});

module.exports = {
    sendCollaborationRequest,
    respondToCollaborationRequest
};
