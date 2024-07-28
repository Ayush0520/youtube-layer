const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const Video = require('../models/videos');
const User = require('../models/user');
const { sendEmailNotification } = require('../utils/notificationUtil');
const { sql, poolPromise } = require('../config/dbConnection');

const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;
const blobServiceClient = new BlobServiceClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net?${sasToken}`);

const uploadVideoToBlob = async (buffer, fileName, mimeType) => {
    const containerClient = blobServiceClient.getContainerClient('videos');
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: mimeType }
    });
    console.log(`Video uploaded to Blob Storage: ${fileName}`);
};

const uploadAndStoreVideo = asyncHandler(async (req, res) => {
    const { editorUsername, youtuberUsername } = req.body;
    const file = req.file; // The uploaded file

    if (!file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const video = new Video(null, editorUsername, youtuberUsername, '', new Date(), 'pending', '');
        const videoMetadata = await Video.create(video, transaction);

        // Insert metadata and get the video_id
        const videoId = videoMetadata.id;
        const fileName = `${videoId}.${file.mimetype.split('/')[1]}`; // Use video_id as file name
        const fileUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/videos/${fileName}`;

        // Upload the video to Blob Storage
        await uploadVideoToBlob(file.buffer, fileName, file.mimetype);

        // Update the video record with the file URL
        // Set the file path
        video.filePath = fileUrl;
        await Video.update(videoId, video, transaction);

        await transaction.commit();
        res.status(201).json({ message: 'Video uploaded and metadata stored successfully', fileUrl });
    } catch (error) {
        await transaction.rollback();
        console.error('Error during transaction:', error);
        res.status(500);
        throw new Error('Error uploading video and storing metadata');
    }
});

const getVideosByUsername = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const pendingVideos = await Video.findByUsernameAndStatus(username, 'pending');
    const approvedVideos = await Video.findByUsernameAndStatus(username, 'approved');
    const rejectedVideos = await Video.findByUsernameAndStatus(username, 'rejected');
    
    res.json({
        pending: pendingVideos,
        approved: approvedVideos,
        rejected: rejectedVideos
    });
});

const getVideoUrl = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
        res.status(404);
        throw new Error('Video not found');
    }

    res.json({ url: video.file_path });
});

const updateVideoStatus = asyncHandler(async (req, res) => {
    const { videoId, status, reviewComments } = req.body;
    const video = await Video.findById(videoId);
    if (!video) {
        res.status(404);
        throw new Error('Video not found');
    }

    // Update the status and review comments of the video
    video.status = status;
    video.reviewComments = reviewComments || '';

    await Video.update(video);

    // Notify the editor of the video status update
    const editor = await User.findByUsername(video.editorUsername);
    if (editor) {
        await sendEmailNotification({
            to: editor.email,
            subject: 'Video Status Update',
            text: `Your video has been ${status}. ${reviewComments ? `Review comments: ${reviewComments}` : ''}`
        });
    }

    res.json({ message: `Video status updated to ${status}` });
});

module.exports = {
    uploadAndStoreVideo,
    getVideosByUsername,
    getVideoUrl,
    updateVideoStatus
};
