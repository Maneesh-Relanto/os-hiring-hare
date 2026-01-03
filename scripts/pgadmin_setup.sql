-- ============================================
-- Hiring Hare Database Setup for pgAdmin
-- ============================================
-- INSTRUCTIONS:
-- 1. Replace YOUR_SECURE_PASSWORD_HERE below with a strong password
-- 2. Save this password - you'll need it in backend/.env
-- 3. Run this entire script in pgAdmin Query Tool
-- ============================================

-- Step 1: Create database user
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'hiring_hare_user') THEN
        CREATE USER hiring_hare_user WITH PASSWORD 'YOUR_SECURE_PASSWORD_HERE';
        RAISE NOTICE 'User hiring_hare_user created';
    ELSE
        RAISE NOTICE 'User hiring_hare_user already exists';
    END IF;
END
$$;

-- Step 2: Create database
SELECT 'Creating database...' AS step;
CREATE DATABASE hiring_hare
    WITH 
    OWNER = hiring_hare_user
    ENCODING = 'UTF8'
    TEMPLATE = template0
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Step 3: Grant database privileges
GRANT ALL PRIVILEGES ON DATABASE hiring_hare TO hiring_hare_user;

-- ============================================
-- Now connect to hiring_hare database and run below
-- In pgAdmin: Right-click hiring_hare → Query Tool
-- ============================================

-- Step 4: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 5: Grant schema privileges
GRANT ALL ON SCHEMA public TO hiring_hare_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hiring_hare_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hiring_hare_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO hiring_hare_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO hiring_hare_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO hiring_hare_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT EXECUTE ON FUNCTIONS TO hiring_hare_user;

-- Step 6: Verify setup
SELECT 'Setup complete! Verification:' AS status;
SELECT current_database() AS database_name;
SELECT version() AS postgresql_version;
SELECT extname, extversion FROM pg_extension WHERE extname = 'uuid-ossp';

-- Display connection string
SELECT 'Connection string for backend/.env:' AS info;
SELECT 'DATABASE_URL=postgresql+asyncpg://hiring_hare_user:YOUR_PASSWORD@localhost:5432/hiring_hare' AS connection_string;
