import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import simulationRoutes from './routes/simulationRoutes.js';
import attackRoutes from './routes/attackRoutes.js';

// Import utilities
import logger from './utils/logger.js';
import errorHandler from './utils/errorHandler.js';
import { initializeDatabase, isDatabaseConfigured, isDatabaseReady, pingDatabase } from './utils/database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const database = await pingDatabase();
  const status = !database.configured || database.ready ? 'healthy' : 'degraded';

  res.status(status === 'healthy' ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    service: 'whatsapp-hack-simulator-backend',
    database
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/simulation', simulationRoutes);
app.use('/api/attack', attackRoutes);

// Documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'Welcome to WhatsApp Pentest Simulator API',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        logout: 'POST /api/auth/logout'
      },
      session: {
        create: 'POST /api/session/create',
        status: 'GET /api/session/status',
        history: 'GET /api/session/history'
      },
      simulation: {
        attacks: 'GET /api/simulation/attacks',
        phishing: 'POST /api/simulation/phishing',
        bruteForce: 'POST /api/simulation/brute-force'
      },
      attack: {
        recon: 'POST /api/attack/recon',
        simSwap: 'POST /api/attack/sim-swap',
        webHijack: 'POST /api/attack/web-hijack',
        status: 'GET /api/attack/status/:attackId',
        active: 'GET /api/attack/active',
        capabilities: 'GET /api/attack/capabilities',
        health: 'GET /api/attack/health'
      }
    },
    note: 'This is an educational demo. No real attacks are performed.',
    warning: '⚠️ All attack simulations use synthetic data only. Real attacks are illegal.'
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'The requested API endpoint does not exist.'
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Database configured: ${isDatabaseConfigured()}`);
    logger.info(`Database ready: ${isDatabaseReady()}`);
  });
};

startServer().catch((error) => {
  logger.error(`Failed to start server: ${error.message}`);
  process.exit(1);
});

export default app;
