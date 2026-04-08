// Database of Spanish mobile operators with realistic MCC/MNC codes
// MCC 214 = Spain
// Source: https://www.mcc-mnc.com/

export const SPANISH_OPERATORS = {
  // Major operators
  'movistar': {
    name: 'Movistar España',
    mcc: 214,
    mnc: 7,
    country: 'ES',
    vulnerabilities: ['SIM_SWAP', 'SS7_EXPLOIT', 'ROAMING_ATTACK'],
    securityScore: 85, // Higher is more secure
    detectionTime: '2-4 hours', // Average time to detect SIM swap
    requiresDocumentation: true,
    notes: 'Strong security but social engineering vulnerable'
  },
  'vodafone': {
    name: 'Vodafone España',
    mcc: 214,
    mnc: 1,
    country: 'ES',
    vulnerabilities: ['SIM_SWAP', 'PHISHING', 'CALL_FORWARDING'],
    securityScore: 80,
    detectionTime: '1-3 hours',
    requiresDocumentation: false,
    notes: 'Online portal vulnerable to credential phishing'
  },
  'orange': {
    name: 'Orange España',
    mcc: 214,
    mnc: 3,
    country: 'ES',
    vulnerabilities: ['SIM_SWAP', 'WEBSOCKET_HIJACK', 'API_EXPLOIT'],
    securityScore: 75,
    detectionTime: '4-6 hours',
    requiresDocumentation: true,
    notes: 'Slow SIM swap process increases attack window'
  },
  'yoigo': {
    name: 'Yoigo (MásMóvil)',
    mcc: 214,
    mnc: 5,
    country: 'ES',
    vulnerabilities: ['SIM_SWAP', 'SMS_INTERCEPT', 'WEAK_AUTH'],
    securityScore: 70,
    detectionTime: '6-12 hours',
    requiresDocumentation: false,
    notes: 'MVNO with less security monitoring'
  },
  'digi': {
    name: 'Digi Mobil',
    mcc: 214,
    mnc: 19,
    country: 'ES',
    vulnerabilities: ['SIM_SWAP', 'PORTAL_EXPLOIT', 'NO_2FA'],
    securityScore: 65,
    detectionTime: '12-24 hours',
    requiresDocumentation: false,
    notes: 'Low-cost operator with minimal security'
  },
  'jazztel': {
    name: 'Jazztel',
    mcc: 214,
    mnc: 21,
    country: 'ES',
    vulnerabilities: ['SIM_SWAP', 'LEGACY_SYSTEMS', 'WEAK_PROCESS'],
    securityScore: 60,
    detectionTime: '24-48 hours',
    requiresDocumentation: true,
    notes: 'Legacy systems with slow response times'
  },
  'pepephone': {
    name: 'Pepephone',
    mcc: 214,
    mnc: 11,
    country: 'ES',
    vulnerabilities: ['SIM_SWAP', 'API_VULN', 'CUSTOMER_SERVICE'],
    securityScore: 68,
    detectionTime: '8-16 hours',
    requiresDocumentation: false,
    notes: 'Online-only operator, social engineering effective'
  },
  'simyo': {
    name: 'Simyo',
    mcc: 214,
    mnc: 25,
    country: 'ES',
    vulnerabilities: ['SIM_SWAP', 'PORTAL_2FA_BYPASS', 'EMAIL_RESET'],
    securityScore: 72,
    detectionTime: '6-12 hours',
    requiresDocumentation: false,
    notes: 'KPN subsidiary, moderate security'
  },
  'tuenti': {
    name: 'Tuenti (Movistar)',
    mcc: 214,
    mnc: 15,
    country: 'ES',
    vulnerabilities: ['SIM_SWAP', 'APP_EXPLOIT', 'YOUTH_TARGET'],
    securityScore: 62,
    detectionTime: '4-8 hours',
    requiresDocumentation: false,
    notes: 'Youth-focused operator, app-based security weak'
  },
  'republicamovil': {
    name: 'Republica Móvil',
    mcc: 214,
    mnc: 23,
    country: 'ES',
    vulnerabilities: ['SIM_SWAP', 'SMS_SPOOFING', 'VOICE_PHISHING'],
    securityScore: 58,
    detectionTime: '12-24 hours',
    requiresDocumentation: true,
    notes: 'Small operator with limited security budget'
  }
};

