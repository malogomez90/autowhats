import { Pool } from 'pg';
import logger from './logger.js';

const connectionString = process.env.DATABASE_URL;
const sslEnabled = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

const pool = connectionString ? new Pool({
  connectionString,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
  max: Number(process.env.DB_POOL_MAX || 10),
  idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_TIMEOUT || 30000),
  connectionTimeoutMillis: Number(process.env.DB_POOL_ACQUIRE_TIMEOUT || 10000)
}) : null;

let databaseReady = false;

const baseSchemaStatements = [
  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_simulated BOOLEAN DEFAULT true,
    verification_code VARCHAR(6),
    verification_code_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    security_level VARCHAR(20) DEFAULT 'basic',
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(100),
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP WITH TIME ZONE,
    educational_consent BOOLEAN DEFAULT true
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    device_info TEXT,
    ip_address INET,
    user_agent TEXT,
    location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_simulated BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    terminated_at TIMESTAMP WITH TIME ZONE,
    expiration_time TIMESTAMP WITH TIME ZONE NOT NULL
  )`,
  'CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number)',
  'CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)',
  'CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash)'
];

export const isDatabaseConfigured = () => Boolean(pool);
export const isDatabaseReady = () => databaseReady;

export const initializeDatabase = async () => {
  if (!pool) {
    logger.warn('DATABASE_URL is not configured. Using in-memory demo storage.');
    return false;
  }

  try {
    for (const statement of baseSchemaStatements) {
      await pool.query(statement);
    }

    databaseReady = true;
    logger.info('PostgreSQL connection established and schema verified');
    return true;
  } catch (error) {
    databaseReady = false;
    logger.error(`Database initialization failed: ${error.message}`);
    return false;
  }
};

export const query = async (text, params = []) => {
  if (!pool || !databaseReady) {
    throw new Error('Database is not ready');
  }

  return pool.query(text, params);
};

export const pingDatabase = async () => {
  if (!pool) {
    return { configured: false, ready: false };
  }

  try {
    const result = await pool.query('SELECT NOW() AS now');
    databaseReady = true;
    return {
      configured: true,
      ready: true,
      now: result.rows[0]?.now ?? null
    };
  } catch (error) {
    databaseReady = false;
    logger.error(`Database ping failed: ${error.message}`);
    return {
      configured: true,
      ready: false,
      error: error.message
    };
  }
};

