# Hiring Hare 🐇

**Recruitment Requirement Tracking System**

[![Tech Stack](https://img.shields.io/badge/Backend-Python%20%2B%20FastAPI-blue)](https://fastapi.tiangolo.com)
[![Tech Stack](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61dafb)](https://react.dev)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

> A comprehensive recruitment requirement tracking system designed to help corporate organizations manage their hiring needs from initial identification through successful candidate onboarding.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Status](#project-status)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Development Roadmap](#development-roadmap)
- [Team](#team)

---

## 🎯 Overview

**Hiring Hare** is an enterprise-grade recruitment requirement tracking platform that provides:

- **Complete Visibility**: Track every hiring requirement from creation to closure
- **Automated Workflows**: Multi-level approval processes with SLA tracking
- **Collaboration**: Seamless coordination between hiring managers, recruiters, and interviewers
- **Analytics**: Data-driven insights into recruitment metrics and bottlenecks
- **Compliance**: Complete audit trail for regulatory requirements

### Business Goals

- 🎯 **30% reduction** in time-to-fill (from 45 to 31 days)
- ⚡ **50% faster** approval cycles (from 10 to 5 days)
- 👁️ **95% visibility** into hiring pipeline
- 📊 **Zero lost requirements** with complete tracking
- ✅ **100% audit compliance**

---

## 🚀 Project Status

**Current Phase:** Phase 1 - Foundation Development  
**Version:** 0.1.0 (Pre-Alpha)  
**Last Updated:** January 3, 2026  
**Development Progress:** [See PROGRESS.md](PROGRESS.md)

### Completed ✅
- [x] Business requirements analysis (80+ requirements)
- [x] Functional requirements documentation
- [x] Tech stack selection (Python + React)
- [x] System architecture design
- [x] Database schema design (20+ tables)
- [x] Workflow design (8-stage recruitment process)
- [x] Backend project structure (FastAPI)
- [x] Database models (User, Role, Permission, Department, Requirement)
- [x] Core security utilities (JWT, password hashing)
- [x] UI/UX design system (vibrant & modern)

### In Progress 🔄
- [x] Frontend project setup (React + TypeScript + Vite)
- [ ] Authentication endpoints
- [ ] Database migrations (Alembic)
- [ ] Docker Compose configuration

### Upcoming 📅
- [ ] Authentication UI with gradient design
- [ ] User management dashboard
- [ ] Requirement creation form
- [ ] Approval workflow implementation
- [ ] MVP testing and refinement

---

## ✨ Features

### Core Functionality

#### 1. **Requirement Management**
- Create, edit, and submit hiring requirements
- Draft save functionality
- Template-based requirement creation
- Multi-location support
- Priority-based tracking

#### 2. **Approval Workflows**
- Multi-level approval chains
- Configurable workflow templates
- SLA tracking and reminders
- Escalation mechanisms
- Parallel and sequential approvals
- Delegation support

#### 3. **Recruiter Module**
- Requirement assignment
- Job posting to multiple channels (LinkedIn, Indeed, internal portal)
- Candidate sourcing and tracking
- Resume management
- Candidate pipeline visualization

#### 4. **Interview Management**
- Interview scheduling with calendar integration
- Panel member coordination
- Feedback collection (structured forms)
- Video/phone/in-person interview support
- Automated reminders

#### 5. **Offer Management**
- Offer creation and approval
- Offer letter generation
- Acceptance/rejection tracking
- Offer analytics

#### 6. **Reporting & Analytics**
- Real-time dashboards
- Time-to-fill metrics
- Bottleneck identification
- Recruiter performance
- Source effectiveness
- Custom report builder

#### 7. **Notifications**
- In-app notifications
- Email notifications
- Real-time WebSocket updates
- Configurable notification preferences
- Digest emails

#### 8. **Audit & Compliance**
- Complete audit trail
- Immutable change logs
- User action tracking
- Compliance reports
- Data export capabilities

---

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI 0.109+
- **Language:** Python 3.11+
- **ORM:** SQLAlchemy 2.0+ (Async)
- **Database:** PostgreSQL 15+
- **Cache:** Redis 7+
- **Task Queue:** Celery
- **Validation:** Pydantic v2
- **Auth:** JWT (python-jose, passlib)
- **Migrations:** Alembic

### Frontend
- **Framework:** React 18
- **Language:** TypeScript 5+
- **Build Tool:** Vite 5+
- **UI Library:** Material-UI (MUI) v5 or Ant Design v5
- **State Management:** Zustand / Redux Toolkit
- **Data Fetching:** React Query (TanStack Query)
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Web Server:** NGINX (production)
- **CI/CD:** GitHub Actions
- **Monitoring:** Prometheus + Grafana
- **Error Tracking:** Sentry
- **Logs:** ELK Stack / Loki

### Development Tools
- **Backend:** Black, isort, mypy, pylint/ruff
- **Frontend:** ESLint, Prettier
- **Testing:** pytest, Vitest, Playwright
- **API Docs:** OpenAPI/Swagger (auto-generated)

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────┐
│   React     │  Frontend (TypeScript)
│     SPA     │  - Material-UI/Ant Design
└──────┬──────┘  - React Query
       │         - WebSocket client
       │ HTTPS/WSS
       ▼
┌─────────────────────┐
│   API Gateway       │  NGINX / Load Balancer
│   (NGINX/CloudFront)│
└──────┬──────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   FastAPI Backend (Python)      │
│   ┌───────────────────────────┐ │
│   │ API Routers               │ │
│   │ Business Logic Services   │ │
│   │ SQLAlchemy ORM            │ │
│   └───────────────────────────┘ │
└──────┬──────────┬───────────────┘
       │          │
       ▼          ▼
  ┌──────────┐  ┌──────────┐
  │PostgreSQL│  │  Redis   │
  │ Database │  │  Cache   │
  └──────────┘  └──────────┘

┌─────────────────────────────────┐
│   Background Workers            │
│   Celery (Email, Reports, etc.) │
└─────────────────────────────────┘
```

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Backend Framework** | FastAPI | Async support, auto-documentation, high performance |
| **Frontend Framework** | React + TypeScript | Component reusability, type safety, large ecosystem |
| **Database** | PostgreSQL | ACID compliance, JSONB support, full-text search |
| **Caching** | Redis | Session management, real-time pub/sub, fast |
| **Authentication** | JWT | Stateless, scalable, industry standard |

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL 15+**
- **Redis 7+**
- **Docker & Docker Compose** (recommended)
- **Git**

### Quick Start (Docker - Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd hiring-hare

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start all services with Docker Compose
docker-compose up -d

# Run database migrations
docker-compose exec backend alembic upgrade head

# Create initial admin user
docker-compose exec backend python scripts/create_admin.py

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Manual Setup

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/hiring_hare_db

# Run migrations
alembic upgrade head

# Seed initial data
python scripts/seed_data.py

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local with API URL
# VITE_API_BASE_URL=http://localhost:8000

# Start development server
npm run dev
```

### Default Credentials

**Admin Account:**
- Email: `admin@hiringhare.com`
- Password: `Admin@123` (change immediately after first login)

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` and `/architecture` folders:

### Planning & Requirements
- [Project Reference](docs/project-reference.md) - Complete project overview and decisions
- [Functional Requirements](requirements/functional-requirements.md) - 80+ detailed requirements
- [Tech Stack Analysis](architecture/tech-stack-analysis.md) - Technology evaluation

### Technical Documentation
- [System Architecture](architecture/system-architecture.md) - Complete technical architecture
- [Database Schema](architecture/database-schema.md) - Database design with 20+ tables
- [API Specification](architecture/api-specification.md) - REST API endpoints (coming soon)

### Workflow Diagrams
- [High-Level Workflow](diagrams/high-level-recruitment-workflow.drawio)
- [Detailed Workflow](diagrams/detailed-recruitment-workflow.drawio)

### Development Guides
- [Backend Development Guide](backend/README.md) (coming soon)
- [Frontend Development Guide](frontend/README.md) (coming soon)
- [Deployment Guide](docs/deployment-guide.md) (coming soon)
- [Contributing Guide](CONTRIBUTING.md) (coming soon)

---

## 📁 Project Structure

```
hiring-hare/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   └── v1/
│   │   ├── core/              # Core config, security
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   ├── tasks/             # Celery tasks
│   │   └── utils/             # Utilities
│   ├── migrations/            # Alembic migrations
│   ├── tests/                 # Backend tests
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Environment template
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── api/               # API client
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom hooks
│   │   ├── stores/            # State management
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utilities
│   │   └── routes/            # Route definitions
│   ├── public/                # Static assets
│   ├── package.json           # Node dependencies
│   └── .env.example           # Environment template
│
├── docs/                       # Project documentation
│   └── project-reference.md
├── requirements/               # Requirements specs
│   └── functional-requirements.md
├── architecture/               # Architecture docs
│   ├── system-architecture.md
│   ├── database-schema.md
│   └── tech-stack-analysis.md
├── diagrams/                   # Workflow diagrams
│   ├── high-level-recruitment-workflow.drawio
│   └── detailed-recruitment-workflow.drawio
│
├── docker-compose.yml         # Docker services
├── .gitignore
└── README.md                  # This file
```

---

## 🗓️ Development Roadmap

### Phase 0: Setup (Weeks 1-2) - Current
- [x] Planning & requirements
- [x] Architecture design
- [x] Database schema design
- [ ] Project structure setup
- [ ] Development environment
- [ ] CI/CD pipeline

### Phase 1: Foundation (Weeks 3-6)
- [ ] Authentication & authorization
- [ ] User management
- [ ] Department & organizational structure
- [ ] Base entities setup
- [ ] Dashboard layout

### Phase 2: Core Hiring (Weeks 7-10)
- [ ] Requirement CRUD operations
- [ ] Draft/submit workflow
- [ ] File upload (job descriptions)
- [ ] Requirement listing & filtering

### Phase 3: Approvals (Weeks 11-14)
- [ ] Approval workflow engine
- [ ] Multi-level approvals
- [ ] SLA tracking
- [ ] Email notifications
- [ ] Approval dashboards

### Phase 4: Recruitment (Weeks 15-18)
- [ ] Recruiter assignment
- [ ] Job posting module
- [ ] Candidate management
- [ ] Resume upload & viewing

### Phase 5: Interviews (Weeks 19-22)
- [ ] Interview scheduling
- [ ] Calendar integration (Google/Outlook)
- [ ] Feedback collection
- [ ] Interview coordination

### Phase 6: Offers & Polish (Weeks 23-26)
- [ ] Offer creation & approval
- [ ] Offer letter generation
- [ ] Onboarding tracking
- [ ] Advanced analytics
- [ ] Performance optimization
- [ ] User acceptance testing

### Post-MVP Enhancements
- [ ] Resume parsing (AI/ML)
- [ ] Advanced search & filters
- [ ] Mobile app
- [ ] Integration with ATS systems
- [ ] Video interview integration
- [ ] Advanced reporting
- [ ] Multi-language support

---

## 👥 Team

| Role | Responsibility |
|------|---------------|
| **Product Owner** | Requirements, priorities, acceptance |
| **Tech Lead** | Architecture, technical decisions |
| **Backend Developers** | FastAPI, PostgreSQL, APIs |
| **Frontend Developers** | React, UI/UX implementation |
| **Full-Stack Developer** | Feature development across stack |
| **QA Engineer** | Testing, quality assurance |
| **UI/UX Designer** | Design system, user experience |
| **DevOps Engineer** | CI/CD, deployment, monitoring |

---

## 📊 Key Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time-to-Fill** | 31 days (30% reduction) | System tracked |
| **Approval Cycle** | 5 days (50% reduction) | Workflow analytics |
| **System Uptime** | 99.5% | Monitoring tools |
| **API Response Time** | < 200ms (p95) | APM |
| **User Adoption** | 95% in 3 months | Login metrics |
| **User Satisfaction** | 4.0/5.0 | Quarterly surveys |

---

## 🔒 Security

- **Authentication:** JWT with access/refresh token rotation
- **Authorization:** Role-Based Access Control (RBAC)
- **Encryption:** TLS 1.3 for data in transit, AES-256 for data at rest
- **Password Policy:** Bcrypt hashing, minimum complexity requirements
- **Rate Limiting:** Per-user and per-IP rate limits
- **Audit Logging:** Complete immutable audit trail
- **Input Validation:** Pydantic validation on all inputs
- **OWASP Compliance:** Following OWASP Top 10 security practices

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **Backend:** Follow PEP 8, use Black for formatting
- **Frontend:** Follow ESLint rules, use Prettier for formatting
- **Commits:** Follow Conventional Commits specification
- **Testing:** Maintain 80%+ code coverage

---

## 📝 License

This project is proprietary software. All rights reserved.

Copyright © 2026 Hiring Hare

---

## 📞 Contact & Support

- **Issues:** [GitHub Issues](https://github.com/your-org/hiring-hare/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-org/hiring-hare/discussions)
- **Email:** support@hiringhare.com
- **Documentation:** [docs.hiringhare.com](https://docs.hiringhare.com) (coming soon)

---

## 🙏 Acknowledgments

- FastAPI framework and community
- React and TypeScript communities
- PostgreSQL development team
- All contributors and early adopters

---

<div align="center">

**Built with ❤️ for better hiring processes**

[Documentation](docs/) • [Architecture](architecture/) • [Requirements](requirements/)

</div>
