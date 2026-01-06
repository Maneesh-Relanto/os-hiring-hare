# Hiring Hare - Setup Guide 🚀

Complete installation and setup guide for developers who download the Hiring Hare codebase.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (5 Minutes)](#quick-start-5-minutes)
3. [Detailed Setup Instructions](#detailed-setup-instructions)
4. [Database Setup](#database-setup)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Running the Application](#running-the-application)
8. [Testing the Setup](#testing-the-setup)
9. [Common Issues & Solutions](#common-issues--solutions)
10. [Default Credentials](#default-credentials)

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

| Software | Version | Download Link | Purpose |
|----------|---------|---------------|---------|
| **Python** | 3.13+ | [python.org](https://www.python.org/downloads/) | Backend runtime |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) | Frontend runtime |
| **PostgreSQL** | 17+ | [postgresql.org](https://www.postgresql.org/download/) | Database |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) | Version control |

### Verify Installation

```powershell
# Check Python version
py -3.13 --version
# Should output: Python 3.13.x

# Check Node.js and npm
node --version
npm --version

# Check PostgreSQL
psql --version

# Check Git
git --version
```

### System Requirements

- **OS**: Windows 10/11, macOS 12+, or Linux (Ubuntu 20.04+)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 2GB free space
- **Ports**: 8000 (backend), 3000 (frontend), 5432 (PostgreSQL)

---

## ⚡ Quick Start (5 Minutes)

For experienced developers who want to get running quickly:

```powershell
# 1. Clone repository
git clone <repository-url>
cd "Hiring Hare"

# 2. Setup PostgreSQL database
psql -U postgres
CREATE DATABASE hiring_hare;
CREATE USER hiring_hare_user WITH PASSWORD 'HiringHare2024';
GRANT ALL PRIVILEGES ON DATABASE hiring_hare TO hiring_hare_user;
\q

# 3. Backend setup
cd backend
py -3.13 -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
# Create .env file with database credentials (see below)
py -3.13 -m alembic upgrade head
py -3.13 scripts\seed_data.py
py -3.13 scripts\seed_roles_permissions.py
py -3.13 scripts\assign_user_roles.py
py -3.13 scripts\seed_candidates.py
# Start backend in minimized window
start powershell -WindowStyle Minimized -Command "cd '$PWD'; py -3.13 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

# 4. Frontend setup (new terminal)
cd ..\frontend
npm install
# Create .env file (see below)
# Start frontend in minimized window
start powershell -WindowStyle Minimized -Command "cd '$PWD'; npm run dev"

# 5. Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
# Login: admin@hiringhare.com / Admin@2024
```

---

## 📖 Detailed Setup Instructions

### Step 1: Clone the Repository

```powershell
# Navigate to your projects folder
cd "C:\Users\<YourUsername>\Downloads\My Projects"

# Clone the repository
git clone <repository-url> "Hiring Hare"

# Navigate into project
cd "Hiring Hare"
```

### Step 2: Verify Project Structure

```
Hiring Hare/
├── backend/           # Python FastAPI backend
├── frontend/          # React TypeScript frontend
├── docs/              # Documentation
├── architecture/      # Architecture documents
├── diagrams/          # Workflow diagrams
├── requirements/      # Requirements specifications
├── scripts/           # Helper scripts
├── temp/              # Temporary files (git-ignored)
├── .gitignore
├── README.md
└── SETUP.md          # This file
```

---

## 🗄️ Database Setup

### Step 1: Start PostgreSQL

**Windows:**
```powershell
# Check if PostgreSQL is running
Get-Service -Name postgresql*

# If not running, start it
Start-Service -Name postgresql-x64-17
```

**macOS (Homebrew):**
```bash
brew services start postgresql@17
```

**Linux:**
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 2: Create Database and User

Open PostgreSQL command line:

```powershell
# Windows
psql -U postgres

# macOS/Linux
sudo -u postgres psql
```

Run these SQL commands:

```sql
-- Create database
CREATE DATABASE hiring_hare;

-- Create user with password
CREATE USER hiring_hare_user WITH PASSWORD 'HiringHare2024';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hiring_hare TO hiring_hare_user;

-- Exit psql
\q
```

### Step 3: Verify Database Connection

```powershell
psql -U hiring_hare_user -d hiring_hare -h localhost
# Password: HiringHare2024

# List databases
\l

# Exit
\q
```

---

## 🐍 Backend Setup

### Step 1: Navigate to Backend Directory

```powershell
cd backend
```

### Step 2: Create Virtual Environment

```powershell
# Create virtual environment
py -3.13 -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\activate

# Windows CMD:
venv\Scripts\activate.bat

# macOS/Linux:
source venv/bin/activate
```

Your prompt should now show `(venv)` prefix.

### Step 3: Install Python Dependencies

```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt
```

**Key packages installed:**
- FastAPI 0.128.0 - Web framework
- SQLAlchemy 2.0.45 - ORM
- Alembic 1.16.5 - Database migrations
- asyncpg 0.31.0 - PostgreSQL driver
- python-jose 3.5.0 - JWT tokens
- bcrypt 4.3.0 - Password hashing
- uvicorn 0.40.0 - ASGI server

### Step 4: Configure Environment Variables

Create `.env` file in `backend/` directory:

```powershell
# Create .env file
New-Item -Path .env -ItemType File
```

Edit `.env` with these values:

```env
# Database Configuration
DATABASE_URL=postgresql+asyncpg://hiring_hare_user:HiringHare2024@localhost:5432/hiring_hare

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# Application Settings
DEBUG=True
APP_NAME=Hiring Hare
VERSION=0.1.0

# CORS Settings (Frontend URL)
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
```

**⚠️ Security Note:** Change `SECRET_KEY` in production! Generate a secure key:
```powershell
py -3.13 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 5: Run Database Migrations

```powershell
# Apply all migrations
py -3.13 -m alembic upgrade head
```

**Expected output:**
```
INFO  [alembic.runtime.migration] Running upgrade  -> b56b9fba438e, Initial database schema
INFO  [alembic.runtime.migration] Running upgrade b56b9fba438e -> d14639c18ccb, Create candidates table
```

### Step 6: Seed Database with Initial Data

```powershell
# Seed reference data (departments, job levels, locations)
py -3.13 scripts\seed_data.py

# Seed roles and permissions
py -3.13 scripts\seed_roles_permissions.py

# Assign roles to test users
py -3.13 scripts\assign_user_roles.py

# Seed test candidates (20 records)
py -3.13 scripts\seed_candidates.py
```

**Expected output:**
```
✅ Created 8 departments
✅ Created 8 job levels
✅ Created 7 locations
✅ Created 1 test requirement
✅ Created roles: Admin, Manager, Recruiter
✅ Created 18 permissions
✅ Created 3 test users
✅ Successfully created 20 candidates!
```

### Step 7: Verify Backend Setup

```powershell
# Start backend server
py -3.13 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

Open browser and visit:
- Health check: http://localhost:8000/health
- API docs: http://localhost:8000/docs

Press `CTRL+C` to stop the server.

---

## ⚛️ Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **NEW terminal** (keep backend running) and navigate:

```powershell
cd frontend
```

### Step 2: Install Node Dependencies

```powershell
# Install all npm packages
npm install
```

**Key packages installed:**
- React 18.2.0 - UI library
- TypeScript 5.3.3 - Type safety
- Vite 5.4.21 - Build tool
- Material-UI 5.15.6 - Component library
- React Query 5.17.19 - Data fetching
- Zustand 4.5.0 - State management
- React Router 6.21.3 - Routing

**Installation may take 2-3 minutes.**

### Step 3: Configure Environment Variables

Create `.env` file in `frontend/` directory:

```powershell
# Create .env file
New-Item -Path .env -ItemType File
```

Edit `.env` with:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000

# Application Settings
VITE_APP_NAME=Hiring Hare
VITE_APP_VERSION=0.1.0
```

### Step 4: Verify Frontend Setup

```powershell
# Start development server
npm run dev
```

**Expected output:**
```
  VITE v5.4.21  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Open browser and visit: http://localhost:3000

Press `CTRL+C` to stop the server.

---

## 🚀 Running the Application

### Development Mode (Recommended)

Run both backend and frontend in **separate minimized windows** so you can continue working:

#### Start Backend (Minimized)

```powershell
cd backend
start powershell -WindowStyle Minimized -Command "cd '$PWD'; .\venv\Scripts\activate; py -3.13 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
```

#### Start Frontend (Minimized)

```powershell
cd frontend
start powershell -WindowStyle Minimized -Command "cd '$PWD'; npm run dev"
```

### Manual Mode (Side-by-side terminals)

**Terminal 1 - Backend:**
```powershell
cd backend
.\venv\Scripts\activate
py -3.13 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Verify Both Servers Running

```powershell
# Check ports
Get-NetTCPConnection -LocalPort 8000,3000 -ErrorAction SilentlyContinue | Select-Object LocalPort, State
```

**Expected output:**
```
LocalPort State
--------- -----
     8000 Listen
     3000 Listen
```

### Access Application

- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## ✅ Testing the Setup

### 1. Test Backend Health

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing
```

**Expected:**
```json
{"status":"healthy","version":"0.1.0"}
```

### 2. Test Backend API - Get Departments

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/reference-data/departments" -UseBasicParsing
```

**Expected:** JSON array with 8 departments.

### 3. Test Login

```powershell
$body = @{username='admin@hiringhare.com'; password='Admin@2024'}
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/login" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded" -UseBasicParsing
```

**Expected:** JSON response with `access_token` and `refresh_token`.

### 4. Test Frontend

1. Open http://localhost:3000 in browser
2. Click "Login" button
3. Enter credentials:
   - Email: `admin@hiringhare.com`
   - Password: `Admin@2024`
4. Should redirect to Dashboard
5. Click "Candidates" in sidebar
6. Should see table with 20 test candidates

### 5. Test Requirements

1. Click "Requirements" in sidebar
2. Should see list of requirements
3. Click "Add Requirement" button
4. Fill form and submit
5. New requirement should appear in list

---

## 🐛 Common Issues & Solutions

### Issue 1: Python Command Not Found

**Error:** `py : The term 'py' is not recognized`

**Solution:**
```powershell
# Use full path or add to PATH
python --version
# or
py -3.13 --version
# or
C:\Users\<Username>\AppData\Local\Programs\Python\Python313\python.exe --version
```

### Issue 2: PostgreSQL Connection Failed

**Error:** `could not connect to server: Connection refused`

**Solutions:**
1. Verify PostgreSQL is running:
   ```powershell
   Get-Service -Name postgresql*
   ```
2. Check port 5432 is open:
   ```powershell
   Get-NetTCPConnection -LocalPort 5432
   ```
3. Verify credentials in `.env` file
4. Check PostgreSQL logs: `C:\Program Files\PostgreSQL\17\data\pg_log\`

### Issue 3: Port Already in Use

**Error:** `Address already in use: 8000` or `3000`

**Solutions:**

**Find process using port:**
```powershell
Get-NetTCPConnection -LocalPort 8000 | Select-Object State, OwningProcess
```

**Kill process:**
```powershell
# Get process ID from above, then:
Stop-Process -Id <ProcessId> -Force
```

**Or kill all Python processes:**
```powershell
Get-Process -Name python -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Issue 4: Module Not Found

**Error:** `ModuleNotFoundError: No module named 'xxx'`

**Solution:**
```powershell
# Ensure virtual environment is activated
.\venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue 5: Alembic Migration Failed

**Error:** `FAILED: Can't locate revision identified by 'xxx'`

**Solutions:**
```powershell
# Check current revision
py -3.13 -m alembic current

# Reset to base
py -3.13 -m alembic downgrade base

# Apply all migrations
py -3.13 -m alembic upgrade head
```

### Issue 6: Frontend Build Errors

**Error:** `Cannot find module` or TypeScript errors

**Solutions:**
```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install

# Clear Vite cache
Remove-Item -Recurse -Force node_modules/.vite
npm run dev
```

### Issue 7: CORS Errors in Browser

**Error:** `Access to XMLHttpRequest at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:**
1. Verify `CORS_ORIGINS` in backend `.env` includes frontend URL
2. Restart backend server
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try incognito mode

### Issue 8: Database Tables Not Created

**Error:** `relation "users" does not exist`

**Solution:**
```powershell
# Apply migrations
cd backend
py -3.13 -m alembic upgrade head

# Verify tables exist
psql -U hiring_hare_user -d hiring_hare -c "\dt"
```

### Issue 9: JWT Token Errors

**Error:** `Could not validate credentials` or `403 Forbidden`

**Solutions:**
1. Login again to get fresh tokens
2. Clear browser localStorage:
   - Press F12 (Developer Tools)
   - Go to Application > Local Storage
   - Delete `auth-storage` key
   - Refresh page and login again
3. Verify `SECRET_KEY` in backend `.env` hasn't changed

### Issue 10: Windows Encoding Errors

**Error:** `UnicodeEncodeError: 'charmap' codec can't encode character`

**Solution:**
```powershell
# Set UTF-8 encoding for PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Or use alternative command prompt
```

---

## 🔐 Default Credentials

### Test Users

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@hiringhare.com | Admin@2024 | Full system access |
| **Manager** | manager@hiringhare.com | Manager@2024 | Department management |
| **Recruiter** | recruiter@hiringhare.com | Recruiter@2024 | Candidate management |

### Database

| Service | Username | Password | Database |
|---------|----------|----------|----------|
| PostgreSQL | hiring_hare_user | HiringHare2024 | hiring_hare |

**⚠️ Security Warning:** Change all default passwords before deploying to production!

---

## 📊 Seeded Data

After running seed scripts, your database will contain:

### Reference Data
- **8 Departments**: Engineering, Product, Design, Marketing, Sales, Operations, HR, Finance
- **8 Job Levels**: Junior, Mid-Level, Senior, Staff, Principal, Architect/Lead, Director, VP
- **7 Locations**: San Francisco CA, New York NY, Austin TX, Seattle WA, Remote US, Remote International, Hybrid

### Test Data
- **3 Users**: Admin, Manager, Recruiter (see credentials above)
- **6 Roles**: Admin, Manager, Recruiter, Interviewer, Hiring Manager, Employee
- **18 Permissions**: All CRUD operations for each module
- **1 Test Requirement**: REQ-00001 - Senior Software Engineer
- **20 Test Candidates**: Across 7 statuses (New, Screening, Interviewing, Offered, Hired, Rejected, Withdrawn)

---

## 🎯 Next Steps

After successful setup:

1. **Explore the UI**: Navigate through Dashboard, Requirements, Candidates pages
2. **Test CRUD Operations**: Create, edit, delete requirements and candidates
3. **Review API Docs**: Visit http://localhost:8000/docs to explore all endpoints
4. **Read Documentation**: Check `/docs/project-reference.md` for detailed information
5. **Start Development**: Begin building new features or customizing existing ones

---

## 📞 Getting Help

If you encounter issues not covered here:

1. **Check Logs**:
   - Backend: Terminal output where uvicorn is running
   - Frontend: Browser console (F12)
   - PostgreSQL: `C:\Program Files\PostgreSQL\17\data\pg_log\`

2. **Verify Setup**:
   ```powershell
   # Check Python version
   py -3.13 --version
   
   # Check database connection
   psql -U hiring_hare_user -d hiring_hare -h localhost
   
   # Check ports
   Get-NetTCPConnection -LocalPort 8000,3000,5432 -ErrorAction SilentlyContinue
   ```

3. **Review Documentation**:
   - README.md - Project overview
   - COMMIT_SUMMARY.md - Recent code changes
   - docs/project-reference.md - Comprehensive documentation

4. **Common Commands**:
   ```powershell
   # Restart backend
   Get-Process -Name python | Stop-Process -Force
   cd backend; py -3.13 -m uvicorn app.main:app --reload
   
   # Restart frontend
   Get-Process -Name node | Stop-Process -Force
   cd frontend; npm run dev
   
   # Reset database
   psql -U postgres -c "DROP DATABASE hiring_hare; CREATE DATABASE hiring_hare;"
   cd backend; py -3.13 -m alembic upgrade head
   ```

---

## 🎉 Success!

You're all set! Your Hiring Hare application should now be running at:

- 🌐 **Frontend**: http://localhost:3000
- 🔌 **Backend API**: http://localhost:8000/docs
- 💾 **Database**: localhost:5432/hiring_hare

**Happy coding! 🐇✨**
