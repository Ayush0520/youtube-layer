const { sql, poolPromise } = require('../config/dbConnection');

class Collaboration {
    constructor(senderUsername, receiverUsername, status) {
        this.senderUsername = senderUsername;
        this.receiverUsername = receiverUsername;
        this.status = status;
    }

    static async create(collaboration) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('senderUsername', sql.VarChar, collaboration.senderUsername)
            .input('receiverUsername', sql.VarChar, collaboration.receiverUsername)
            .input('status', sql.VarChar, collaboration.status)
            .query(`INSERT INTO collaborations (sender_username, receiver_username, status) 
                    VALUES (@senderUsername, @receiverUsername, @status)`);
        return result;
    }

    static async updateStatus(requestId, status) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('requestId', sql.Int, requestId)
            .input('status', sql.VarChar, status)
            .query(`UPDATE collaborations SET status = @status WHERE id = @requestId`);
        return result;
    }

    static async findById(requestId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('requestId', sql.Int, requestId)
            .query(`SELECT * FROM collaborations WHERE id = @requestId`);
        return result.recordset[0];
    }
}

module.exports = Collaboration;
