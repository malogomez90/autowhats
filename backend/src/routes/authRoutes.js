import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

// Validation middleware for login
const loginValidation = [
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

// Validation middleware for registration
const registerValidation = [
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Simulated login with phone number
 *     description: This is a simulated login endpoint for educational purposes. No real authentication is performed.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Simulated login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Simulated login successful"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+1234567890"
 *       400:
 *         description: Validation error
 */
router.post('/login', loginValidation, validateRequest, authController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Simulated user registration
 *     description: This is a simulated registration endpoint for educational purposes.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Simulated registration successful
 */
router.post('/register', registerValidation, validateRequest, authController.register);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Simulated logout
 *     description: This is a simulated logout endpoint.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Simulated phone number verification
 *     description: This endpoint simulates phone number verification.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - code
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification successful
 */
router.post('/verify', authController.verify);

export default router;