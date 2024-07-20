const { sql, poolPromise } = require('../config/dbConnection');

class Video {
    constructor(videoId, uploaderUsername, filePath, status = 'pending') {
        this.videoId = videoId;
        this.uploaderUsername = uploaderUsername;
        this.filePath = filePath;
        this.status = status;
    }

    static async create(video) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('videoId', sql.UniqueIdentifier, video.videoId)
            .input('uploaderUsername', sql.VarChar, video.uploaderUsername)
            .input('filePath', sql.VarChar, video.filePath)
            .input('status', sql.VarChar, video.status)
            .query(`INSERT INTO videos (video_id, uploader_username, file_path, upload_date, status) 
                    VALUES (@videoId, @uploaderUsername, @filePath, GETDATE(), @status)`);
        return result;
    }

    static async findById(videoId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('videoId', sql.UniqueIdentifier, videoId)
            .query(`SELECT * FROM videos WHERE video_id = @videoId`);
        return result.recordset[0];
    }

    static async updateStatus(videoId, status, reviewComments = null) {
        const pool = await poolPromise;
        const request = pool.request()
            .input('videoId', sql.UniqueIdentifier, videoId)
            .input('status', sql.VarChar, status);

        if (reviewComments) {
            request.input('reviewComments', sql.Text, reviewComments);
            await request.query(`UPDATE videos SET status = @status, review_comments = @reviewComments WHERE video_id = @videoId`);
        } else {
            await request.query(`UPDATE videos SET status = @status WHERE video_id = @videoId`);
        }
    }
}

module.exports = Video;
