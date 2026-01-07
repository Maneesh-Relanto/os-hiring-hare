# Hiring Hare 🐇

**Recruitment Requirement Tracking System**

[![Tech Stack](https://img.shields.io/badge/Backend-Python%203.13%20%2B%20FastAPI-blue)](https://fastapi.tiangolo.com)
[![Tech Stack](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61dafb)](https://react.dev)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2017-336791)](https://www.postgresql.org)
[![Status](https://img.shields.io/badge/Status-MVP%20Development-orange)]()
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-os--hiring--hare-181717?logo=github)](https://github.com/Maneesh-Relanto/os-hiring-hare)

> A comprehensive recruitment requirement tracking system designed to help corporate organizations manage their hiring needs from initial identification through successful candidate onboarding. Built with vibrant UI/UX featuring purple and teal gradients with glassmorphic design.

**Current Version:** 0.1.0 (MVP Development)  
**Last Updated:** January 7, 2026  
**Repository:** [github.com/Maneesh-Relanto/os-hiring-hare](https://github.com/Maneesh-Relanto/os-hiring-hare)

> 🎉 **Open Source & Free to Fork!** This project is MIT licensed. Fork it, customize it, use it for your organization's recruitment needs. See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

## 🚀 Quick Links

- **[⚡ Quick Setup](SETUP.md)** - Get started in 5 minutes
- **[📖 Full Documentation](docs/project-reference.md)** - Complete project reference
- **[🤝 Contributing](CONTRIBUTING.md)** - How to contribute
- **[📝 Recent Changes](COMMIT_SUMMARY.md)** - Latest development updates
- **[🔐 RBAC Analysis](RBAC_REUSABILITY_ANALYSIS.md)** - Module architecture review

---

## 📋 Table of Contents

- [Overview](#overviewopen-source, )
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

## 🍴 Forking & Customization

**Hiring Hare is designed to be forked and customized for your organization's needs!**

### Perfect for:
- 🏢 **Corporate HR Teams** - Use as-is for recruitment tracking
- 🎓 **Educational Projects** - Learn full-stack development with real-world app
- 🔧 **Custom Solutions** - Fork and modify for your specific requirements
- 📚 **Portfolio Projects** - Showcase your development skills

### What You Get:
✅ Complete working application with authentication  
✅ Modern React UI with Material-UI  
✅ FastAPI backend with OpenAPI docs  
✅ PostgreSQL database with migrations  
✅ RBAC architecture (integrated, not standalone module)  
✅ Comprehensive setup guide ([SETUP.md](SETUP.md))  
✅ Seed scripts for test data  
✅ MIT License - free to use commercially  

### How to Fork:

```bash
# 1. Fork this repository on GitHub (click Fork button)

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/os-hiring-hare.git
cd os-hiring-hare

# 3. Follow the setup guide
# See SETUP.md for detailed instructions

# 4. Customize for your needs
# - Update branding (colors, logos, name)
# - Add/remove features
# - Modify workflows
# - Integrate with your systems
```

### Important Notes:

**RBAC Module Status:**
- ✅ RBAC architecture is **integrated** into the application
- ✅ Roles, permissions, and access control work perfectly
- ⚠️ RBAC is **not yet extracted as standalone module**
- 📦 If you need just RBAC, copy the relevant files (see [RBAC_REUSABILITY_ANALYSIS.md](RBAC_REUSABILITY_ANALYSIS.md))

**Support:**
- 📖 Read the [documentation](docs/project-reference.md)
- 🐛 Report issues on [GitHub](https://github.com/Maneesh-Relanto/os-hiring-hare/issues)
- 💬 Ask questions in [Discussions](https://github.com/Maneesh-Relanto/os-hiring-hare/discussions)
- 🤝 Contribute improvements via [Pull Requests](CONTRIBUTING.md)

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
- ✅ **Candidates Management Module (COMPLETED ✅)**
  - Candidate model with 18 fields
  - Database migration applied (d14639c18ccb)
  - CRUD API endpoints functional
  - List page with filters and status chips
  - Create/Edit modal form
  - 20 realistic test candidates seeded
  - Connected to backend via React Query
- ✅ **Authentication & Token Management (COMPLETED ✅)**
  - JWT token storage in Zustand persist middleware
  - Axios interceptors for automatic token injection
  - Token refresh on 401 errors
  - Secure logout with storage cleanup

#### Infrastructure
- ✅ PostgreSQL 17.6 running on localhost:5432
- ✅ Backend server running on port 8000
- ✅ Frontend dev server running on port 3000
- ✅ Both servers operational and communicating
- ✅ Alembic migrations system set up
- ✅ Database seeding scripts created

### **Current Status** 🚀

**Working Components:**
- Backend API fully operational at http://localhost:8000
  - Health check: http://localhost:8000/health
  - API docs: http://localhost:8000/docs
  - Reference data API responding correctly
  - Requirements CRUD working
  - **Candidates CRUD working (NEW! ✅)**
  - Authentication endpoints functional
- Frontend accessible at http://localhost:3000
  - Dashboard rendering with mock data
  - Requirements page fully functional with API
  - **Candidates page fully functional with API (NEW! ✅)**
  - Login/Logout working
  - Responsive layout working

**Test Data in Database:**
- 8 departments, 8 job levels, 7 locations
- 1 test requirement (REQ-00001 - Senior Software Engineer)
- 3 test users (admin, manager, recruiter)
- **20 test candidates across 7 statuses (NEW! ✅)**
- 6 roles with 18 permissions configured

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
- [ ] Add quick action cards

#### Authentication UI
- [x] Login page with gradient design
- [x] Token refresh interceptor
- [x] Logout functionality in UI
- [x] Protected route implementation
- [ ] Register page (optional for MVP)
- [ ] User profile dropdown
- [ ] Password reset flow

#### Requirements Management Enhancements
- [x] Connect form dropdowns to reference data API
- [x] Validate authentication on requirements page
- [x] Add error handling for failed API calls
- [x] Add loading states
- [ ] Add success/error notifications (toast)
- [ ] Add bulk operations

### ✅ COMPLETED (MVP Core Features)

#### Candidates Management
- [x] Candidate model and database table (18 fields)
- [x] Candidate CRUD API endpoints (backend/app/api/v1/endpoints/candidates.py)
- [x] Candidate list page with filters
- [x] Add candidate form (modal)
- [x] Edit candidate functionality
- [x] Delete candidate functionality
- [x] Link candidates to requirements
- [x] Status management (7 statuses with color coding)
- [x] Skills as JSONB array
- [x] Search by name/email
- [x] 20 realistic test candidates seeded

### 📅 REQUIRED FOR MVP (Critical Priority)

#### Settings & Permissions
- [ ] Permissions matrix API (GET/POST endpoints)
- [ ] Connect Settings page to backend
- [ ] Role-based access control enforcement
- [ ] Audit logging for permission changesign
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
- **Migration**: Alembic 1.16.5**candidates**, approvals, job_postings)
- **ENUMs**: 6 (RequirementStatus, RequirementType, EmploymentType, WorkMode, Priority, **CandidateStatus**)
- **Relationships**: Many-to-many, one-to-many with proper foreign keys
- **Migrations**: Alembic-managed, current head: d14639c18ccb
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

> **📖 For detailed setup instructions, see [SETUP.md](SETUP.md)**

### Quick Links

- **[Complete Setup Guide](SETUP.md)** - Step-by-step installation instructions
- **[API Documentation](http://localhost:8000/docs)** - Interactive API explorer
- **[Code Changes Summary](COMMIT_SUMMARY.md)** - Recent development history
- **[Project Reference](docs/project-reference.md)** - Comprehensive documentation

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

1. **Test Backauthentication working):
   - Email: admin@hiringhare.com
   - Password: Admin@2024
   - Or: manager@hiringhare.com / Manager@2024
   - Or: recruiter@hiringhare.com / Recruiter@2024

4. **Test Candidates Page**:
```powershell
# Backend test
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/candidates" -Headers @{Authorization="Bearer <token>"} -UseBasicParsing
```

**Expected:** 20 test candidates with diverse statusesttp://localhost:8000/health" -UseBasicParsing
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
5. ✅ **Candidates can be added and linked to requirements (COMPLETED!)**
6. ✅ **Token-based authentication UI is functional (COMPLETED!)**
7. 🔄 Dashboard shows REAL data from database (IN PROGRESS)
8. ⏳ Permissions matrix connected to backend API (NEXT)
9. ⏳ Basic approval workflow works (submit/approve/reject) (NEXT)
10. ⏳ Job postings can be created from requirements (NEXT)

**Estimated MVP Completion**: Mid-January 2026

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**What this means:**
- ✅ Free to use for personal and commercial projects
- ✅ Free to modify and distribute
- ✅ Free to use in proprietary software
- ✅ No warranty provided (use at your own risk)

**Attribution:**
While not required, attribution is appreciated! You can:
- Keep the "Built with Hiring Hare" footer
- Link back to this repository
- Mention in your project documentation

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's:

- 🐛 **Bug Reports** - Help us identify and fix issues
- 💡 **Feature Requests** - Suggest new functionality
- 📖 **Documentation** - Improve guides and examples
- 💻 **Code Contributions** - Submit pull requests
- ⭐ **Star the Repo** - Show your support!

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Contributors

Thank you to everyone who has contributed to Hiring Hare! 🎉

<!-- Add contributor list here as project grows -->

---

## 📞 Support & Community

### Getting Help

- 📖 **Documentation**: Start with [SETUP.md](SETUP.md) and [README.md](README.md)
- 🐛 **Bug Reports**: [Open an issue](https://github.com/Maneesh-Relanto/os-hiring-hare/issues/new)
- 💬 **Questions**: [GitHub Discussions](https://github.com/Maneesh-Relanto/os-hiring-hare/discussions)
- 📧 **Contact**: [Create an issue](https://github.com/Maneesh-Relanto/os-hiring-hare/issues) for project-related queries

### Roadmap

**v0.1.0 (Current)** - MVP Development
- ✅ Core recruitment tracking
- ✅ Candidates management
- ✅ Authentication & RBAC

**v0.2.0 (Planned)** - Dashboard & Approvals
- ⏳ Real-time dashboard metrics
- ⏳ Approval workflows
- ⏳ Job postings

**v1.0.0 (Future)** - Production Ready
- ⏳ Interview scheduling
- ⏳ Email notifications
- ⏳ Document management
- ⏳ Advanced reporting

**v2.0.0 (Future)** - Enterprise Features
- ⏳ Standalone RBAC module
- ⏳ Multi-tenant support
- ⏳ API integrations
- ⏳ Mobile apps

See [GitHub Projects](https://github.com/Maneesh-Relanto/os-hiring-hare/projects) for detailed roadmap.

---

## 🙏 Acknowledgments

**Built with these amazing open-source technologies:**

- **FastAPI** - Modern Python web framework
- **React** - JavaScript library for building UIs
- **Material-UI** - React component library
- **PostgreSQL** - Powerful open-source database
- **SQLAlchemy** - Python SQL toolkit
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **TypeScript** - Type-safe JavaScript

**Special thanks to:**
- The open-source community for amazing tools
- Everyone who reports bugs and suggests improvements
- Contributors who help make this project better

---

## ⭐ Show Your Support

If you find Hiring Hare useful, please consider:

- ⭐ **Star this repository** on GitHub
- 🍴 **Fork it** and customize for your needs
- 🐛 **Report bugs** to help us improve
- 💡 **Suggest features** you'd like to see
- 🤝 **Contribute code** via pull requests
- 📢 **Share it** with others who might benefit

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/Maneesh-Relanto/os-hiring-hare?style=social)
![GitHub forks](https://img.shields.io/github/forks/Maneesh-Relanto/os-hiring-hare?style=social)
![GitHub issues](https://img.shields.io/github/issues/Maneesh-Relanto/os-hiring-hare)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Maneesh-Relanto/os-hiring-hare)
![GitHub last commit](https://img.shields.io/github/last-commit/Maneesh-Relanto/os-hiring-hare)

---

<div align="center">

**Made with ❤️ for the HR Community**

[Report Bug](https://github.com/Maneesh-Relanto/os-hiring-hare/issues) · [Request Feature](https://github.com/Maneesh-Relanto/os-hiring-hare/issues) · [Contribute](CONTRIBUTING.md)

**© 2026 Hiring Hare · [MIT License](LICENSE)**

</div>


---

## 🔧 Recent Updates (January 6, 2026)

### Major Fixes Applied ✅

1. **Resolved 403 Forbidden Error on Candidates Page**
   - **Issue**: Frontend axios reading JWT tokens from wrong localStorage keys
   - **Root Cause**: Zustand persist middleware stores tokens in 'auth-storage' JSON object, not individual keys
   - **Fix**: Updated axios interceptors to parse 'auth-storage' and extract tokens correctly
   - **Impact**: Candidates page now loads successfully with 200 OK response

2. **Fixed SQLAlchemy Model Conflict**
   - **Issue**: CandidateApplication placeholder conflicting with Candidate model
   - **Root Cause**: Both models used `back_populates="candidates"` with Requirement model
   - **Fix**: Commented out CandidateApplication placeholder, updated imports
   - **Impact**: Alembic autogenerate now detects models correctly

3. **Created Missing Candidates Table**
   - **Issue**: Database had `candidate_applications` placeholder but no `candidates` table
   - **Root Cause**: Empty migration file (b56b9fba438e) generated during model conflict
   - **Fix**: Generated new migration d14639c18ccb with candidates table
   - **Impact**: Candidates CRUD operations now work correctly

4. **Fixed Windows Encoding Issues**
   - **Issue**: UnicodeEncodeError on emoji characters in backend logs
   - **Root Cause**: Windows cmd.exe cp1252 codec cannot encode Unicode emojis
   - **Fix**: Removed emoji characters from logging statements
   - **Impact**: Backend logs display correctly without errors

5. **Added 20 Realistic Test Candidates**
   - Created seed script with diverse candidate profiles
   - Status distribution: new(7), screening(5), interviewing(4), offered(1), hired(1), rejected(1), withdrawn(1)
   - Realistic data: names, companies, skills, LinkedIn URLs
   - **Impact**: Candidates page displays meaningful test data

6. **Repository Cleanup**
   - Created `/temp` folder for temporary debug scripts
   - Updated `.gitignore` to exclude temporary test files
   - Created `SETUP.md` with comprehensive installation guide
   - Created `COMMIT_SUMMARY.md` documenting all code changes
   - **Impact**: Clean repository ready for version control

### Files Modified
- `backend/app/main.py` - Removed emoji logging
- `backend/app/models/__init__.py` - Fixed imports
- `backend/app/models/placeholder.py` - Commented CandidateApplication
- `frontend/src/services/api.ts` - Fixed token storage access
- `backend/scripts/seed_candidates.py` - Added test data
- `backend/alembic/versions/d14639c18ccb_*.py` - New migration
- `.gitignore` - Updated exclusion patterns

---

## 📊 Quick Recap Summary

### What We've Achieved (Jan 3-6, 2026)

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
- Database seeding scripts
- PostgreSQL setup and connection

**Day 3 - Frontend Foundation** ✅
- React + TypeScript setup
- Material-UI with custom theme
- Vibrant purple/teal design system
- React Query integration
- Requirements management UI
- Dashboard with mock data
- Responsive layout with sidebar

**Day 4 - Bug Fixes & Candidates Module** ✅ (January 6, 2026)
- Fixed 403 Forbidden error (token storage issue)
- Resolved SQLAlchemy model conflict
- Created candidates table migration
- Built Candidates CRUD functionality
- Seeded 20 realistic test candidates
- Updated axios interceptors for Zustand
- Repository cleanup and documentation
- Created comprehensive SETUP.md guide
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
