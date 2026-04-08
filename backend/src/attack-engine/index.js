// WhatsApp Pentest Simulator - Attack Engine
// Main export module for attack simulation functionality

export * from './operators.js';
export * from './attackController.js';

// Version info
export const VERSION = '1.0.0';
export const BUILD = '2026-04-08';
export const PURPOSE = 'EDUCATIONAL_SIMULATION_ONLY';

// Security disclaimer
export const SECURITY_DISCLAIMER = `
╔═══════════════════════════════════════════════════════════════╗
║                ⚠️  SECURITY DISCLAIMER  ⚠️                 ║
╠═══════════════════════════════════════════════════════════════╣
║ This software is for EDUCATIONAL PURPOSES ONLY.              ║
║ No real attacks are performed. All data is synthetic.        ║
║ Unauthorized access to computer systems is ILLEGAL.          ║
║ Use only on systems you own or have explicit permission to test.║
╚═══════════════════════════════════════════════════════════════╝
`;

// Export default module
export default {
  // Operators
  operators: require('./operators.js'),
  
  // Attack controller
  controller: require('./attackController.js'),
  
  // Metadata
  version: VERSION,
  build: BUILD,
  purpose: PURPOSE,
  disclaimer: SECURITY_DISCLAIMER
};