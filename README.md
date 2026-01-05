# Hiring Hare 🐇

**Recruitment Requirement Tracking System**

[![Tech Stack](https://img.shields.io/badge/Backend-Python%203.13%20%2B%20FastAPI-blue)](https://fastapi.tiangolo.com)
[![Tech Stack](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61dafb)](https://react.dev)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2017-336791)](https://www.postgresql.org)
[![Status](https://img.shields.io/badge/Status-MVP%20Development-orange)]()

> A comprehensive recruitment requirement tracking system designed to help corporate organizations manage their hiring needs from initial identification through successful candidate onboarding. Built with vibrant UI/UX featuring purple and teal gradients with glassmorphic design.

**Current Version:** 0.1.0 (MVP Development)  
**Last Updated:** January 5, 2026

---

## 📋 Table of Contents

- [Overview](#overview)
- [What's Been Built](#whats-been-built)
- [MVP Feature Checklist](#mvp-feature-checklist)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development Notes](#development-notes)

---

## 🎯 Overview

**Hiring Hare** is an enterprise-grade recruitment requirement tracking platform that provides:

- **Complete Visibility**: Track every hiring requirement from creation to closure
- **Modern UI/UX**: Vibrant design with purple (#A855F7) and teal (#22D3EE) gradients
- **Real-time Data**: React Query integration for seamless data fetching
- **JWT Authentication**: Secure token-based authentication system
- **RESTful API**: FastAPI backend with automatic OpenAPI documentation
- **Type Safety**: Full TypeScript implementation on frontend

### Business Goals

- 🎯 **30% reduction** in time-to-fill
- ⚡ **50% faster** approval cycles
- 👁️ **95% visibility** into hiring pipeline
- 📊 **Zero lost requirements**
- ✅ **100% audit compliance**

---

## ✅ What's Been Built

### **Phase 1: Foundation** (COMPLETED ✅)

#### Planning & Architecture
- ✅ Business requirements analysis (80+ requirements documented)
- ✅ Functional requirements specification
- ✅ Tech stack selection (Python + React)
- ✅ System architecture design
- ✅ Database schema design (12 tables + 5 ENUMs)
- ✅ Workflow design documentation

#### Backend (Python 3.13 + FastAPI)
- ✅ Project structure with 20+ files
- ✅ FastAPI application with CORS middleware
- ✅ SQLAlchemy 2.0 async models (12 tables)
  - User, Role, Permission models with many-to-many relationships
  - Department, JobLevel, Location reference data models
  - Requirement model with 23+ fields
  - Approval, CandidateApplication, JobPosting placeholder models
- ✅ PostgreSQL database setup (hiring_hare database)
- ✅ JWT authentication system
  - Token creation/validation with python-jose
  - Password hashing with bcrypt 4.3.0
  - Access tokens (15min) + Refresh tokens (7 days)
- ✅ Authentication API endpoints
  - POST /auth/register - User registration
  - POST /auth/login - Login with JWT tokens
  - POST /auth/refresh - Refresh access token
  - GET /auth/me - Get current user
  - POST /auth/logout - Logout
- ✅ Requirements CRUD API
  - GET /requirements - List with pagination, filtering, search
  - POST /requirements - Create (auto-generates REQ-00001 format)
  - GET /requirements/{id} - Get single requirement
  - PUT /requirements/{id} - Update requirement
  - DELETE /requirements/{id} - Delete requirement
- ✅ Reference data API
  - GET /reference-data/departments
  - GET /reference-data/job-levels
  - GET /reference-data/locations
- ✅ Database seeding script
  - 8 departments seeded (Engineering, Product, Design, etc.)
  - 8 job levels seeded (Junior to VP)
  - 7 locations seeded (5 US cities + Remote options)
  - 1 test requirement created (REQ-00001)
- ✅ Test user created (admin@hiringhare.com / Admin@2024)

#### Frontend (React 18 + TypeScript + Vite)
- ✅ Project setup with Material-UI 5.15.6
- ✅ Design system implementation
  - Primary purple (#A855F7) and secondary teal (#22D3EE)
  - Gradient backgrounds (135deg purple to pink/teal)
  - Glassmorphic cards with backdrop-filter blur
  - Inter + Poppins fonts
  - Dark theme with MUI
- ✅ React Query 5.17.19 integration for data fetching
- ✅ Zustand 4.5.0 state management
- ✅ React Router 6.21.3 setup
- ✅ Layout component with responsive sidebar
  - Permanent drawer on desktop (260px)
  - Temporary overlay drawer on mobile
  - Fixed layout overlap issue
- ✅ Dashboard page (mock data)
  - 4 stat cards with gradients
  - Status overview with progress bars
  - Recent activity feed
  - Ready for API integration
- ✅ Requirements Management UI (fully functional)
  - List page with filters (status, search)
  - Sortable table with all requirement fields
  - Pagination component
  - Create/Edit modal with 4-tab form
    - Tab 1: Basic Info (position, department, location, etc.)
    - Tab 2: Job Details (description, responsibilities, dates)
    - Tab 3: Qualifications & Skills (with chips)
    - Tab 4: Compensation (salary range)
  - Connected to backend API via React Query
  - Real-time data fetching and mutations
- ✅ Frontend build successful (794KB JS, 15KB CSS)

#### Infrastructure
- ✅ PostgreSQL 17.6 running on localhost:5432
- ✅ Backend server running on port 8000
- ✅ Frontend dev server running on port 3000
- ✅ Both servers operational and communicating

### **Current Status** 🚀

**Working Components:**
- Backend API fully operational at http://localhost:8000
  - Health check: http://localhost:8000/health
  - API docs: http://localhost:8000/docs
  - Reference data API responding correctly
- Frontend accessible at http://localhost:3000
  - Dashboard rendering with mock data
  - Requirements page ready to fetch from API
  - Responsive layout working

**Test Data in Database:**
- 8 departments, 8 job levels, 7 locations
- 1 test requirement (REQ-00001 - Senior Software Engineer)
- 1 test user (admin@hiringhare.com)

---

## 🎯 MVP Feature Checklist

### ✅ COMPLETED (Core Foundation)

#### Backend Infrastructure
- [x] FastAPI application setup
- [x] PostgreSQL database connection
- [x] SQLAlchemy models for all entities
- [x] JWT authentication system
- [x] User registration/login endpoints
- [x] Password hashing and validation
- [x] CORS middleware configuration
- [x] Health check endpoint

#### Requirements Management (Backend)
- [x] Requirement model with all fields
- [x] Create requirement endpoint with auto-numbering
- [x] List requirements with pagination
- [x] Filter by status
- [x] Search by title/requirement number
- [x] Get single requirement
- [x] Update requirement
- [x] Delete requirement

#### Reference Data (Backend)
- [x] Department, JobLevel, Location models
- [x] Reference data API endpoints
- [x] Database seeding script
- [x] Test data loaded

#### Frontend Foundation
- [x] React + TypeScript + Vite setup
- [x] Material-UI design system
- [x] Vibrant purple/teal theme
- [x] React Query for API calls
- [x] Responsive layout with sidebar
- [x] Dashboard page (mock data)
- [x] Requirements list page
- [x] Create/Edit requirement form (4 tabs)

### 🔄 IN PROGRESS (MVP Completion)

#### Dashboard Integration
- [ ] Replace mock data with real API calls
- [ ] Fetch total requirements count
- [ ] Calculate status breakdown (Draft/Pending/Active)
- [ ] Display recent activity from database

#### Authentication UI
- [ ] Login page with gradient design
- [ ] Register page (optional for MVP)
- [ ] Protected route implementation
- [ ] Token refresh interceptor
- [ ] Logout functionality in UI
- [ ] User profile dropdown

#### Requirements Management Enhancements
- [ ] Connect form dropdowns to reference data API
- [ ] Validate authentication on requirements page
- [ ] Add error handling for failed API calls
- [ ] Add loading states
- [ ] Add success/error notifications

### 📅 REQUIRED FOR MVP (Critical Priority)

#### Candidates Management
- [ ] Candidate model and database table
- [ ] Candidate CRUD API endpoints
- [ ] Candidate list page
- [ ] Add candidate form
- [ ] Link candidates to requirements
- [ ] Basic candidate profile view

#### Approval Workflow (Simplified)
- [ ] Approval model and relationships
- [ ] Submit requirement for approval
- [ ] Approve/Reject endpoint
- [ ] Approval status tracking
- [ ] Simple approval UI

#### Job Postings
- [ ] Job posting model
- [ ] Create posting from requirement
- [ ] Posting status management
- [ ] Basic posting view

### 🚀 POST-MVP FEATURES (Future Releases)

#### Advanced Features
- [ ] Multi-level approval chains
- [ ] Interview scheduling
- [ ] Email notifications
- [ ] Document attachments
- [ ] Offer management
- [ ] Onboarding workflow
- [ ] Advanced analytics dashboard
- [ ] Reporting module
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] Export to PDF/Excel

---

## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI 0.128.0
- **Language**: Python 3.13.7
- **Database**: PostgreSQL 17.6
- **ORM**: SQLAlchemy 2.0.45 (async)
- **Migration**: Alembic 1.16.5
- **Authentication**: python-jose 3.5.0 + bcrypt 4.3.0
- **Server**: Uvicorn 0.40.0
- **Database Driver**: asyncpg 0.31.0

### Frontend
- **Framework**: React 18.2.0
- **Language**: TypeScript 5.3.3
- **Build Tool**: Vite 5.4.21
- **UI Library**: Material-UI 5.15.6
- **Data Fetching**: React Query 5.17.19
- **State Management**: Zustand 4.5.0
- **Routing**: React Router 6.21.3
- **Date Handling**: date-fns 3.0.6

### Database Schema
- **Tables**: 12 (users, roles, permissions, user_roles, role_permissions, departments, job_levels, locations, requirements, approvals, candidate_applications, job_postings)
- **ENUMs**: 5 (RequirementStatus, RequirementType, EmploymentType, WorkMode, Priority)
- **Relationships**: Many-to-many, one-to-many with proper foreign keys

### Design System
- **Primary Color**: Purple #A855F7
- **Secondary Color**: Teal #22D3EE
- **Gradients**: 135deg purple to pink/teal
- **Effects**: Glassmorphic cards, backdrop-filter blur
- **Typography**: Inter (body) + Poppins (headings)

---

## 🚀 Getting Started

### Prerequisites

- Python 3.13.7
- Node.js 18+ and npm
- PostgreSQL 17.6
- Git

### Database Setup

1. **Create PostgreSQL Database**:
```sql
CREATE DATABASE hiring_hare;
CREATE USER hiring_hare_user WITH PASSWORD 'HiringHare2024';
GRANT ALL PRIVILEGES ON DATABASE hiring_hare TO hiring_hare_user;
```

2. **Create Tables** (automatically done by backend on startup):
   - Run backend once to create all tables via SQLAlchemy

3. **Seed Reference Data**:
```bash
cd backend
py -3.13 scripts/seed_data.py
```

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
py -3.13 -m pip install -r requirements.txt
```

3. **Configure environment** (create `.env` file):
```env
DATABASE_URL=postgresql+asyncpg://hiring_hare_user:HiringHare2024@localhost:5432/hiring_hare
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
```

4. **Start backend server**:
```bash
py -3.13 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

5. **Access API**:
   - Health check: http://localhost:8000/health
   - API docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment** (create `.env` file):
```env
VITE_API_BASE_URL=http://localhost:8000
```

4. **Start development server**:
```bash
npm run dev
```

5. **Access application**:
   - Frontend: http://localhost:3000

### Quick Test

1. **Test Backend API**:
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing
```

2. **Test Reference Data**:
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/reference-data/departments" -UseBasicParsing
```

3. **Login** (if authentication UI is built):
   - Email: admin@hiringhare.com
   - Password: Admin@2024

---

## 📁 Project Structure

```
Hiring Hare/
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── __init__.py       # API router
│   │   │       └── endpoints/
│   │   │           ├── auth.py       # Authentication endpoints
│   │   │           ├── requirements.py  # Requirements CRUD
│   │   │           └── reference_data.py  # Reference data API
│   │   ├── core/
│   │   │   ├── config.py             # Settings with Pydantic
│   │   │   ├── database.py           # Async database setup
│   │   │   ├── security.py           # JWT & password hashing
│   │   │   └── dependencies.py       # FastAPI dependencies
│   │   ├── models/
│   │   │   ├── base.py               # Base model with UUID + timestamps
│   │   │   ├── user.py               # User model
│   │   │   ├── role.py               # Role & Permission models
│   │   │   ├── organization.py       # Dept, JobLevel, Location
│   │   │   ├── requirement.py        # Requirement model
│   │   │   └── placeholder.py        # Approval, Candidate, Posting
│   │   ├── schemas/
│   │   │   ├── user.py               # User Pydantic schemas
│   │   │   ├── token.py              # JWT token schemas
│   │   │   └── requirement.py        # Requirement schemas
│   │   └── main.py                   # FastAPI app entry point
│   ├── scripts/
│   │   └── seed_data.py              # Database seeding script
│   └── requirements.txt              # Python dependencies
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── api/
│   │   │   ├── api.ts                # Axios instance with interceptors
│   │   │   ├── auth.ts               # Auth API calls
│   │   │   └── requirements.ts       # Requirements API calls
│   │   ├── components/
│   │   │   ├── Layout.tsx            # Main layout with sidebar
│   │   │   └── RequirementForm.tsx   # 4-tab requirement form
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx         # Dashboard (mock data)
│   │   │   └── Requirements.tsx      # Requirements list (real API)
│   │   ├── store/
│   │   │   └── authStore.ts          # Zustand auth store
│   │   ├── theme/
│   │   │   └── theme.ts              # MUI theme customization
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript interfaces
│   │   ├── App.tsx                   # Root component with routes
│   │   └── main.tsx                  # React entry point
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                             # Documentation
│   ├── project-reference.md          # Complete project documentation
│   └── requirements/
│       └── functional-requirements.md  # Detailed requirements
│
├── architecture/
│   └── tech-stack-analysis.md        # Tech stack decision doc
│
├── diagrams/
│   ├── high-level-recruitment-workflow.drawio
│   └── detailed-recruitment-workflow.drawio
│
└── README.md                         # This file
```

---

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/v1/auth/register
Register a new user.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### POST /api/v1/auth/login
Login and receive JWT tokens.

**Request Body**:
```json
{
  "username": "user@example.com",
  "password": "SecurePass123"
}
```

**Response**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Requirements Endpoints

#### GET /api/v1/requirements
List all requirements with pagination.

**Query Parameters**:
- `skip` (int): Records to skip (default: 0)
- `limit` (int): Records per page (default: 10)
- `status` (string): Filter by status (DRAFT, PENDING_APPROVAL, APPROVED, etc.)
- `search` (string): Search in position_title and requirement_number

**Response**:
```json
{
  "total": 1,
  "page": 1,
  "page_size": 10,
  "total_pages": 1,
  "items": [
    {
      "id": "uuid",
      "requirement_number": "REQ-00001",
      "position_title": "Senior Software Engineer",
      "status": "DRAFT",
      "priority": "HIGH",
      ...
    }
  ]
}
```

#### POST /api/v1/requirements
Create a new requirement (auto-generates requirement_number).

**Request Body**: See RequirementCreate schema in API docs

### Reference Data Endpoints

#### GET /api/v1/reference-data/departments
Get all active departments.

**Response**:
```json
[
  {
    "id": "uuid",
    "name": "Engineering",
    "code": "ENG"
  },
  ...
]
```

#### GET /api/v1/reference-data/job-levels
Get all job levels ordered by level_order.

#### GET /api/v1/reference-data/locations
Get all active locations.

---

## 🔧 Development Notes

### Known Issues & Resolutions

1. **Python 3.13 Compatibility**: 
   - Initially faced Rust compiler requirement for pydantic
   - ✅ Fixed: Updated to pydantic 2.12.5 with pre-built wheels

2. **Bcrypt 5.x Incompatibility**:
   - Bcrypt 5.0.0 broke passlib with "password cannot be longer than 72 bytes"
   - ✅ Fixed: Downgraded to bcrypt 4.3.0 with version constraint

3. **SQLAlchemy Relationship Ambiguity**:
   - Many-to-many relationships with multiple FKs caused errors
   - ✅ Fixed: Added explicit primaryjoin/secondaryjoin

4. **Missing python-jose Module**:
   - Backend failed to start due to missing JWT dependency
   - ✅ Fixed: Installed python-jose[cryptography]

5. **Duplicate Model Definitions**:
   - Had both organization.py and individual dept/job/location files
   - ✅ Fixed: Removed individual files, kept organization.py

6. **Frontend Layout Overlap**:
   - Sidebar overlapped main content on desktop
   - ✅ Fixed: Added ml: { sm: '260px' } to main content Box

7. **Frontend JSX Corruption**:
   - Requirements.tsx had missing closing tags
   - ✅ Fixed: Complete reconstruction with proper JSX

### Development Commands

**Backend**:
```bash
# Start with auto-reload
py -3.13 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run database seeding
py -3.13 scripts/seed_data.py

# Install new package
py -3.13 -m pip install package-name

# Check Python imports
py -3.13 -c "import app.main; print('OK')"
```

**Frontend**:
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

**Database**:
```bash
# Connect to PostgreSQL
psql -U hiring_hare_user -d hiring_hare

# Check table count
SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';

# View requirements
SELECT requirement_number, position_title, status FROM requirements;
```

---

## 📖 Documentation

- **[Project Reference](docs/project-reference.md)**: Complete business analysis and decisions
- **[Functional Requirements](requirements/functional-requirements.md)**: Detailed requirements (80+)
- **[Tech Stack Analysis](architecture/tech-stack-analysis.md)**: Technology selection rationale
- **[API Docs](http://localhost:8000/docs)**: Interactive OpenAPI documentation (when backend is running)

---

## 🎯 MVP Success Criteria

**The MVP is considered complete when:**

1. ✅ Backend API is fully operational
2. ✅ Database is set up with all tables and reference data
3. ✅ Authentication system works (register/login/JWT)
4. ✅ Requirements can be created, listed, updated, deleted
5. 🔄 Dashboard shows REAL data from database (IN PROGRESS)
6. 🔄 Authentication UI is functional (IN PROGRESS)
7. ⏳ Candidates can be added and linked to requirements (NEXT)
8. ⏳ Basic approval workflow works (submit/approve/reject) (NEXT)
9. ⏳ Job postings can be created from requirements (NEXT)
10. ⏳ Basic testing completed (NEXT)

**Estimated MVP Completion**: Mid-January 2026

---

## 📊 Quick Recap Summary

### What We've Achieved (Jan 3-5, 2026)

**Day 1 - Planning & Architecture** ✅
- Complete business analysis (80+ requirements)
- Tech stack selection: Python + React
- Database schema design (12 tables)
- Project structure creation

**Day 2 - Backend Foundation** ✅
- FastAPI setup with 20+ files
- SQLAlchemy models for all entities
- JWT authentication system
- Requirements CRUD API
- Reference data API
- Database seeding

**Day 3 - Frontend & Polish** ✅
- React + TypeScript setup
- Vibrant purple/teal design system
- Dashboard UI (mock data)
- Requirements Management UI (full CRUD)
- Fixed multiple technical issues
- Both servers operational

### Most Important MVP Features (Priority Order)

**CRITICAL (Must Have for MVP):**

1. **Authentication UI** - Login page so users can actually access the system
2. **Connect Dashboard to API** - Show real data instead of mock values
3. **Candidates Management** - Core feature for tracking applicants
4. **Basic Approval Workflow** - Submit/approve/reject requirements
5. **Job Postings** - Create job ads from requirements

**HIGH (Should Have for MVP):**

6. Error handling & loading states across all pages
7. Form validation & user feedback (toasts/snackbars)
8. Protected routes (redirect to login if not authenticated)
9. User profile & settings
10. Basic reporting (requirements by status, time-to-fill)

**MEDIUM (Nice to Have for MVP):**

11. Interview scheduling
12. Email notifications
13. Document attachments
14. Advanced analytics
15. Role-based access control

---

## 👥 Team

- **Project Lead**: Maneesh Thakur
- **Development**: AI-Assisted Full Stack Development
- **Architecture**: System designed for 100-1000 concurrent users

---

**Built with ❤️ using Python, React, and PostgreSQL**

*Last updated: January 5, 2026*
