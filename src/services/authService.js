import bcrypt from 'bcrypt';
import statusCode  from 'http-status-codes';
import db  from '../models/index.js';

const { User } = db;

async function login(email, password) {
    try {
        const user = await User.findOne({where : { email: email }});
        if (!user) {
            return {
                status: statusCode.NOT_FOUND,
                message: 'User not found'
            };
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);

        console.log(isMatch);
        console.log(user.password_hash);
        if (!isMatch) {
            return {
                status: statusCode.UNAUTHORIZED,
                message: 'Wrong password'
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
        const existingUser = await User.findOne({where : { email: userData.email }});
        if (existingUser) {
            return {
                status: statusCode.CONFLICT,
                message: 'User with this email already exists'
            };
        }
        const newUser = await User.create({
            full_name: userData.full_name,
            email: userData.email,
            password_hash: userData.password,
            role: userData.role
        });
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

export {
    login,
    createUser
}