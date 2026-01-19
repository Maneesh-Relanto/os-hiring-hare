# Hiring Hare 🐇

**Recruitment Requirement Tracking System**

[![Python](https://img.shields.io/badge/Python-3.13-blue?logo=python)](https://www.python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Code Style](https://img.shields.io/badge/code%20style-black-000000)](https://github.com/psf/black)
[![Status](https://img.shields.io/badge/Status-Active%20Development-orange)]()

> A recruitment tracking system for managing hiring requirements and candidates. Features JWT authentication, RBAC, and a modern React UI with Material-UI.

**Version:** 0.1.0  
**Last Updated:** January 19, 2026

> 🎉 **Open Source & Free to Fork!** This project is MIT licensed. Fork it, customize it, use it for your organization's recruitment needs. See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

## 🚀 Quick Links

- **[⚡ Quick Setup](SETUP.md)** - Get started in 5 minutes
- **[📖 Project Overview](docs/PROJECT_OVERVIEW.md)** - Technical guide for developers
- **[🎨 Features Guide](docs/FEATURES.md)** - Feature overview and workflows
- **[🤝 Contributing](CONTRIBUTING.md)** - How to contribute
- **[🏗️ System Architecture](architecture/system-architecture.md)** - Architecture details
- **[💾 Database Schema](architecture/database-schema.md)** - Database design

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

**Hiring Hare** is a recruitment tracking system that provides:

- **Requirements Management**: Create, track, and manage hiring requisitions
- **Candidate Pipeline**: Track candidates through hiring stages
- **Modern UI**: React-based interface with Material-UI components
- **JWT Authentication**: Token-based authentication with refresh tokens
- **RESTful API**: FastAPI backend with automatic OpenAPI documentation
- **Type Safety**: TypeScript frontend with full type definitions
- **RBAC**: Role-based access control with permissions system

---

## 🍴 Forking & Customization

**Hiring Hare is designed to be forked and customized for your organization's needs!**

### Perfect for:
- 🏢 **Corporate HR Teams** - Use as-is for recruitment tracking
- 🎓 **Educational Projects** - Learn full-stack development with real-world app
- 🔧 **Custom Solutions** - Fork and modify for your specific requirements
- 📚 **Portfolio Projects** - Showcase your development skills

### What You Get:
- Authentication system with JWT tokens
- React UI with Material-UI components
- FastAPI backend with OpenAPI documentation
- PostgreSQL database with Alembic migrations
- Role-based access control (RBAC)
- Setup guide and seed scripts
- MIT License

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

**Note:** RBAC is integrated into the application. It is not available as a standalone module.

---

## ✅ Current Status

### Backend (FastAPI + Python 3.13)
- FastAPI application with CORS middleware
- PostgreSQL database with SQLAlchemy 2.0 (async)
- JWT authentication (access + refresh tokens)
- User registration and login endpoints
- Requirements CRUD API with pagination, filtering, search
- Candidates CRUD API
- Reference data API (departments, job levels, locations)
- Database migrations with Alembic
- Seed scripts for test data

### Frontend (React 18 + TypeScript)
- React application with Material-UI
- Design system: Purple (#A855F7) and Teal (#22D3EE) theme
- React Query for data fetching
- Zustand for state management
- React Router for navigation
- Responsive layout with sidebar
- Dashboard page (mock data)
- Requirements management page (functional)
- Candidates management page (functional)
- Authentication UI with token handling

### Database
- 12 tables: users, roles, permissions, role_permissions, user_roles, departments, job_levels, locations, requirements, candidates, approvals, job_postings
- 6 ENUMs: RequirementStatus, RequirementType, EmploymentType, WorkMode, Priority, CandidateStatus
- Seeded test data: 8 departments, 8 job levels, 7 locations, 3 users, 20 candidates

### Running Services
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

---

## 🎯 Development Roadmap

### Completed
- [x] Backend API with FastAPI
- [x] PostgreSQL database with SQLAlchemy models
- [x] JWT authentication system
- [x] Requirements CRUD
- [x] Candidates CRUD
- [x] Reference data API
- [x] Frontend with React + TypeScript
- [x] Material-UI theme and components
- [x] Authentication UI
- [x] Requirements management UI
- [x] Candidates management UI

### In Progress
- [ ] Dashboard with real API data
- [ ] Approval workflow
- [ ] Job postings module

### Planned
- [ ] Interview scheduling
- [ ] Email notifications
- [ ] Document attachments
- [ ] Advanced reporting
- [ ] Export functionality

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
---

## 🚀 Getting Started

### Prerequisites
- Python 3.13+
- Node.js 18+
- PostgreSQL 17+
- Git

### Quick Start

**1. Clone and setup database:**
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

##  License

MIT License - see [LICENSE](LICENSE) file.

**What this means:**
- Free to use for personal and commercial projects
- Free to modify and distribute
- No warranty provided

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📞 Support

- **Documentation**: [SETUP.md](SETUP.md), [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)
- **Issues**: [GitHub Issues](https://github.com/Maneesh-Relanto/os-hiring-hare/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Maneesh-Relanto/os-hiring-hare/discussions)


---

## � License

MIT License - see [LICENSE](LICENSE) file.

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📞 Support

- **Documentation**: [SETUP.md](SETUP.md), [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)
- **Issues**: [GitHub Issues](https://github.com/Maneesh-Relanto/os-hiring-hare/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Maneesh-Relanto/os-hiring-hare/discussions)

---

**Built with Python, React, and PostgreSQL**

*Last updated: January 19, 2026*

