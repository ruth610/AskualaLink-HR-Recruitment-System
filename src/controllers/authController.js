const authService = require('../services/authService');
const statusCode = require('http-status-codes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


async function login(req,res){
    const { email, password } = req.body;

    try {
        if (!email) {
            return res.status(statusCode.BAD_REQUEST).json({ message: 'Email is required' });
        }
        if (!password) {
            return res.status(statusCode.BAD_REQUEST).json({ message: 'Password is required' });
        }
        const result = await authService.login(email, password);
        if (result.status !== statusCode.OK) {
            return res.status(result.status).json({ message: result.message });
        }
        payload = {
            userId: result.data.id,
            email: result.data.email,
            fullName: result.data.full_name,
            role: result.data.role
        }
        const jwt_secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, jwt_secret, { expiresIn: '24h' });
        return res.status(result.status).json({ message: result.message, data: { token } });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }

}

async function createUser(req, res){
    try {
        const { fullName, password, email, role } = req.body;
        // validate input
        if (!fullName) {
            return res.status(statusCode.BAD_REQUEST).json({ message: 'Fullname is required' });
        }
        if (!password) {
            return res.status(statusCode.BAD_REQUEST).json({ message: 'Password is required' });
        }
        if (!email) {
            return res.status(statusCode.BAD_REQUEST).json({ message: 'Email is required' });
        }
        if (!role) {
            role = 'STAFF';
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // call service to create user
        const result = await authService.createUser({ fullName, password: hashedPassword, email, role });
        if (result.status !== statusCode.CREATED) {
            return res.status(result.status).json({ message: result.message });
        }
        return res.status(result.status).json({ message: result.message, data: result.data });
    } catch (error) {
        console.error('Error during user creation:', error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
}

module.exports = {
    login,
    createUser
}
