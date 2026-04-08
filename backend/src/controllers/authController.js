import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import logger from '../utils/logger.js';
import { 
  UnauthorizedError, 
  ValidationError, 
  ConflictError 
} from '../utils/errorHandler.js';

// Mock user database (in production, this would be a real database)
const mockUsers = new Map();

// Generate mock JWT token for educational purposes
const generateMockToken = (user) => {
  const payload = {
    id: user.id,
    phoneNumber: user.phoneNumber,
    isSimulated: true,
    purpose: 'educational_demo'
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'educational_demo_secret', {
    expiresIn: '24h'
  });
};

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Simulate sending verification code (in production, this would use SMS service)
const simulateSendVerificationCode = (phoneNumber, code) => {
  logger.info(`Simulated SMS sent to ${phoneNumber}: Your verification code is ${code}`);
  return true;
};

const authController = {
  /**
   * Simulated login endpoint
   */
  async login(req, res) {
    try {
      const { phoneNumber, password } = req.body;
      
      logger.info(`Simulated login attempt for phone: ${phoneNumber}`);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user exists in mock database
      const user = mockUsers.get(phoneNumber);
      
      if (user) {
        // In real app, verify password
        if (password && user.passwordHash) {
          const isValidPassword = await bcrypt.compare(password, user.passwordHash);
          if (!isValidPassword) {
            throw new UnauthorizedError('Invalid credentials');
          }
        }
      } else {
        // Create new mock user for demo
        const newUser = {
          id: crypto.randomUUID(),
          phoneNumber,
          passwordHash: password ? await bcrypt.hash(password, 10) : null,
          email: null,
          isVerified: false,
          createdAt: new Date().toISOString(),
          isSimulated: true
        };
        
        mockUsers.set(phoneNumber, newUser);
        logger.info(`Created new mock user: ${phoneNumber}`);
      }
      
      const userData = mockUsers.get(phoneNumber);
      
      // Generate mock token
      const token = generateMockToken(userData);
      
      // Log educational message
      logger.warn(`EDUCATIONAL DEMO: This is a simulated login. In a real attack scenario,`);
      logger.warn(`an attacker would try to intercept this token or use it for unauthorized access.`);
      
      res.status(200).json({
        success: true,
        message: 'Simulated login successful',
        token,
        user: {
          id: userData.id,
          phoneNumber: userData.phoneNumber,
          isVerified: userData.isVerified,
          isSimulated: true
        },
        securityNote: 'This is an educational demo. No real authentication occurred.',
        educationalTips: [
          'In real scenarios, always use HTTPS',
          'Enable two-factor authentication',
          'Never share verification codes',
          'Use strong, unique passwords'
        ]
      });
      
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Simulated registration endpoint
   */
  async register(req, res) {
    try {
      const { phoneNumber, email, password } = req.body;
      
      logger.info(`Simulated registration for phone: ${phoneNumber}`);
      
      // Check if user already exists
      if (mockUsers.has(phoneNumber)) {
        throw new ConflictError('User already exists');
      }
      
      // Generate verification code
      const verificationCode = generateVerificationCode();
      
      // Simulate sending verification code
      simulateSendVerificationCode(phoneNumber, verificationCode);
      
      // Create mock user
      const newUser = {
        id: crypto.randomUUID(),
        phoneNumber,
        email: email || null,
        passwordHash: password ? await bcrypt.hash(password, 10) : null,
        verificationCode,
        verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        isVerified: false,
        createdAt: new Date().toISOString(),
        isSimulated: true
      };
      
      mockUsers.set(phoneNumber, newUser);
      
      logger.info(`Educational note: In a real attack, registration forms can be used`);
      logger.info(`for credential harvesting if not properly secured.`);
      
      res.status(201).json({
        success: true,
        message: 'Simulated registration successful',
        note: 'Verification code sent (simulated)',
        educationalWarning: 'Real attackers might use fake registration forms to steal credentials',
        securityTips: [
          'Always verify the website URL before entering credentials',
          'Check for HTTPS and security certificates',
          'Use password managers to avoid phishing'
        ]
      });
      
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Simulated verification endpoint
   */
  async verify(req, res) {
    try {
      const { phoneNumber, code } = req.body;
      
      const user = mockUsers.get(phoneNumber);
      
      if (!user) {
        throw new ValidationError('User not found');
      }
      
      // Check if verification code matches and is not expired
      if (user.verificationCode !== code) {
        throw new ValidationError('Invalid verification code');
      }
      
      if (new Date() > new Date(user.verificationCodeExpires)) {
        throw new ValidationError('Verification code expired');
      }
      
      // Mark user as verified
      user.isVerified = true;
      user.verificationCode = null;
      user.verificationCodeExpires = null;
      mockUsers.set(phoneNumber, user);
      
      logger.warn(`EDUCATIONAL DEMO: In real attacks, attackers might try to`);
      logger.warn(`intercept SMS verification codes (SIM swapping attacks).`);
      
      res.status(200).json({
        success: true,
        message: 'Simulated verification successful',
        user: {
          phoneNumber: user.phoneNumber,
          isVerified: user.isVerified,
          isSimulated: true
        },
        securityWarning: 'Real attackers use SIM swapping or social engineering to intercept verification codes',
        protectionTips: [
          'Enable SIM lock with your mobile provider',
          'Use authenticator apps instead of SMS when possible',
          'Contact your provider immediately if you lose service unexpectedly'
        ]
      });
      
    } catch (error) {
      logger.error(`Verification error: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Simulated logout endpoint
   */
  async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (token) {
        logger.info(`Simulated logout for token`);
        // In real app, you might blacklist the token
      }
      
      res.status(200).json({
        success: true,
        message: 'Simulated logout successful',
        note: 'In a secure app, tokens should be invalidated server-side'
      });
      
    } catch (error) {
      logger.error(`Logout error: ${error.message}`);
      throw error;
    }
  }
};

export default authController;