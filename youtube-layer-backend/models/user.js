const { sql, poolPromise } = require('../config/dbConnection');

class User {
    constructor(id, username, firstName, lastName, email, password, mobileNo, userType) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.mobileNo = mobileNo;
        this.userType = userType;
    }

    static async create(user) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.VarChar, user.username)
            .input('firstName', sql.VarChar, user.firstName)
            .input('lastName', sql.VarChar, user.lastName)
            .input('email', sql.VarChar, user.email)
            .input('password', sql.VarChar, user.password)
            .input('mobileNo', sql.VarChar, user.mobileNo)
            .input('userType', sql.VarChar, user.userType)
            .query(`INSERT INTO users (username, first_name, last_name, email, password, mobile_no, user_type) 
                    OUTPUT inserted.username, inserted.first_name, inserted.last_name, inserted.email, inserted.password, inserted.mobile_no, inserted.user_type
                    VALUES (@username, @firstName, @lastName, @email, @password, @mobileNo, @userType)`);
        return result.recordset[0];
    }

    static async update(user) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, user.id)
            .input('firstName', sql.VarChar, user.first_name)
            .input('lastName', sql.VarChar, user.last_name)
            .input('email', sql.VarChar, user.email)
            .input('mobileNo', sql.VarChar, user.mobile_no)
            .query(`UPDATE users 
                    SET first_name = @firstName, last_name = @lastName, email = @email, mobile_no = @mobileNo 
                    OUTPUT inserted.id, inserted.username, inserted.first_name, inserted.last_name, inserted.email, inserted.mobile_no, inserted.user_type
                    WHERE id = @id`);
        return result.recordset[0];
    }

    static async updateUsername(id, username) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('username', sql.VarChar, username)
            .query(`UPDATE users SET username = @username WHERE id = @id`);
        return result;
    }

    static async findByEmail(email) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query(`SELECT * FROM users WHERE email = @email`);
        return result.recordset[0];
    }

    static async findByUsername(username) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query(`SELECT * FROM users WHERE username = @username`);
        return result.recordset[0];
    }

    static async findByMobileNo(mobileNo) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('mobileNo', sql.VarChar, mobileNo)
            .query(`SELECT * FROM users WHERE mobile_no = @mobileNo`);
        return result.recordset[0];
    }
}

module.exports = User;
