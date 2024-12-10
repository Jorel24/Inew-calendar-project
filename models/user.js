const db = require('../database');
const bcrypt = require('bcrypt');

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

//Method to create a new user
    async addUser() {
        const { username, password } = this;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        try {
            await db.execute(query, [username, hashedPassword]);
        } catch (err) {
            throw err;
        }
    }

//Method to read and retrieve a user by username
    static async getUserByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = ?';
        try {
            const [results] = await db.execute(query, [username]);
            if (results.length === 0) {
                throw 'User not found';
            }
            return results[0];
        } catch (err) {
            throw err;
        }
    }

//Method to update a user
    async updateUser() {
        const { username, password } = this;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'UPDATE users SET password = ? WHERE username = ?';
        try {
            const [results] = await db.execute(query, [hashedPassword, username]);
            if (results.affectedRows === 0) {
                throw 'User not found';
            }
        } catch (err) {
            throw err;
        }
    }

//Method to delete a user
    static async deleteUser(username) {
        const query = 'DELETE FROM users WHERE username = ?';
        try {
            const [results] = await db.execute(query, [username]);
            if (results.affectedRows === 0) {
                throw 'User not found';
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = User;
