-- Hiring Hare Database Setup Script Template
-- INSTRUCTIONS:
-- 1. Copy this file to setup_database.sql (which is gitignored)
-- 2. Replace YOUR_SECURE_PASSWORD_HERE with a strong password
-- 3. Run: psql -U postgres -f setup_database.sql

-- Create database user
-- IMPORTANT: Replace YOUR_SECURE_PASSWORD_HERE with a strong password
CREATE USER hiring_hare_user WITH PASSWORD 'YOUR_SECURE_PASSWORD_HERE';

-- Create database
CREATE DATABASE hiring_hare
    WITH 
    OWNER = hiring_hare_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hiring_hare TO hiring_hare_user;

-- Connect to the new database
\c hiring_hare

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO hiring_hare_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hiring_hare_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hiring_hare_user;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Display confirmation
SELECT 'Database setup completed successfully!' AS status;
SELECT 'Database: hiring_hare' AS database_info;
SELECT 'User: hiring_hare_user' AS user_info;
