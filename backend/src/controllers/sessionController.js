import logger from '../utils/logger.js';
import crypto from 'crypto';
import { isDatabaseReady, query } from '../utils/database.js';

// Mock session storage (in production, this would be a database)
const mockSessions = new Map();

const createTokenHash = () => crypto.createHash('sha256').update(crypto.randomUUID()).digest('hex');

const mapDatabaseSession = (row) => ({
  id: row.id,
  userId: row.user_id,
  deviceInfo: row.device_info,
  location: row.location,
  ipAddress: row.ip_address,
  userAgent: row.user_agent,
  createdAt: row.created_at,
  lastActive: row.last_active,
  isActive: row.is_active,
  isSimulated: row.is_simulated
});

const sessionController = {
  /**
   * Create a simulated session
   */
  async createSession(req, res) {
    try {
      const { deviceInfo = 'Unknown Device', location = 'Unknown Location' } = req.body;
      const userId = req.user?.id || 'demo_user';
      
      // Generate mock session ID
      const sessionId = `session_${crypto.randomBytes(8).toString('hex')}`;
      
      // Create mock session
      const session = {
        id: crypto.randomUUID(),
        userId,
        tokenHash: createTokenHash(),
        deviceInfo,
        location,
        ipAddress: req.ip || `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: req.get('user-agent') || 'Unknown',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        isSimulated: true
      };
      
      if (isDatabaseReady()) {
        await query(
          `INSERT INTO sessions (
            id, user_id, token_hash, device_info, ip_address, user_agent, location,
            is_active, is_simulated, created_at, last_active, expiration_time
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, true, true, NOW(), NOW(), $8)`,
          [session.id, userId, session.tokenHash, deviceInfo, session.ipAddress, session.userAgent, location, session.expirationTime]
        );
      } else {
        mockSessions.set(session.id, session);
      }
      
      logger.info(`Simulated session created: ${session.id} for user: ${userId}`);
      
      // Educational warning
      logger.warn(`EDUCATIONAL DEMO: In real attacks, attackers might:`);
      logger.warn(`1. Steal session cookies/tokens`);
      logger.warn(`2. Use session fixation attacks`);
      logger.warn(`3. Perform session hijacking`);
      
      res.status(200).json({
        success: true,
        message: 'Simulated session created',
        session: {
          id: session.id,
          deviceInfo: session.deviceInfo,
          location: session.location,
          createdAt: session.createdAt,
          isSimulated: true
        },
        securityNote: 'In real attacks, session hijacking can occur if tokens are stolen',
        educationalTips: [
          'Always log out from shared devices',
          'Use secure, HTTP-only cookies',
          'Implement session expiration',
          'Monitor active sessions regularly',
          'Use device fingerprinting for additional security'
        ]
      });
      
    } catch (error) {
      logger.error(`Session creation error: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Get simulated session status
   */
  async getSessionStatus(req, res) {
    try {
      const userId = req.user?.id || 'demo_user';
      
      // Filter sessions for this user
      const userSessions = isDatabaseReady()
        ? (await query(
          `SELECT id, user_id, device_info, location, ip_address, user_agent,
                  created_at, last_active, is_active, is_simulated
           FROM sessions
           WHERE user_id = $1 AND is_active = true
           ORDER BY last_active DESC`,
          [userId]
        )).rows.map(row => {
          const session = mapDatabaseSession(row);
          return {
            id: session.id,
            device: session.deviceInfo,
            location: session.location,
            ipAddress: session.ipAddress,
            lastActive: session.lastActive,
            isSimulated: session.isSimulated
          };
        })
        : Array.from(mockSessions.values())
          .filter(session => session.userId === userId && session.isActive)
          .map(session => ({
            id: session.id,
            device: session.deviceInfo,
            location: session.location,
            ipAddress: session.ipAddress,
            lastActive: session.lastActive,
            isSimulated: true
          }));
      
      logger.info(`Retrieved ${userSessions.length} active sessions for user: ${userId}`);
      
      res.status(200).json({
        success: true,
        activeSessions: userSessions,
        educationalInfo: {
          threat: 'Session Hijacking',
          description: 'Attackers steal session tokens to impersonate users without credentials',
          commonMethods: [
            'Cross-site scripting (XSS) attacks',
            'Man-in-the-middle attacks',
            'Session fixation',
            'Cookie theft via malware'
          ],
          prevention: [
            'Use HTTPS everywhere',
            'Implement HttpOnly and Secure cookie flags',
            'Use short session timeouts',
            'Regenerate session IDs after login',
            'Implement CSRF protection'
          ]
        }
      });
      
    } catch (error) {
      logger.error(`Session status error: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Get simulated session history
   */
  async getSessionHistory(req, res) {
    try {
      const userId = req.user?.id || 'demo_user';
      const limit = parseInt(req.query.limit) || 10;
      
      // Get all sessions for user (active and inactive)
      const allSessions = isDatabaseReady()
        ? (await query(
          `SELECT id, user_id, device_info, location, ip_address, user_agent,
                  created_at, last_active, is_active, is_simulated
           FROM sessions
           WHERE user_id = $1
           ORDER BY created_at DESC
           LIMIT $2`,
          [userId, limit]
        )).rows.map(row => {
          const session = mapDatabaseSession(row);
          return {
            id: session.id,
            device: session.deviceInfo,
            location: session.location,
            ipAddress: session.ipAddress,
            createdAt: session.createdAt,
            lastActive: session.lastActive,
            isActive: session.isActive,
            isSimulated: session.isSimulated
          };
        })
        : Array.from(mockSessions.values())
          .filter(session => session.userId === userId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, limit)
          .map(session => ({
            id: session.id,
            device: session.deviceInfo,
            location: session.location,
            ipAddress: session.ipAddress,
            createdAt: session.createdAt,
            lastActive: session.lastActive,
            isActive: session.isActive,
            isSimulated: true
          }));
      
      logger.info(`Retrieved ${allSessions.length} historical sessions for user: ${userId}`);
      
      // Generate simulated suspicious activity for educational purposes
      const suspiciousActivities = [
        {
          type: 'Multiple Login Attempts',
          description: 'Failed login attempts from 3 different countries in 24 hours',
          severity: 'Medium',
          timestamp: new Date(Date.now() - 86400000).toISOString() // 24 hours ago
        },
        {
          type: 'Unusual Location',
          description: 'Login from a country you normally don\'t access from',
          severity: 'High',
          timestamp: new Date(Date.now() - 172800000).toISOString() // 48 hours ago
        },
        {
          type: 'New Device',
          description: 'First time login from this device/browser',
          severity: 'Low',
          timestamp: new Date(Date.now() - 259200000).toISOString() // 72 hours ago
        }
      ];
      
      res.status(200).json({
        success: true,
        sessions: allSessions,
        suspiciousActivities,
        statistics: {
          totalSessions: allSessions.length,
          activeSessions: allSessions.filter(s => s.isActive).length,
          uniqueLocations: [...new Set(allSessions.map(s => s.location))].length,
          uniqueDevices: [...new Set(allSessions.map(s => s.device))].length
        },
        securityNote: 'Regularly reviewing session history helps detect unauthorized access',
        monitoringTips: [
          'Enable login notifications',
          'Review active sessions weekly',
          'Log out from unused devices',
          'Use security alerts for new devices',
          'Check for suspicious IP addresses'
        ]
      });
      
    } catch (error) {
      logger.error(`Session history error: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Terminate a simulated session
   */
  async terminateSession(req, res) {
    try {
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          error: 'Session ID is required'
        });
      }
      
      let session;

      if (isDatabaseReady()) {
        const result = await query(
          `UPDATE sessions
           SET is_active = false, terminated_at = NOW(), last_active = NOW()
           WHERE id = $1
           RETURNING id, user_id, device_info, location, ip_address, user_agent,
                     created_at, last_active, is_active, is_simulated`,
          [sessionId]
        );
        session = result.rows[0] ? mapDatabaseSession(result.rows[0]) : null;
      } else {
        session = mockSessions.get(sessionId);
      }

      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }
      
      if (!isDatabaseReady()) {
        session.isActive = false;
        session.terminatedAt = new Date().toISOString();
        mockSessions.set(sessionId, session);
      }
      
      logger.info(`Terminated simulated session: ${sessionId}`);
      
      // Educational note about session management
      logger.warn(`EDUCATIONAL DEMO: Proper session management includes:`);
      logger.warn(`1. Allowing users to terminate sessions remotely`);
      logger.warn(`2. Automatic termination after inactivity`);
      logger.warn(`3. Termination on password change`);
      
      res.status(200).json({
        success: true,
        message: 'Simulated session terminated',
        session: {
          id: session.id,
          device: session.deviceInfo,
          terminatedAt: session.terminatedAt,
          wasActiveFor: `${Math.floor((new Date() - new Date(session.createdAt)) / 3600000)} hours`
        },
        securityBestPractices: [
          'Always provide a "Log out everywhere" option',
          'Send notification when sessions are terminated',
          'Log all session termination events',
          'Allow users to name/identify their devices',
          'Provide clear session management interface'
        ]
      });
      
    } catch (error) {
      logger.error(`Session termination error: ${error.message}`);
      throw error;
    }
  }
};

export default sessionController;
