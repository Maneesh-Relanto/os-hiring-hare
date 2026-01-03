# pgAdmin Database Setup Instructions

## Quick Setup Steps

### 1. Generate a Secure Password

Open PowerShell and run:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 20 | ForEach-Object {[char]$_})
```

Copy the generated password - you'll need it multiple times.

### 2. Prepare SQL Script

1. Open `scripts/pgadmin_setup.sql`
2. Replace **both** occurrences of `YOUR_SECURE_PASSWORD_HERE` with your generated password
3. Save a copy as `pgadmin_setup_PRIVATE.sql` (this file is gitignored)

### 3. Run in pgAdmin

**Part A: Create Database**

1. In pgAdmin, connect to PostgreSQL 17 server
2. Right-click on **PostgreSQL 17** → **Query Tool**
3. Open your edited SQL script
4. Copy lines 1-42 (up to "Create database" section)
5. Click **Execute** (F5)
6. You should see: "User hiring_hare_user created" and database created

**Part B: Configure Database**

1. In pgAdmin left panel, right-click **Databases** → **Refresh**
2. Find and expand **hiring_hare** database
3. Right-click **hiring_hare** → **Query Tool** (this connects to the new database)
4. Copy the remaining part of the script (from "Enable UUID extension" onwards)
5. Click **Execute** (F5)
6. You should see "Setup complete!" with verification info

### 4. Configure Backend

1. Copy the environment template:
   ```powershell
   cd "C:\Users\Maneesh Thakur\Downloads\My Projects\Hiring Hare"
   Copy-Item backend\.env.example backend\.env
   ```

2. Edit `backend\.env` and update:
   ```env
   DATABASE_URL=postgresql+asyncpg://hiring_hare_user:YOUR_PASSWORD@localhost:5432/hiring_hare
   SECRET_KEY=YOUR_RANDOM_32_CHAR_STRING
   ```

3. Generate SECRET_KEY:
   ```powershell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```

### 5. Test Connection

In pgAdmin Query Tool (connected to hiring_hare database):
```sql
SELECT current_database(), current_user;
```

Should show:
- Database: `hiring_hare`
- User: `postgres` (you're logged in as postgres)

Test the new user login:
```powershell
cd "C:\Program Files\PostgreSQL\17\bin"
.\psql.exe -U hiring_hare_user -d hiring_hare -h localhost
# Enter the password you created
```

If successful, you're ready to run migrations!

## Next Steps

1. **Initialize Alembic** (database migrations):
   ```powershell
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   alembic init alembic
   ```

2. **Create initial migration**:
   ```powershell
   alembic revision --autogenerate -m "Initial database schema"
   ```

3. **Apply migrations**:
   ```powershell
   alembic upgrade head
   ```

4. **Verify tables created** in pgAdmin:
   - Expand **hiring_hare** → **Schemas** → **public** → **Tables**
   - You should see: users, roles, permissions, departments, requirements, etc.

## Troubleshooting

### "database already exists"
The database was created before. That's fine - just run Part B (configure database).

### "role already exists"  
The user was created before. That's fine - continue with database creation.

### Connection refused
Check PostgreSQL service is running:
```powershell
Get-Service postgresql-x64-17
```

### Permission denied
Make sure you're connected as `postgres` user in pgAdmin when creating the database and user.

## Security Reminders

✅ `pgadmin_setup_PRIVATE.sql` is gitignored  
✅ `backend/.env` is gitignored  
✅ Never commit files with real passwords  
✅ Use different passwords for development and production
