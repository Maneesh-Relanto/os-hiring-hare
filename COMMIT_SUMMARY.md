# Code Changes Summary - Hiring Hare

## Overview
Fixed 403 Forbidden error on candidates page and implemented candidate management functionality with test data.

## Root Cause Analysis
The 403 error was caused by three issues:
1. SQLAlchemy model conflict preventing candidates table creation
2. Empty migration file (b56b9fba438e) due to model conflict
3. Frontend axios reading JWT tokens from wrong localStorage key

---

## Backend Changes

### 1. **app/main.py**
**Change**: Removed emoji characters from logging statements
- **Reason**: Windows cmd.exe cp1252 codec cannot encode Unicode emojis, causing UnicodeEncodeError
- **Lines Modified**: 26-30 (logger.info statements)
- **Impact**: Server logs display correctly without encoding errors

### 2. **app/models/__init__.py**
**Change**: Fixed model imports to resolve SQLAlchemy conflicts
- **Removed**: `from app.models.placeholder import CandidateApplication` 
- **Added**: `from app.models.candidate import Candidate`
- **Removed from __all__**: 'CandidateApplication'
- **Reason**: CandidateApplication placeholder conflicted with Candidate model (both used `back_populates="candidates"` with Requirement)
- **Impact**: Alembic autogenerate now detects Candidate model correctly

### 3. **app/models/placeholder.py**
**Change**: Commented out entire CandidateApplication class (lines 27-36)
- **Reason**: Replaced by production Candidate model, relationship conflict with Requirement
- **Impact**: Removed duplicate relationship preventing migration generation

### 4. **alembic/versions/20260106_0549_d14639c18ccb_create_candidates_table.py**
**Change**: Generated new migration to create candidates table
- **Operations**:
  - Created `candidates` table with all fields (first_name, last_name, email, phone, requirement_id, status, resume_url, linkedin_url, portfolio_url, current_company, current_title, total_experience_years, skills JSONB, source, notes, assigned_recruiter_id, timestamps)
  - Added indexes: ix_candidates_email, ix_candidates_id, ix_candidates_requirement_id
  - Removed old `candidate_applications` table
- **Status**: Applied successfully with `alembic upgrade head`
- **Impact**: Candidates table now exists in PostgreSQL with proper schema

### 5. **scripts/seed_candidates.py**
**Change**: Created seed script with 20 realistic test candidate records
- **Data**: Diverse profiles across 7 statuses (new: 7, screening: 5, interviewing: 4, offered: 1, hired: 1, rejected: 1, withdrawn: 1)
- **Fields**: Realistic names, companies, job titles, skills arrays, LinkedIn URLs, phone numbers, emails
- **Examples**: 
  - Senior Software Engineer at Tech Corp (Python/FastAPI/AWS)
  - Full Stack Developer at Startup Inc (React/TypeScript/Node.js)
  - Staff Engineer at Big Tech Co (Java/Spring Boot/Kubernetes)
- **Status**: Executed successfully, 20 records inserted
- **Impact**: Candidates page displays real test data for development/demo

### 6. **.gitignore**
**Change**: Added exclusion patterns for temporary files
- **Added**:
  - `logs/` and `*.log` (runtime logs)
  - `check_*.py`, `test_*.py`, `test_*.ps1`, `list_*.py`, `debug_*.py` (temporary scripts)
  - `alembic/versions/*.pyc` and `alembic/versions/__pycache__/` (Python cache)
- **Reason**: Prevent accidentally committing temporary debug/test scripts
- **Impact**: Repository stays clean, only production code committed

---

## Frontend Changes

### 7. **src/services/api.ts**
**Change**: Fixed axios interceptors to read JWT tokens from Zustand storage structure

#### Request Interceptor (lines 14-27)
- **Old**: `const token = localStorage.getItem('access_token');`
- **New**: Parse 'auth-storage' JSON object, extract `state.accessToken`
- **Code**:
  ```typescript
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      const token = state?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  ```

#### Response Interceptor (lines 30-58)
- **Old**: `localStorage.getItem('refresh_token')`
- **New**: Parse 'auth-storage', extract `state.refreshToken`, update entire auth-storage object after token refresh
- **Reason**: Zustand persist middleware stores entire state under single 'auth-storage' key, not individual token keys
- **Impact**: Axios correctly adds Bearer token to requests, 403 errors resolved

#### Logout Function (lines 76-78)
- **Old**: Remove individual token keys
- **New**: `localStorage.removeItem('auth-storage')`
- **Impact**: Clean logout, removes entire Zustand persisted state

---

## Root .gitignore Updates

