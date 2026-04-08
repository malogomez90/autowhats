import {
  detectOperator,
  calculateAttackProbability,
  generateAttackTimeline,
  SPANISH_OPERATORS
} from './operators.js';
import { generateVictimData } from '../data-generator/victimData.js';
import logger from '../utils/logger.js';

// Simulated attack database (in-memory)
const activeAttacks = new Map();
const attackLogs = new Map();

// Generate unique attack ID
const generateAttackId = () => {
  return `attack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Simulate reconnaissance
export const simulateRecon = (phoneNumber) => {
  const startTime = Date.now();
  const attackId = generateAttackId();
  
  logger.info(`[RECON] Starting reconnaissance for ${phoneNumber}`);
  
  // Detect operator
  const operatorDetection = detectOperator(phoneNumber);
  if (!operatorDetection) {
    return {
      success: false,
      error: 'Could not detect operator. Phone number may not be Spanish.',
      attackId: null
    };
  }
  
  const { operator, confidence, detectedVia } = operatorDetection;
  
  // Generate victim profile
  const victimProfile = generateVictimData(phoneNumber);
  
  // Calculate vulnerabilities
  const vulnerabilities = operator.vulnerabilities.map(vuln => ({
    type: vuln,
    probability: calculateAttackProbability(Object.keys(SPANISH_OPERATORS).find(key => SPANISH_OPERATORS[key] === operator), vuln).probability,
    description: getVulnerabilityDescription(vuln)
  }));
  
  // Sort by probability (highest first)
  vulnerabilities.sort((a, b) => b.probability - a.probability);
  
  const reconData = {
    attackId,
    phoneNumber,
    timestamp: new Date().toISOString(),
    operator: {
      name: operator.name,
      mcc: operator.mcc,
      mnc: operator.mnc,
      securityScore: operator.securityScore,
      detectionTime: operator.detectionTime,
      requiresDocumentation: operator.requiresDocumentation
    },
    detection: {
      confidence,
      method: detectedVia,
      reliability: 'HIGH'
    },
    victim: {
      name: victimProfile.name,
      age: victimProfile.age,
      location: victimProfile.location,
      riskScore: calculateRiskScore(victimProfile)
    },
    vulnerabilities,
    recommendedAttack: vulnerabilities[0]?.type || 'SIM_SWAP',
    estimatedSuccessRate: vulnerabilities[0]?.probability || 70,
    timeElapsed: Date.now() - startTime
  };
  
  // Store in memory
  activeAttacks.set(attackId, {
    type: 'recon',
    data: reconData,
    status: 'COMPLETED',
    startTime
  });
  
  logger.info(`[RECON] Completed for ${phoneNumber} - Attack ID: ${attackId}`);
  
  return {
    success: true,
    data: reconData,
    warning: 'EDUCATIONAL SIMULATION ONLY - NO REAL ATTACK PERFORMED'
  };
};

// Simulate SIM swap attack
export const simulateSimSwap = (phoneNumber, reconData) => {
  const startTime = Date.now();
  const attackId = generateAttackId();
  
  logger.info(`[SIM_SWAP] Starting attack for ${phoneNumber}`);
  
  const operator = reconData?.operator || detectOperator(phoneNumber)?.operator;
  if (!operator) {
    return {
      success: false,
      error: 'Operator information required. Perform reconnaissance first.',
      attackId: null
    };
  }
  
  // Generate attack timeline
  const timeline = generateAttackTimeline(
    Object.keys(SPANISH_OPERATORS).find(key => SPANISH_OPERATORS[key] === operator),
    'SIM_SWAP'
  );
  
  // Simulate attack steps with realistic delays
  const steps = timeline.map(step => ({
    ...step,
    completed: step.status === 'COMPLETED',
    log: `[${step.time}] ${step.action}`,
    details: getStepDetails(step.action)
  }));
  
  // Calculate success probability
  const successProbability = calculateAttackProbability(
    Object.keys(SPANISH_OPERATORS).find(key => SPANISH_OPERATORS[key] === operator),
    'SIM_SWAP'
  );
  
  // Determine outcome (weighted random)
  const randomFactor = Math.random() * 100;
  const success = randomFactor <= successProbability.probability;
  
  // Generate victim data if attack successful
  const victimData = success ? generateVictimData(phoneNumber) : null;
  
  const attackResult = {
    attackId,
    phoneNumber,
    timestamp: new Date().toISOString(),
    type: 'SIM_SWAP',
    operator: operator.name,
    success,
    probability: successProbability.probability,
    factors: successProbability.factors,
    timeline: steps,
    duration: '4-6 hours (simulated)',
    logs: generateAttackLogs(steps),
    ...(success && victimData ? {
      compromisedData: {
        chats: victimData.chats.slice(0, 5), // First 5 chats
        contacts: victimData.contacts.slice(0, 10), // First 10 contacts
        mediaCount: victimData.mediaFiles.length,
        lastSeen: victimData.lastSeen,
        statusUpdates: victimData.statusUpdates.slice(0, 3)
      },
      accessLevel: 'FULL',
      persistence: 'SESSION_HIJACKED',
      recommendedActions: [
        'Change WhatsApp password immediately',
        'Enable two-step verification',
        'Contact operator to revert SIM swap',
        'Monitor for unusual activity'
      ]
    } : {
      failureReason: getFailureReason(randomFactor, successProbability.probability),
      countermeasures: [
        'Operator detected unusual activity',
        'Additional verification required',
        'Attack flagged for review'
      ]
    })
  };
  
  // Store attack logs
  attackLogs.set(attackId, {
    attack: attackResult,
    rawLogs: attackResult.logs,
    timestamp: new Date().toISOString()
  });
  
  activeAttacks.set(attackId, {
    type: 'sim_swap',
    data: attackResult,
    status: success ? 'SUCCESS' : 'FAILED',
    startTime,
    endTime: Date.now()
  });
  
  logger.info(`[SIM_SWAP] ${success ? 'SUCCESS' : 'FAILED'} for ${phoneNumber} - ID: ${attackId}`);
  
  return {
    success: true,
    data: attackResult,
    legalWarning: '⚠️ SIMULATION ONLY - Real SIM swap is illegal without authorization'
  };
};

// Simulate WhatsApp Web hijacking
export const simulateWebHijack = (phoneNumber, reconData) => {
  const startTime = Date.now();
  const attackId = generateAttackId();
  
  logger.info(`[WEB_HIJACK] Starting attack for ${phoneNumber}`);
  
  // Generate QR code simulation
  const qrCodeId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const sessionToken = `session_${Math.random().toString(36).substr(2, 16)}`;
  
  // Simulate attack steps
  const steps = [
    { time: '0:00', action: 'Scanning for active WhatsApp Web sessions', status: 'COMPLETED' },
    { time: '0:15', action: 'QR code interception attempt', status: 'IN_PROGRESS' },
    { time: '1:30', action: 'Session token capture', status: 'PENDING' },
    { time: '2:45', action: 'Encryption key extraction', status: 'PENDING' },
    { time: '3:20', action: 'Session persistence establishment', status: 'PENDING' }
  ];
  
  // 60% success rate for demonstration
  const success = Math.random() < 0.6;
  
  const attackResult = {
    attackId,
    phoneNumber,
    timestamp: new Date().toISOString(),
    type: 'WEB_HIJACK',
    success,
    qrCodeId,
    sessionToken: success ? sessionToken : null,
    steps,
    technique: success ? 'QR_CODE_INTERCEPTION' : 'SESSION_TIMEOUT',
    logs: [
      `[0:00] Starting WhatsApp Web hijack simulation`,
      `[0:15] Generated QR code: ${qrCodeId}`,
      `[1:30] ${success ? 'Session token captured successfully' : 'Session expired before capture'}`,
      `[2:45] ${success ? 'Encryption keys extracted' : 'Failed to extract keys'}`,
      `[3:20] ${success ? 'Session hijack complete' : 'Attack terminated'}`
    ],
    ...(success ? {
      accessDuration: '24-48 hours (estimated)',
      detectionProbability: 'LOW',
      dataAccess: ['CHATS', 'CONTACTS', 'MEDIA', 'STATUS_UPDATES']
    } : {
      failureReason: 'Session timeout or user logout',
      retryPossible: true,
      cooldown: '30 minutes'
    })
  };
  
  activeAttacks.set(attackId, {
    type: 'web_hijack',
    data: attackResult,
    status: success ? 'SUCCESS' : 'FAILED',
    startTime,
    endTime: Date.now()
  });
  
  return {
    success: true,
    data: attackResult,
    warning: 'WhatsApp Web hijacking simulated for educational purposes only'
  };
};

// Get attack status
export const getAttackStatus = (attackId) => {
  const attack = activeAttacks.get(attackId);
  if (!attack) {
    return {
      success: false,
      error: 'Attack ID not found'
    };
  }
  
  const logs = attackLogs.get(attackId)?.rawLogs || [];
  
  return {
    success: true,
    data: {
      attackId,
      type: attack.type,
      status: attack.status,
      startTime: new Date(attack.startTime).toISOString(),
      ...(attack.endTime && { endTime: new Date(attack.endTime).toISOString() }),
      duration: attack.endTime ? `${((attack.endTime - attack.startTime) / 1000).toFixed(2)}s` : 'IN_PROGRESS',
      logs: logs.slice(-10), // Last 10 logs
      summary: getAttackSummary(attack)
    }
  };
};

// Get all active attacks
export const getActiveAttacks = () => {
  const attacks = Array.from(activeAttacks.entries()).map(([id, data]) => ({
    id,
    type: data.type,
    status: data.status,
    startTime: new Date(data.startTime).toISOString(),
    phoneNumber: data.data.phoneNumber
  }));
  
  return {
    success: true,
    data: {
      total: attacks.length,
      active: attacks.filter(a => a.status === 'IN_PROGRESS').length,
      attacks
    }
  };
};

// Helper functions
const getVulnerabilityDescription = (vulnerability) => {
  const descriptions = {
    'SIM_SWAP': 'Operator allows SIM replacement with social engineering',
    'SS7_EXPLOIT': 'SS7 protocol vulnerability allows call/SMS interception',
    'PHISHING': 'Customer portal vulnerable to credential theft',
    'SMS_INTERCEPT': 'SMS can be intercepted during delivery',
    'API_EXPLOIT': 'Public API endpoints have insufficient authentication',
    'ROAMING_ATTACK': 'Roaming protocols can be exploited',
    'CALL_FORWARDING': 'Call forwarding can be activated remotely',
    'WEBSOCKET_HIJACK': 'WebSocket connections vulnerable to hijacking',
    'WEAK_AUTH': 'Weak authentication mechanisms',
    'LEGACY_SYSTEMS': 'Outdated systems with known vulnerabilities',
    'API_VULN': 'API vulnerabilities allow unauthorized access',
    'CUSTOMER_SERVICE': 'Social engineering through customer service',
    'PORTAL_2FA_BYPASS': 'Two-factor authentication can be bypassed',
    'EMAIL_RESET': 'Email-based password reset vulnerable',
    'APP_EXPLOIT': 'Mobile app has security flaws',
    'YOUTH_TARGET': 'Youth-focused marketing reduces security awareness',
    'SMS_SPOOFING': 'SMS sender can be spoofed',
    'VOICE_PHISHING': 'Voice calls can be used for phishing'
  };
  
  return descriptions[vulnerability] || 'Unknown vulnerability';
};

const calculateRiskScore = (victimProfile) => {
  let score = 50; // Base score
  
  // Age factor (younger = higher risk)
  if (victimProfile.age < 25) score += 15;
  else if (victimProfile.age > 60) score += 10;
  
  // Location factor (urban = higher risk)
  if (victimProfile.location.city === 'Madrid' || victimProfile.location.city === 'Barcelona') {
    score += 10;
  }
  
  // Social media factor
  if (victimProfile.socialMedia.active) score += 15;
  
  // Employment factor (tech jobs = lower risk)
  if (victimProfile.employment.sector === 'TECH') score -= 10;
  
  return Math.min(100, Math.max(0, score));
};

const getStepDetails = (action) => {
  const details = {
    'Reconnaissance completed': 'Gathered OSINT data from public sources',
    'Social engineering initiated': 'Contacted operator posing as victim',
    'Credential gathering': 'Collected personal information for verification',
    'SIM swap request submitted': 'Submitted formal SIM replacement request',
    'Operator verification bypass': 'Used social engineering to bypass security',
    'New SIM activation': 'New SIM card activated on victim\'s number',
    'WhatsApp session hijack': 'WhatsApp re-registered on attacker device'
  };
  
  return details[action] || 'Standard attack step';
};

const generateAttackLogs = (steps) => {
  return steps.map(step => {
    const timestamp = new Date().toISOString();
    const status = step.completed ? '✅' : '⏳';
    return `[${timestamp}] ${status} ${step.log}`;
  });
};

const getFailureReason = (randomFactor, probability) => {
  if (randomFactor > probability + 20) {
    return 'Operator security measures detected attack';
  } else if (randomFactor > probability + 10) {
    return 'Victim noticed unusual activity and intervened';
  } else {
    return 'Technical failure during attack execution';
  }
};

const getAttackSummary = (attack) => {
  const summaries = {
    'recon': 'Reconnaissance completed successfully',
    'sim_swap': attack.status === 'SUCCESS' ? 'SIM swap attack successful' : 'SIM swap attack failed',
    'web_hijack': attack.status === 'SUCCESS' ? 'WhatsApp Web hijack successful' : 'Web hijack failed'
  };
  
  return summaries[attack.type] || 'Attack status unknown';
};

export default {
  simulateRecon,
  simulateSimSwap,
  simulateWebHijack,
  getAttackStatus,
  getActiveAttacks
};