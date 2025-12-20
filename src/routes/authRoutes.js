import  express  from 'express';
import  * as authController  from '../controllers/authController.js';
import  {authMiddleWare}  from '../middlewares/authMiddleware.js';
import  {authorizeRoles}  from '../middlewares/roleMiddleware.js';

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and User Management
 */

/**
 * @swagger
 * /auth/create-user:
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */

router.post(
    '/create-user',
    authMiddleWare,
    authorizeRoles('ADMIN'),
    authController.createUser
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and receive JWT token
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

router.post(
    '/login',
    authController.login
);

export { router };