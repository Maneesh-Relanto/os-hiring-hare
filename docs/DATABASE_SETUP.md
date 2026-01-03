# Database Setup Guide

## Overview

This guide will help you set up the PostgreSQL database for Hiring Hare.

## Prerequisites

- PostgreSQL 15+ installed and running
- Access to PostgreSQL superuser (postgres) account

## Quick Setup

### Step 1: Generate a Secure Password

Generate a strong password for the database user. You can use:

```powershell
# PowerShell - Generate random password
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 20 | ForEach-Object {[char]$_})
```

Or use an online password generator with these requirements:
- Minimum 16 characters
- Include uppercase, lowercase, numbers, and special characters

### Step 2: Create Database Setup Script

1. Copy the template:
   ```powershell
   Copy-Item scripts\setup_database.template.sql setup_database.sql
   ```

2. Edit `setup_database.sql` and replace `YOUR_SECURE_PASSWORD_HERE` with your generated password

3. **Important:** `setup_database.sql` is gitignored and should NEVER be committed

### Step 3: Run Database Setup

**Option A: Using psql command line**

```powershell
# You'll be prompted for the postgres user password
psql -U postgres -f setup_database.sql
```

**Option B: Using pgAdmin**

1. Open pgAdmin and connect to your PostgreSQL server
2. Right-click on "Login/Group Roles" → Create → Login/Group Role
   - **General tab:** Name = `hiring_hare_user`
   - **Definition tab:** Password = *your generated password*
   - **Privileges tab:** Check "Can login?"
3. Right-click on "Databases" → Create → Database
   - **Database:** `hiring_hare`
   - **Owner:** `hiring_hare_user`
4. Open Query Tool on the new database and run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   GRANT ALL ON SCHEMA public TO hiring_hare_user;
   ```

### Step 4: Configure Backend Environment

1. Copy the environment template:
   ```powershell
   Copy-Item backend\.env.example backend\.env
   ```

2. Edit `backend\.env` and update these values:
   ```env
   DATABASE_URL=postgresql+asyncpg://hiring_hare_user:YOUR_PASSWORD@localhost:5432/hiring_hare
   DATABASE_PASSWORD=YOUR_PASSWORD
   ```

3. **Important:** `backend/.env` is gitignored and should NEVER be committed

### Step 5: Test Connection

Test the database connection:

```powershell
# Test with psql
psql -U hiring_hare_user -d hiring_hare -h localhost

# Or test from Python
cd backend
python -c "from sqlalchemy import create_engine; engine = create_engine('postgresql://hiring_hare_user:YOUR_PASSWORD@localhost:5432/hiring_hare'); print('Connected:', engine.connect())"
```

## Database Configuration

- **Database Name:** `hiring_hare`
- **Database User:** `hiring_hare_user`
- **Host:** `localhost`
- **Port:** `5432`

## Troubleshooting

### Connection Failed

1. Verify PostgreSQL is running:
   ```powershell
   Get-Service -Name postgresql*
   ```

2. Check if PostgreSQL is listening:
   ```powershell
   netstat -an | Select-String "5432"
   ```

3. Verify pg_hba.conf allows local connections:
   - Location: Usually in `C:\Program Files\PostgreSQL\15\data\pg_hba.conf`
   - Should have: `host all all 127.0.0.1/32 scram-sha-256`

### Password Authentication Failed

- Ensure you're using the correct password
- Check if the user was created successfully:
  ```sql
  SELECT * FROM pg_user WHERE usename = 'hiring_hare_user';
  ```

### Permission Denied

- Ensure all privileges were granted:
  ```sql
  \c hiring_hare
  GRANT ALL ON SCHEMA public TO hiring_hare_user;
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hiring_hare_user;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hiring_hare_user;
  ```

## Security Best Practices

1. ✅ **Never commit credentials** - `.env` and `setup_database.sql` are gitignored
2. ✅ **Use strong passwords** - Minimum 16 characters with mixed case, numbers, and symbols
3. ✅ **Restrict access** - Database user should only have access to `hiring_hare` database
4. ✅ **Use environment variables** - Never hardcode passwords in code
5. ✅ **Enable SSL in production** - Add `?sslmode=require` to connection string
6. ✅ **Regular backups** - Set up automated database backups
7. ✅ **Rotate passwords** - Change passwords periodically

## Next Steps

After database setup:

1. Initialize Alembic migrations:
   ```powershell
   cd backend
   alembic revision --autogenerate -m "Initial migration"
   ```

2. Run migrations:
   ```powershell
   alembic upgrade head
   ```

3. Verify tables were created:
   ```sql
   \c hiring_hare
   \dt
   ```

## Reference

See also:
- [Backend README](../backend/README.md) - Backend setup guide
- [System Architecture](../architecture/system-architecture.md) - Overall architecture
- [Database Schema](../architecture/database-schema.md) - Database design
