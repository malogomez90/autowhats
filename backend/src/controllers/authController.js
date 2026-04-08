import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import logger from '../utils/logger.js';
import { isDatabaseReady, query } from '../utils/database.js';
import { 
  UnauthorizedError, 
  ValidationError, 
  ConflictError 
} from '../utils/errorHandler.js';

// Mock user database (in production, this would be a real database)
const mockUsers = new Map();

const createStoredHash = async (password) => {
  const value = password || crypto.randomUUID();
  return bcrypt.hash(value, 10);
};

const mapDatabaseUser = (row) => ({
  id: row.id,
  phoneNumber: row.phone_number,
  email: row.email,
  passwordHash: row.hashed_password,
  verificationCode: row.verification_code,
  verificationCodeExpires: row.verification_code_expires,
  isVerified: row.is_verified,
  createdAt: row.created_at,
  isSimulated: row.is_simulated
});

const getUserByPhoneNumber = async (phoneNumber) => {
  if (!isDatabaseReady()) {
    return mockUsers.get(phoneNumber) || null;
  }

  const result = await query(
    `SELECT id, phone_number, email, hashed_password, verification_code, verification_code_expires,
            is_verified, created_at, is_simulated
     FROM users
     WHERE phone_number = $1`,
    [phoneNumber]
  );

  return result.rows[0] ? mapDatabaseUser(result.rows[0]) : null;
};

const createUser = async ({ phoneNumber, email = null, password, verificationCode = null, verificationCodeExpires = null, isVerified = false }) => {
  const passwordHash = await createStoredHash(password);
  const user = {
    id: crypto.randomUUID(),
    phoneNumber,
    email,
    passwordHash,
    verificationCode,
    verificationCodeExpires,
    isVerified,
    createdAt: new Date().toISOString(),
    isSimulated: true
  };

  if (!isDatabaseReady()) {
    mockUsers.set(phoneNumber, user);
    return user;
  }

  const result = await query(
    `INSERT INTO users (
      id, phone_number, email, hashed_password, verification_code, verification_code_expires,
      is_verified, is_simulated, created_at, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
    RETURNING id, phone_number, email, hashed_password, verification_code, verification_code_expires,
              is_verified, created_at, is_simulated`,
    [user.id, phoneNumber, email, passwordHash, verificationCode, verificationCodeExpires, isVerified]
  );

  return mapDatabaseUser(result.rows[0]);
};

const updateUserAfterLogin = async (phoneNumber) => {
  if (!isDatabaseReady()) {
    return;
  }

  await query(
    'UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE phone_number = $1',
    [phoneNumber]
  );
};

const markUserAsVerified = async (phoneNumber) => {
  if (!isDatabaseReady()) {
    const user = mockUsers.get(phoneNumber);
    if (!user) {
      return null;
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    mockUsers.set(phoneNumber, user);
    return user;
  }

  const result = await query(
    `UPDATE users
     SET is_verified = true,
         verification_code = NULL,
         verification_code_expires = NULL,
         updated_at = NOW()
     WHERE phone_number = $1
     RETURNING id, phone_number, email, hashed_password, verification_code, verification_code_expires,
               is_verified, created_at, is_simulated`,
    [phoneNumber]
  );

  return result.rows[0] ? mapDatabaseUser(result.rows[0]) : null;
};

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
      const user = await getUserByPhoneNumber(phoneNumber);
      
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
        const newUser = await createUser({ phoneNumber, password });
        logger.info(`Created new mock user: ${phoneNumber}`);
        await updateUserAfterLogin(phoneNumber);

        const token = generateMockToken(newUser);

        logger.warn(`EDUCATIONAL DEMO: This is a simulated login. In a real attack scenario,`);
        logger.warn(`an attacker would try to intercept this token or use it for unauthorized access.`);

        return res.status(200).json({
          success: true,
          message: 'Simulated login successful',
          token,
          user: {
            id: newUser.id,
            phoneNumber: newUser.phoneNumber,
            isVerified: newUser.isVerified,
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
      }
      
      await updateUserAfterLogin(phoneNumber);
      const userData = await getUserByPhoneNumber(phoneNumber);
      
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
      if (await getUserByPhoneNumber(phoneNumber)) {
        throw new ConflictError('User already exists');
      }
      
      // Generate verification code
      const verificationCode = generateVerificationCode();
      
      // Simulate sending verification code
      simulateSendVerificationCode(phoneNumber, verificationCode);
      
      // Create mock user
      await createUser({
        phoneNumber,
        email: email || null,
        password,
        verificationCode,
        verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000),
        isVerified: false
      });
      
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
      
      const user = await getUserByPhoneNumber(phoneNumber);
      
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
      const verifiedUser = await markUserAsVerified(phoneNumber);
      
      logger.warn(`EDUCATIONAL DEMO: In real attacks, attackers might try to`);
      logger.warn(`intercept SMS verification codes (SIM swapping attacks).`);
      
      res.status(200).json({
        success: true,
        message: 'Simulated verification successful',
        user: {
          phoneNumber: user.phoneNumber,
          isVerified: verifiedUser?.isVerified ?? true,
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
