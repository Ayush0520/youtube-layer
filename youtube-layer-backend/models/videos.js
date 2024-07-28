const { sql, poolPromise } = require('../config/dbConnection');

class Video {
    constructor(id, editorUsername, youtuberUsername, filePath, uploadDate, status, reviewComments) {
        this.id = id;
        this.editorUsername = editorUsername;
        this.youtuberUsername = youtuberUsername;
        this.filePath = filePath;
        this.uploadDate = uploadDate;
        this.status = status;
        this.reviewComments = reviewComments;
    }

    static async create(video, transaction = null) {
        const pool = await poolPromise;
        const request = transaction ? new sql.Request(transaction) : new sql.Request(pool);
        const result = await request
            .input('editorUsername', sql.VarChar, video.editorUsername)
            .input('youtuberUsername', sql.VarChar, video.youtuberUsername)
            .input('filePath', sql.VarChar, video.filePath)
            .input('uploadDate', sql.DateTime, video.uploadDate)
            .input('status', sql.VarChar, video.status)
            .input('reviewComments', sql.Text, video.reviewComments)
            .query(`INSERT INTO videos (editor_username, youtuber_username, file_path, upload_date, status, review_comments)
                    OUTPUT inserted.id, inserted.editor_username, inserted.youtuber_username, inserted.file_path, inserted.upload_date, inserted.review_comments
                    VALUES (@editorUsername, @youtuberUsername, @filePath, @uploadDate, @status, @reviewComments)`);
        return result.recordset[0];
    }

    static async findById(videoId) {        
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, videoId)
            .query(`SELECT * FROM videos WHERE id = @id`);
        return result.recordset[0];
    }

    static async findByUsernameAndStatus(username, status) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('status', sql.VarChar, status)
            .query(`SELECT * FROM videos WHERE 
                    (editor_username = @username OR youtuber_username = @username) 
                    AND status = @status`);
        return result.recordset;
    }

    static async update(id, video, transaction = null) {
        const pool = await poolPromise;
        const request = transaction ? new sql.Request(transaction) : new sql.Request(pool);
        const result = await request
            .input('id', sql.Int, id)
            .input('filePath', sql.VarChar, video.filePath) 
            .input('status', sql.VarChar, video.status)
            .input('reviewComments', sql.Text, video.review_comments)
            .query(`UPDATE videos 
                    SET file_path = @filePath, status = @status, review_comments = @reviewComments
                    WHERE id = @id`);
        return result;
    }
}

module.exports = Video;
