const { sql, poolPromise } = require('../config/dbConnection');

class User {
    constructor(username, firstName, lastName, email, password, mobileNo) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.mobileNo = mobileNo;
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
            .query(`INSERT INTO users (username, first_name, last_name, email, password, mobile_no) 
                    VALUES (@username, @firstName, @lastName, @email, @password, @mobileNo)`);
        return result;
    }

    static async findByEmail(email) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query(`SELECT * FROM users WHERE email = @email`);
        return result.recordset[0];
    }
}

module.exports = User;
