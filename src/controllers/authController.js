import * as authService from '../services/authService.js';
import statusCode  from  'http-status-codes';
import jwt  from  'jsonwebtoken';
import bcrypt  from  'bcrypt';


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & User Management
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */


async function login(req,res){
    const { email, password } = req.body;

    try {
        if (!email) {
            return res.status(
                statusCode.BAD_REQUEST).json({
                message: 'Email is required'
            });
        }
        if (!password) {
            return res.status(
                statusCode.BAD_REQUEST).json({
                message: 'Password is required'
            });
        }
        const result = await authService.login(email, password);
        if (result.status !== statusCode.OK) {
            return res.status(
                result.status).json({
                message: result.message
            });
        }
        const payload = {
            id: result.data.id,
            email: result.data.email,
            fullName: result.data.full_name,
            role: result.data.role
        }
        const jwt_secret = process.env.JWT_SECRET;
        const token = jwt.sign(
            payload, jwt_secret,
            {
                expiresIn: '24h'
            }
        );
        return res.status(
            result.status).json({
            message: result.message,
            data: { token }
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(
            statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error'
        });
    }

}

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new system user (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */

async function createUser(req, res){
    try {
        const { full_name, password, email, role } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // call service to create user
        const result = await authService.createUser({
            full_name,
            password: hashedPassword,
            email,
            role
        });
        if (result.status !== statusCode.CREATED) {
            return res.status(
                result.status).json({
                message: result.message
            });
        }
        return res.status(
            result.status).json({
            message: result.message,
            data: result.data
        });
    } catch (error) {
        console.error('Error during user creation:', error);
        return res.status(
            statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error' }
        );
    }
}

async function getAllUsers(req, res) {
    try {
        const result = await authService.getAllUsers();
        if (result.status !== statusCode.OK) {
            return res.status(
                result.status).json({
                message: result.message
            });
        }
        return res.status(
            result.status).json({
            message: result.message,
            data: result.data
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(
            statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error' }
        );
    }
}

export {
    login,
    createUser,
    getAllUsers,
}
