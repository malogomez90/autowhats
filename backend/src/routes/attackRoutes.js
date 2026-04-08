import { Router } from 'express';
import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';
import {
  simulateRecon,
  simulateSimSwap,
  simulateWebHijack,
  getAttackStatus,
  getActiveAttacks
} from '../attack-engine/attackController.js';
import logger from '../utils/logger.js';

const router = Router();

// Validation middleware for reconnaissance
const reconValidation = [
  body('phoneNumber')
    .isMobilePhone('any', { strictMode: false })
    .withMessage('Please provide a valid phone number')
    .custom((value) => {
      // Check if it's a Spanish number (starts with +34 or 34)
      const clean = value.replace(/\D/g, '');
      if (!clean.startsWith('34')) {
        throw new Error('Only Spanish phone numbers (+34) are supported in this simulation');
      }
      return true;
    })
];

// Validation middleware for SIM swap attack
const simSwapValidation = [
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('reconId')
    .optional()
    .isString()
    .withMessage('Recon ID must be a string')
];

// Validation middleware for attack status
const statusValidation = [
  param('attackId')
    .isString()
    .withMessage('Attack ID must be a string')
    .isLength({ min: 10, max: 100 })
    .withMessage('Invalid attack ID format')
];

/**
 * @swagger
 * /api/attack/recon:
 *   post:
 *     summary: Perform reconnaissance on a phone number
 *     description: Simulates OSINT gathering and operator detection for educational purposes.
 *     tags: [Attack Simulation]
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
 *                 example: "+34632983603"
 *                 description: Spanish phone number (+34 format)
 *     responses:
 *       200:
 *         description: Reconnaissance results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     attackId:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     operator:
 *                       type: object
 *                     vulnerabilities:
 *                       type: array
 *                 warning:
 *                   type: string
 *       400:
 *         description: Invalid phone number
 *       500:
 *         description: Internal server error
 */
router.post('/recon', reconValidation, validateRequest, async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    logger.info(`[API] Reconnaissance requested for ${phoneNumber}`);
    
    const result = simulateRecon(phoneNumber);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        legalNotice: 'This is a simulation for educational purposes only.'
      });
    }
    
    res.json({
      success: true,
      data: result.data,
      warning: 'EDUCATIONAL SIMULATION - NO REAL ATTACK PERFORMED',
      legalDisclaimer: 'All data is synthetically generated. No real user data is accessed.'
    });
  } catch (error) {
    logger.error(`[API] Recon error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error during reconnaissance simulation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/attack/sim-swap:
 *   post:
 *     summary: Simulate a SIM swap attack
 *     description: Educational simulation of SIM swap attack process and outcomes.
 *     tags: [Attack Simulation]
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
 *                 example: "+34632983603"
 *               reconId:
 *                 type: string
 *                 example: "attack_123456789"
 *                 description: Optional reconnaissance ID from previous recon
 *     responses:
 *       200:
 *         description: SIM swap simulation results
 *       400:
 *         description: Invalid input or missing reconnaissance data
 */
router.post('/sim-swap', simSwapValidation, validateRequest, async (req, res) => {
  try {
    const { phoneNumber, reconId } = req.body;
    
    logger.info(`[API] SIM swap simulation requested for ${phoneNumber}`);
    
    // Get recon data if reconId provided
    let reconData = null;
    
    const result = simulateSimSwap(phoneNumber, reconData);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        suggestion: 'Perform reconnaissance first to gather operator information'
      });
    }
    
    res.json({
      success: true,
      data: result.data,
      legalWarning: '⚠️ SIMULATION ONLY - Real SIM swap attacks are illegal without authorization',
      educationalPurpose: 'This demonstrates how SIM swap attacks work for security awareness training.'
    });
  } catch (error) {
    logger.error(`[API] SIM swap error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error during SIM swap simulation'
    });
  }
});

/**
 * @swagger
 * /api/attack/web-hijack:
 *   post:
 *     summary: Simulate WhatsApp Web hijacking
 *     description: Educational simulation of WhatsApp Web session hijacking.
 *     tags: [Attack Simulation]
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
 *                 example: "+34632983603"
 *     responses:
 *       200:
 *         description: Web hijack simulation results
 */
