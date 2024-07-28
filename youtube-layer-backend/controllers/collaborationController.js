const asyncHandler = require('express-async-handler');
const Collaboration = require('../models/collaboration');
const User = require('../models/user');
const { sendEmailNotification } = require('../utils/notificationUtil');

const sendCollaborationRequest = asyncHandler(async (req, res) => {
    const { senderUsername, receiverUsername } = req.body;
    const request = new Collaboration(senderUsername, receiverUsername, 'pending');
    await Collaboration.create(request);

    // Fetch receiver's email
    const receiver = await User.findByUsername(receiverUsername);
    if (!receiver) {
        res.status(404);
        throw new Error('Receiver not found');
    }
    
    // Send notification to receiver
    await sendEmailNotification({
        to: receiver.email,
        subject: 'New Collaboration Request',
        text: `You have a new collaboration request from ${senderUsername}.`
    });

    res.status(201).json({ message: 'Collaboration request sent' });
});

const respondToCollaborationRequest = asyncHandler(async (req, res) => {
    const { requestId, status } = req.body;
    await Collaboration.updateStatus(requestId, status);
    
    const request = await Collaboration.findById(requestId);
    const sender = await User.findByUsername(request.sender_username);
    if (!sender) {
        res.status(404);
        throw new Error('Sender not found');
    }
    const notificationMessage = status === 'accepted'
        ? `Your collaboration request to ${request.receiver_username} has been accepted.`
        : `Your collaboration request to ${request.receiver_username} has been rejected.`;

    // Send notification to sender
    await sendEmailNotification({
        to: sender.email,
        subject: `Collaboration Request ${status}`,
        text: notificationMessage
    });

    res.status(200).json({ message: `Collaboration request ${status}` });
});

const getRequestsByUsername = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const requests = await Collaboration.findByUsername(username);
    res.status(200).json(requests);
});

module.exports = {
    sendCollaborationRequest,
    respondToCollaborationRequest,
    getRequestsByUsername
};
