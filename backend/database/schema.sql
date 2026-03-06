-- FitBook Auto Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credentials table (encrypted)
CREATE TABLE IF NOT EXISTS credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('classpass', 'mindbody', 'barrys', 'slt', 'y7')),
    encrypted_username TEXT NOT NULL,
    encrypted_password TEXT NOT NULL,
    iv TEXT NOT NULL,
    auth_tag TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_tested TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, platform)
);

-- Booking preferences
CREATE TABLE IF NOT EXISTS booking_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('classpass', 'mindbody', 'barrys', 'slt', 'y7')),
    studio_name VARCHAR(255) NOT NULL,
    class_name VARCHAR(255) NOT NULL,
    class_date DATE NOT NULL,
    class_time TIME NOT NULL,
    instructor VARCHAR(255),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking history
CREATE TABLE IF NOT EXISTS booking_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    preference_id UUID REFERENCES booking_preferences(id) ON DELETE SET NULL,
    platform VARCHAR(50) NOT NULL,
    studio_name VARCHAR(255) NOT NULL,
    class_name VARCHAR(255) NOT NULL,
    class_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    instructor VARCHAR(255),
    result VARCHAR(50) NOT NULL CHECK (result IN ('success', 'waitlisted', 'failed', 'error')),
    error_message TEXT,
    attempt_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking runs (tracks each monthly execution)
CREATE TABLE IF NOT EXISTS booking_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    total_attempts INTEGER DEFAULT 0,
    successful_bookings INTEGER DEFAULT 0,
    waitlisted_bookings INTEGER DEFAULT 0,
    failed_bookings INTEGER DEFAULT 0,
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_credentials_user_id ON credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_preferences_user_id ON booking_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_preferences_date ON booking_preferences(class_date);
CREATE INDEX IF NOT EXISTS idx_booking_preferences_active ON booking_preferences(is_active);
CREATE INDEX IF NOT EXISTS idx_booking_history_user_id ON booking_history(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_history_result ON booking_history(result);
CREATE INDEX IF NOT EXISTS idx_booking_runs_user_id ON booking_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_runs_status ON booking_runs(status);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credentials_updated_at BEFORE UPDATE ON credentials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_preferences_updated_at BEFORE UPDATE ON booking_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default user for MVP (single-user mode)
INSERT INTO users (id, email)
VALUES ('00000000-0000-0000-0000-000000000001', 'romejim@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Grant permissions (if using Row Level Security)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE booking_preferences ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE booking_history ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE booking_runs ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE users IS 'Application users';
COMMENT ON TABLE credentials IS 'Encrypted platform login credentials';
COMMENT ON TABLE booking_preferences IS 'User class booking preferences';
COMMENT ON TABLE booking_history IS 'History of all booking attempts';
COMMENT ON TABLE booking_runs IS 'Monthly booking run executions';
