const db = require('../config/db');
const bycrpt = require('bcrypt');

class UserModel{

    static async create(userData){
        const {username, password, email, role} = userData;
        try {
            if(!role){
                role = 'STAFF';
            }
            const salt = await bycrpt.genSalt(10);
            const hashedPassword = await bycrpt.hash(password, salt);
            const query = 'INSERT INTO users (full_name, password, email, role) VALUES ($1, $2, $3, $4) RETURNING *';
            const values = [username, hashedPassword, email, role];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.log(error);
            throw new Error('Error creating user: ' + error.message);
        }

    }

    static async findByEmail(email){
        try {
            const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            if(user.rows.length === 0){
                return null;
            }
            return user.rows[0];
        } catch (error) {
            console.log(error);
            throw new Error('Error finding user by email: ' + error.message);
        }
    }
}

module.exports = UserModel;