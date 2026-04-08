-- WhatsApp Hack Simulator Database Schema
-- Educational demo database - not for production use

-- Create database
CREATE DATABASE whatsapp_simulator;

-- Connect to database
\c whatsapp_simulator;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (simulated for educational purposes)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_simulated BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    security_level VARCHAR(20) DEFAULT 'basic',
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(100),
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP WITH TIME ZONE,
    educational_consent BOOLEAN DEFAULT true
);

-- Sessions table (simulated for educational purposes)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
);

-- Login attempts table (for educational monitoring)
CREATE TABLE IF NOT EXISTS login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20),
    ip_address INET,
    user_agent TEXT,
    attempt_status VARCHAR(20) NOT NULL, -- 'success', 'failed', 'blocked'
    failure_reason VARCHAR(100),
    is_simulated BOOLEAN DEFAULT true,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    country_code VARCHAR(10),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Simulation logs table
CREATE TABLE IF NOT EXISTS simulation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    simulation_type VARCHAR(50) NOT NULL,
    target_identifier VARCHAR(255),
    request_data JSONB,
    response_data JSONB,
    success BOOLEAN DEFAULT true,
    risk_level VARCHAR(20),
    educational_insights TEXT[],
    is_simulated BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration_ms INTEGER
);

-- Security events table
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- 'phishing_attempt', 'brute_force', 'suspicious_login'
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    location VARCHAR(100),
    is_simulated BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT
);

-- Educational content table
CREATE TABLE IF NOT EXISTS educational_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type VARCHAR(50) NOT NULL, -- 'tip', 'statistic', 'warning', 'resource'
    title VARCHAR(200),
    content TEXT NOT NULL,
    category VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_phone_number ON users(phone_number);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_login_attempts_phone_number ON login_attempts(phone_number);
CREATE INDEX idx_login_attempts_attempted_at ON login_attempts(attempted_at);
CREATE INDEX idx_simulation_logs_user_id ON simulation_logs(user_id);
CREATE INDEX idx_simulation_logs_simulation_type ON simulation_logs(simulation_type);
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_event_type ON security_events(event_type);
CREATE INDEX idx_educational_content_category ON educational_content(category);

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_educational_content_updated_at BEFORE UPDATE ON educational_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample educational content
INSERT INTO educational_content (content_type, title, content, category, display_order) VALUES
('tip', 'Enable Two-Factor Authentication', 'Always enable 2FA on your WhatsApp account for an extra layer of security.', 'authentication', 1),
('tip', 'Verify Unknown Links', 'Before clicking any link in a message, verify the sender and check the URL carefully.', 'phishing', 2),
('tip', 'Regular Security Checkups', 'Periodically review your active sessions and log out from unused devices.', 'sessions', 3),
('statistic', 'Phishing Attacks', 'Over 3.4 billion phishing emails are sent every year, with a 5% success rate.', 'awareness', 4),
('statistic', 'Password Reuse', '65% of people reuse passwords across multiple accounts, increasing breach risk.', 'passwords', 5),
('warning', 'Verification Code Sharing', 'Never share your WhatsApp verification code with anyone, even if they claim to be from support.', 'scams', 6),
('resource', 'WhatsApp Security Features', 'https://www.whatsapp.com/security', 'official', 7),
('resource', 'FTC Phishing Guide', 'https://www.consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams', 'government', 8);

-- Insert sample simulated user (for educational demo)
INSERT INTO users (phone_number, hashed_password, display_name, is_verified, security_level) VALUES
('+15551234567', '$2b$10$SimulatedPasswordHashForDemo', 'Security Student', true, 'advanced');

-- Create read-only user for monitoring tools
CREATE USER monitor WITH PASSWORD 'monitor123';
GRANT CONNECT ON DATABASE whatsapp_simulator TO monitor;
GRANT USAGE ON SCHEMA public TO monitor;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO monitor;

-- Create application user
CREATE USER app_user WITH PASSWORD 'app_password123';
GRANT CONNECT ON DATABASE whatsapp_simulator TO app_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Comments on tables
COMMENT ON TABLE users IS 'Simulated users for educational security demonstrations';
COMMENT ON TABLE sessions IS 'Simulated user sessions for demonstrating session security concepts';
COMMENT ON TABLE login_attempts IS 'Simulated login attempts for demonstrating authentication security';
COMMENT ON TABLE simulation_logs IS 'Logs of security simulations performed for educational purposes';
COMMENT ON TABLE security_events IS 'Simulated security events for demonstrating threat detection';
COMMENT ON TABLE educational_content IS 'Educational content displayed to users during simulations';

-- Print success message
\echo 'Database schema created successfully!'
\echo 'Educational demo database ready for use.'
\echo 'Remember: This is for educational purposes only. No real attacks are performed.'