import { Router } from 'express';
import sessionController from '../controllers/sessionController.js';
import { validateRequest } from '../middleware/validation.js';
import { body } from 'express-validator';

const router = Router();

// Validation middleware
const sessionValidation = [
  body('deviceInfo')
    .optional()
    .isString()
    .withMessage('Device info must be a string'),
  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string')
];

/**
 * @swagger
 * /api/session/create:
 *   post:
 *     summary: Create a simulated session
 *     description: Simulates creating a new session for educational purposes
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceInfo:
 *                 type: string
 *                 example: "Windows 10, Chrome 120"
 *               location:
 *                 type: string
 *                 example: "New York, USA"
 *     responses:
 *       200:
 *         description: Simulated session created
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
 *                   example: "Simulated session created"
 *                 session:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "session_123"
 *                     deviceInfo:
 *                       type: string
 *                     location:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                 securityNote:
 *                   type: string
 *                   example: "In real attacks, session hijacking can occur if tokens are stolen"
 */
router.post('/create', sessionValidation, validateRequest, sessionController.createSession);

/**
 * @swagger
 * /api/session/status:
 *   get:
 *     summary: Get simulated session status
 *     description: Returns simulated session information for educational purposes
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Session status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 activeSessions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       device:
 *                         type: string
 *                       location:
 *                         type: string
 *                       lastActive:
 *                         type: string
 *                 educationalInfo:
 *                   type: object
 *                   properties:
 *                     threat:
 *                       type: string
 *                       example: "Session Hijacking"
 *                     description:
 *                       type: string
 *                     prevention:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.get('/status', sessionController.getSessionStatus);

/**
 * @swagger
 * /api/session/history:
 *   get:
 *     summary: Get simulated session history
 *     description: Returns simulated session history for educational purposes
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of sessions to return
 *     responses:
 *       200:
 *         description: Session history retrieved
 */
router.get('/history', sessionController.getSessionHistory);

/**
 * @swagger
 * /api/session/terminate:
 *   post:
 *     summary: Terminate a simulated session
 *     description: Simulates terminating a session for educational purposes
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "session_123"
 *     responses:
 *       200:
 *         description: Session terminated
 */
router.post('/terminate', sessionController.terminateSession);

export default router;