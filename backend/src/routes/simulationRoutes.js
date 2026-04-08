import { Router } from 'express';
import simulationController from '../controllers/simulationController.js';
import { validateRequest } from '../middleware/validation.js';
import { body } from 'express-validator';

const router = Router();

// Validation middleware for simulation requests
const simulationValidation = [
  body('target')
    .optional()
    .isString()
    .withMessage('Target must be a string'),
  body('simulationType')
    .isIn(['phishing', 'brute-force', 'social-engineering', 'malware'])
    .withMessage('Invalid simulation type')
];

/**
 * @swagger
 * /api/simulation/attacks:
 *   get:
 *     summary: Get available simulation types
 *     description: Returns list of simulated attack types for educational purposes
 *     tags: [Simulation]
 *     responses:
 *       200:
 *         description: List of simulation types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 simulations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       riskLevel:
 *                         type: string
 *                 educationalNote:
 *                   type: string
 */
router.get('/attacks', simulationController.getAvailableAttacks);

/**
 * @swagger
 * /api/simulation/phishing:
 *   post:
 *     summary: Run phishing simulation
 *     description: Simulates a phishing attack for educational purposes
 *     tags: [Simulation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - target
 *             properties:
 *               target:
 *                 type: string
 *                 example: "user@example.com"
 *               simulationType:
 *                 type: string
 *                 default: "phishing"
 *     responses:
 *       200:
 *         description: Phishing simulation results
 */
router.post('/phishing', simulationValidation, validateRequest, simulationController.runPhishingSimulation);

/**
 * @swagger
 * /api/simulation/brute-force:
 *   post:
 *     summary: Run brute force simulation
 *     description: Simulates a brute force attack for educational purposes
 *     tags: [Simulation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - target
 *             properties:
 *               target:
 *                 type: string
 *                 example: "user123"
 *               simulationType:
 *                 type: string
 *                 default: "brute-force"
 *     responses:
 *       200:
 *         description: Brute force simulation results
 */
router.post('/brute-force', simulationValidation, validateRequest, simulationController.runBruteForceSimulation);

/**
 * @swagger
 * /api/simulation/social-engineering:
 *   post:
 *     summary: Run social engineering simulation
 *     description: Simulates social engineering techniques for educational purposes
 *     tags: [Simulation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - target
 *             properties:
 *               target:
 *                 type: string
 *               simulationType:
 *                 type: string
 *                 default: "social-engineering"
 *     responses:
 *       200:
 *         description: Social engineering simulation results
 */
router.post('/social-engineering', simulationValidation, validateRequest, simulationController.runSocialEngineeringSimulation);

/**
 * @swagger
 * /api/simulation/stats:
 *   get:
 *     summary: Get simulation statistics
 *     description: Returns educational statistics about real-world attacks
 *     tags: [Simulation]
 *     responses:
 *       200:
 *         description: Simulation statistics
 */
router.get('/stats', simulationController.getSimulationStats);

export default router;