import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';

/**
 * Middleware to validate request using express-validator
 * Stops request processing if validation fails
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Log validation errors
    logger.warn(`Validation failed for ${req.method} ${req.path}: ${JSON.stringify(errors.array())}`);
    
    // Return structured error response
    return res.status(400).json({
      success: false,
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      })),
      message: 'Validation failed. Please check your input.',
      educationalNote: 'Input validation is a critical security measure to prevent injection attacks'
    });
  }
  
  next();
};

/**
 * Sanitize input to prevent XSS attacks
 * Removes or encodes potentially dangerous characters
 */
export const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    sanitizeObject(req.body);
  }
  
  // Sanitize query parameters
  if (req.query) {
    sanitizeObject(req.query);
  }
  
  // Sanitize params
  if (req.params) {
    sanitizeObject(req.params);
  }
  
  next();
};

/**
 * Recursively sanitize object values
 */
function sanitizeObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Basic XSS prevention - encode HTML entities
      obj[key] = obj[key]
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
      
      // Trim whitespace
      obj[key] = obj[key].trim();
      
      // Limit length (prevent DoS via large payloads)
      if (obj[key].length > 10000) {
        obj[key] = obj[key].substring(0, 10000);
        logger.warn(`Input truncated for field: ${key}`);
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

/**
 * Validate API key (for external integrations)
 */
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  // In production, this would check against a database
  // For educational purposes, we'll use a simple check
  const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
  
  if (!apiKey) {
    logger.warn('API request without API key');
    return res.status(401).json({
      success: false,
      error: 'API key required',
      message: 'Include your API key in the X-API-Key header or api_key query parameter'
    });
  }
  
  if (validApiKeys.length > 0 && !validApiKeys.includes(apiKey)) {
    logger.warn(`Invalid API key attempt: ${apiKey.substring(0, 8)}...`);
    return res.status(403).json({
      success: false,
      error: 'Invalid API key',
      message: 'The provided API key is not valid',
      educationalNote: 'Proper API key validation prevents unauthorized access to your services'
    });
  }
  
  // Log successful API key validation (in production, use less verbose logging)
  logger.info(`API request with valid key: ${apiKey.substring(0, 8)}...`);
  next();
};

/**
 * Validate JWT token (placeholder - in production use a proper JWT library)
 */
export const validateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Request without authorization header');
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'Include a Bearer token in the Authorization header'
    });
  }
  
  const token = authHeader.substring(7);
  
  // In production, use a proper JWT library like jsonwebtoken
  // This is a simplified educational implementation
  try {
    // Simulated token validation
    if (token.length < 10) {
      throw new Error('Token too short');
    }
    
    // Extract user info from token (simulated)
    // In real implementation, this would decode and verify the JWT
    req.user = {
      id: 'demo_user',
      role: 'student',
      permissions: ['read', 'simulate'],
      tokenIssuedAt: new Date().toISOString()
    };
    
    logger.info(`JWT validated for user: ${req.user.id}`);
    next();
  } catch (error) {
    logger.error(`JWT validation failed: ${error.message}`);
    return res.status(403).json({
      success: false,
      error: 'Invalid token',
      message: 'The provided authentication token is invalid or expired',
      educationalNote: 'Proper token validation prevents unauthorized access. Tokens should be signed, verified, and have expiration checks.'
    });
  }
};

/**
 * Rate limiting middleware (basic implementation)
 */
export const rateLimit = (windowMs = 60000, maxRequests = 100) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    
    const timestamps = requests.get(ip);
    
    // Remove timestamps outside the window
    while (timestamps.length > 0 && timestamps[0] < now - windowMs) {
      timestamps.shift();
    }
    
    // Check if over limit
    if (timestamps.length >= maxRequests) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        message: `Rate limit exceeded. Please wait ${Math.ceil((timestamps[0] + windowMs - now) / 1000)} seconds.`,
        educationalNote: 'Rate limiting prevents brute force attacks and DoS attacks.'
      });
    }
    
    // Add current timestamp
    timestamps.push(now);
    requests.set(ip, timestamps);
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - timestamps.length);
    res.setHeader('X-RateLimit-Reset', Math.ceil((timestamps[0] + windowMs) / 1000));
    
    next();
  };
};

export default {
  validateRequest,
  sanitizeInput,
  validateApiKey,
  validateJWT,
  rateLimit
};