router.post('/web-hijack', reconValidation, validateRequest, async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    logger.info(`[API] WhatsApp Web hijack simulation requested for ${phoneNumber}`);
    
    const result = simulateWebHijack(phoneNumber);
    
    res.json({
      success: true,
      data: result.data,
      warning: 'WhatsApp Web hijacking simulated for educational purposes only',
      protectionTips: [
        'Always log out of WhatsApp Web when not using it',
        'Never scan QR codes from untrusted sources',
        'Enable two-step verification in WhatsApp settings',
        'Regularly check active sessions in WhatsApp'
      ]
    });
  } catch (error) {
    logger.error(`[API] Web hijack error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error during web hijack simulation'
    });
  }
});

/**
 * @swagger
 * /api/attack/status/{attackId}:
 *   get:
 *     summary: Get status of an attack simulation
 *     description: Retrieve current status and logs for a specific attack simulation.
 *     tags: [Attack Simulation]
 *     parameters:
 *       - in: path
 *         name: attackId
 *         required: true
 *         schema:
 *           type: string
 *         description: Attack ID from reconnaissance or attack simulation
 *     responses:
 *       200:
 *         description: Attack status and logs
 *       404:
 *         description: Attack ID not found
 */
router.get('/status/:attackId', statusValidation, validateRequest, async (req, res) => {
  try {
    const { attackId } = req.params;
    
    logger.info(`[API] Status requested for attack ${attackId}`);
    
    const result = getAttackStatus(attackId);
    
    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error,
        suggestion: 'Check if the attack ID is correct or if the simulation has expired'
      });
    }
    
    res.json({
      success: true,
      data: result.data,
      note: 'Attack simulations expire after 24 hours for privacy and security'
    });
  } catch (error) {
    logger.error(`[API] Status check error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error during status check'
    });
  }
});

/**
 * @swagger
 * /api/attack/active:
 *   get:
 *     summary: Get all active attack simulations
 *     description: List all currently active attack simulations for monitoring.
 *     tags: [Attack Simulation]
 *     responses:
 *       200:
 *         description: List of active attacks
 */
router.get('/active', async (req, res) => {
  try {
    logger.info('[API] Active attacks list requested');
    
    const result = getActiveAttacks();
    
    res.json({
      success: true,
      data: result.data,
      disclaimer: 'Active simulations are stored in memory only and will be lost on server restart'
    });
  } catch (error) {
    logger.error(`[API] Active attacks error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error retrieving active attacks'
    });
  }
});

/**
 * @swagger
 * /api/attack/capabilities:
 *   get:
 *     summary: Get available attack simulation capabilities
 *     description: List all attack types and capabilities supported by the simulator.
 *     tags: [Attack Simulation]
 *     responses:
 *       200:
 *         description: Capabilities information
 */
router.get('/capabilities', async (req, res) => {
  try {
    logger.info('[API] Capabilities requested');
    
    const capabilities = {
      simulator: 'WhatsApp Pentest Simulator',
      version: '1.0.0',
      purpose: 'Educational security demonstration',
      availableAttacks: [
        {
          type: 'RECON',
          name: 'Reconnaissance',
          description: 'OSINT gathering and operator detection',
          endpoint: 'POST /api/attack/recon',
          parameters: ['phoneNumber']
        },
        {
          type: 'SIM_SWAP',
          name: 'SIM Swap Attack',
          description: 'SIM card replacement simulation',
          endpoint: 'POST /api/attack/sim-swap',
          parameters: ['phoneNumber', 'reconId (optional)']
        },
        {
          type: 'WEB_HIJACK',
          name: 'WhatsApp Web Hijacking',
          description: 'Session hijacking via QR code interception',
          endpoint: 'POST /api/attack/web-hijack',
          parameters: ['phoneNumber']
        }
      ],
      dataSources: [
        'Synthetic Spanish user data generation',
        'Spanish mobile operator database (MCC 214)',
        'Realistic chat and contact simulation',
        'Vulnerability probability calculations'
      ],
      limitations: [
        'No real attacks are performed',
        'All data is synthetically generated',
        'Spanish phone numbers only (+34)',
        'Simulations expire after 24 hours',
        'No persistence between server restarts'
      ],
      legal: {
        disclaimer: 'For educational purposes only',
        warning: 'Unauthorized access to systems is illegal',
        compliance: 'GDPR-compliant synthetic data',
        contact: 'security@example.com (placeholder)'
      }
    };
    
    res.json({
      success: true,
      data: capabilities,
      educationalNote: 'This simulator helps security professionals understand attack vectors to better defend against them.'
    });
  } catch (error) {
    logger.error(`[API] Capabilities error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error retrieving capabilities'
    });
  }
});

// Health check for attack engine
router.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    component: 'attack-engine',
    features: {
      recon: 'operational',
      simSwap: 'operational',
      webHijack: 'operational',
      dataGeneration: 'operational'
    },
    memory: {
      activeAttacks: Array.from(getActiveAttacks().data.attacks).length,
      maxCapacity: 100
    }
  };
  
  res.json(health);
});

export default router;