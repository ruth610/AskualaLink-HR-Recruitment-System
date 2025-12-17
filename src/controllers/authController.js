const authService = require('../services/authService');
const statusCode = require('http-status-codes');
const jwt = require('jsonwebtoken');


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

module.exports = {
    login
}