// Helper function to detect operator from phone number
export const detectOperator = (phoneNumber) => {
  // Clean phone number
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Spanish numbers start with +34 or 34
  if (!cleanNumber.startsWith('34') && cleanNumber.length < 9) {
    return null;
  }
  
  // Extract last 9 digits (Spanish mobile numbers are 9 digits after +34)
  const mobilePart = cleanNumber.slice(-9);
  
  // Simple IMSI-based detection simulation
  // In real scenarios, this would query HLR or use commercial APIs
  const operatorsList = Object.values(SPANISH_OPERATORS);
  
  // Simulate detection based on number patterns
  const hash = mobilePart.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const operatorIndex = hash % operatorsList.length;
  
  return {
    operator: operatorsList[operatorIndex],
    confidence: 85 + (hash % 15), // 85-99% confidence
    detectedVia: 'PATTERN_ANALYSIS',
    timestamp: new Date().toISOString()
  };
};

// Get operator by MNC
export const getOperatorByMNC = (mnc) => {
  return Object.values(SPANISH_OPERATORS).find(op => op.mnc === mnc) || null;
};

// Get all operators with specific vulnerability
export const getOperatorsByVulnerability = (vulnerability) => {
  return Object.values(SPANISH_OPERATORS)
    .filter(op => op.vulnerabilities.includes(vulnerability))
    .map(op => ({
      name: op.name,
      securityScore: op.securityScore,
      detectionTime: op.detectionTime
    }));
};

// Calculate attack success probability
export const calculateAttackProbability = (operatorName, attackType) => {
  const operator = SPANISH_OPERATORS[operatorName];
  if (!operator) return 0;
  
  let baseProbability = 100 - operator.securityScore;
  
  // Adjust based on attack type
  const adjustments = {
    'SIM_SWAP': 15,
    'SS7_EXPLOIT': 10,
    'PHISHING': 20,
    'SMS_INTERCEPT': 25,
    'API_EXPLOIT': 30
  };
  
  const adjustment = adjustments[attackType] || 0;
  const probability = Math.min(95, Math.max(5, baseProbability + adjustment));
  
  return {
    probability,
    factors: [
      `Operator security score: ${operator.securityScore}`,
      `Attack type modifier: +${adjustment}%`,
      `Detection time: ${operator.detectionTime}`,
      `Requires documentation: ${operator.requiresDocumentation ? 'Yes (harder)' : 'No (easier)'}`
    ]
  };
};

// Generate realistic attack timeline
export const generateAttackTimeline = (operatorName, attackType) => {
  const operator = SPANISH_OPERATORS[operatorName];
  if (!operator) return [];
  
  const steps = [
    { time: '0:00', action: 'Reconnaissance completed', status: 'COMPLETED' },
    { time: '0:05', action: 'Social engineering initiated', status: 'IN_PROGRESS' },
    { time: '0:30', action: 'Credential gathering', status: 'PENDING' },
    { time: '1:15', action: 'SIM swap request submitted', status: 'PENDING' },
    { time: '2:45', action: 'Operator verification bypass', status: 'PENDING' },
    { time: '4:20', action: 'New SIM activation', status: 'PENDING' },
    { time: '5:00', action: 'WhatsApp session hijack', status: 'PENDING' }
  ];
  
  // Adjust timeline based on operator detection time
  const detectionHours = parseInt(operator.detectionTime.split('-')[0]);
  const totalTime = detectionHours * 60; // Convert to minutes
  
  // Distribute steps across timeline
  return steps.map((step, index) => {
    const minute = Math.floor((index / steps.length) * totalTime);
    const hours = Math.floor(minute / 60);
    const mins = minute % 60;
    return {
      ...step,
      time: `${hours}:${mins.toString().padStart(2, '0')}`,
      estimatedCompletion: `${hours}h ${mins}m`
    };
  });
};

export default {
  SPANISH_OPERATORS,
  detectOperator,
  getOperatorByMNC,
  getOperatorsByVulnerability,
  calculateAttackProbability,
  generateAttackTimeline
};