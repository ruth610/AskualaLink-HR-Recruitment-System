const bcrypt = require('bcrypt');
const statusCode = require('http-status-codes');
const UserModel = require('../models/userModel');

async function login(email, password) {
    try {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return {
                status: statusCode.NOT_FOUND,
                message: 'User not found'
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return {
                status: statusCode.UNAUTHORIZED,
                message: 'Invalid password'
            };
        }
        return {
            status: statusCode.OK,
            message: 'Login successful',
            data: user
        };
    } catch (error) {
        console.error('Error in authService login:', error);
        return {
            status: statusCode.INTERNAL_SERVER_ERROR,
            message: 'Internal server error'
        };
    }


}

module.exports = {
    login
}