### 8. **.gitignore** (project root)
**Change**: Added temp folder and backend temporary script patterns
- **Added**:
  - `temp/` folder exclusion (new)
  - Backend-specific patterns: `backend/check_*.py`, `backend/test_*.py`, `backend/test_*.ps1`, `backend/list_*.py`, `backend/debug_*.py`
- **Reason**: Exclude temporary debug files and temp folder from version control
- **Impact**: Clean repository, no temporary files in git history

---

## Database Schema Changes

### Migration: d14639c18ccb_create_candidates_table
**Created Table**: `candidates`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| first_name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, INDEXED |
| phone | VARCHAR(20) | |
| requirement_id | UUID | FOREIGN KEY → requirements.id, INDEXED |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'new' |
| resume_url | TEXT | |
| linkedin_url | TEXT | |
| portfolio_url | TEXT | |
| current_company | VARCHAR(200) | |
| current_title | VARCHAR(200) | |
| total_experience_years | FLOAT | |
| skills | JSONB | |
| source | VARCHAR(50) | |
| notes | TEXT | |
| assigned_recruiter_id | UUID | FOREIGN KEY → users.id |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| deleted_at | TIMESTAMP | |

**Indexes**:
- `ix_candidates_id` on id
- `ix_candidates_email` on email
- `ix_candidates_requirement_id` on requirement_id

**Removed Table**: `candidate_applications` (placeholder)

---

## Test Results

### Backend API Tests ✅
```bash
$ python test_candidates.py
Login Status: 200 ✅
/auth/me Status: 200 ✅
/candidates Status: 200 ✅
Total candidates: 20
```

### Database Verification ✅
```bash
$ python list_tables.py
Tables: users, roles, permissions, requirements, candidates (NEW!)
```

### Migration Status ✅
```bash
$ alembic current
d14639c18ccb (head) - Create candidates table
```

---

## Files Moved to temp/ (Not Committed)

1. **check_admin.py** - Debug script to verify admin user status
2. **check_users.py** - Debug script to list database users
3. **list_tables.py** - Utility to query information_schema.tables
4. **test_candidates.py** - API test script for candidates endpoint
5. **test_login.py** - Login endpoint test script

These temporary scripts were used during debugging and are no longer needed.

---

## Impact Summary

### Before
- ❌ Candidates page returns 403 Forbidden
- ❌ `candidates` table doesn't exist in database
- ❌ Empty migration file due to model conflict
- ❌ Frontend axios reading from non-existent localStorage keys
- ❌ No test data for development

### After
- ✅ Candidates page loads successfully with 200 OK
- ✅ `candidates` table exists with proper schema and indexes
- ✅ Migration d14639c18ccb applied successfully
- ✅ Frontend correctly reads JWT tokens from Zustand storage
- ✅ 20 realistic test candidates across 7 statuses
- ✅ Repository clean with proper .gitignore patterns

---

## Next Steps (Not in This Commit)

1. **Dashboard Metrics**: Connect to real database counts (currently hardcoded)
2. **Permissions API**: Create GET/POST endpoints for permissions matrix
3. **Activity Feed**: Build from activity_log table (currently static mock data)
4. **Interviews Module**: Create interviews table and CRUD functionality

---

## Commit Message Suggestion

```
fix: resolve 403 error on candidates page and add test data

- Fix SQLAlchemy model conflict (CandidateApplication vs Candidate)
- Generate and apply candidates table migration (d14639c18ccb)
- Fix axios token retrieval from Zustand auth-storage
- Remove emoji characters from backend logging (Windows encoding)
- Create seed script with 20 realistic test candidates
- Update .gitignore to exclude temporary debug scripts

Fixes #[issue-number]
```

---

## Technical Notes

### Why the 403 Error Occurred
1. **Model Conflict**: CandidateApplication and Candidate both had `back_populates="candidates"` with Requirement
2. **Empty Migration**: Alembic autogenerate didn't detect Candidate model due to import conflict
3. **Missing Table**: Migration b56b9fba438e was empty, so `candidates` table never created
4. **Frontend Token Access**: Axios looking for 'access_token' key, but Zustand stores in 'auth-storage' JSON structure

### Resolution Steps
1. Commented out CandidateApplication placeholder
2. Updated model imports to include Candidate
3. Generated new migration with autogenerate (detected table creation)
4. Applied migration to create candidates table
5. Fixed axios interceptors to parse Zustand storage structure
6. Restarted backend to load updated code

### Validation
- Backend test script: GET /candidates returns 200 with 20 records
- Browser test: Login successful, candidates page accessible
- Database query: candidates table exists with correct schema
- Migration: Alembic current shows d14639c18ccb as head
