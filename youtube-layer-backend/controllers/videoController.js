const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const Video = require('../models/videoModel');

const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;
const blobServiceClient = new BlobServiceClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net?${sasToken}`);

const uploadVideoToBlob = async (filePath, fileName) => {
    const containerClient = blobServiceClient.getContainerClient('videos');
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadFile(filePath);
    console.log(`Video uploaded to Blob Storage: ${fileName}`);
};

const uploadAndStoreVideo = asyncHandler(async (req, res) => {
    const { uploaderUsername, filePath } = req.body;
    const videoId = uuidv4();
    const fileName = `${videoId}.mp4`; // Assuming the file extension is .mp4
    const fileUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/videos/${fileName}`;

    await uploadVideoToBlob(filePath, fileName);
    const video = new Video(videoId, uploaderUsername, fileUrl);
    await Video.create(video);
    res.status(201).json({ message: 'Video uploaded and metadata stored successfully' });
});

module.exports = {
    uploadAndStoreVideo
};
