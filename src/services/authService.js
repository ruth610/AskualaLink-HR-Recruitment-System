import bcrypt from 'bcrypt';
import statusCode  from 'http-status-codes';
import UserModel  from '../models/userMode';

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

async function createUser(userData) {
    try {
        const existingUser = await UserModel.findByEmail(userData.email);
        if (existingUser) {
            return {
                status: statusCode.CONFLICT,
                message: 'User with this email already exists'
            };
        }
        const newUser = await UserModel.create(userData);
        return {
            status: statusCode.CREATED,
            message: 'User created successfully',
            data: newUser
        };
    } catch (error) {
        console.error('Error in authService createUser:', error);
        return {
            status: statusCode.INTERNAL_SERVER_ERROR,
            message: 'Internal server error'
        };
    }
}

module.exports = {
    login,
    createUser
}