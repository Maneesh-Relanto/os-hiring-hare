# Hiring Hare - System Architecture Document
**Project:** Hiring Hare - Recruitment Requirement Tracking System  
**Tech Stack:** Python (FastAPI) + React + TypeScript  
**Version:** 1.0  
**Date:** January 3, 2026  
**Status:** Active Development Guide

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack Details](#2-technology-stack-details)
3. [System Components](#3-system-components)
4. [Data Architecture](#4-data-architecture)
5. [API Architecture](#5-api-architecture)
6. [Security Architecture](#6-security-architecture)
7. [Deployment Architecture](#7-deployment-architecture)
8. [Development Environment](#8-development-environment)
9. [Performance & Scalability](#9-performance--scalability)
10. [Monitoring & Observability](#10-monitoring--observability)

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  React SPA (TypeScript)                                      │
│  - Material-UI / Ant Design                                  │
│  - React Router                                              │
│  - React Query (data fetching)                               │
│  - Zustand/Redux (state management)                          │
│  - WebSocket client                                          │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS / WSS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY / CDN                       │
│  - NGINX / Cloudflare                                        │
│  - SSL/TLS termination                                       │
│  - Rate limiting                                             │
│  - Static asset serving                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  FastAPI Backend (Python 3.11+)                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ API Routers                                           │   │
│  │ - Authentication & Authorization (JWT)                │   │
│  │ - Requirements Management                             │   │
│  │ - Approval Workflows                                  │   │
│  │ - Candidate Management                                │   │
│  │ - Interview Scheduling                                │   │
│  │ - Reporting & Analytics                               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Business Logic Layer                                  │   │
│  │ - Service classes                                     │   │
│  │ - Workflow engine                                     │   │
│  │ - Notification service                                │   │
│  │ - Email service                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Data Access Layer                                     │   │
│  │ - SQLAlchemy ORM (async)                              │   │
│  │ - Alembic migrations                                  │   │
│  │ - Repository pattern                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬───────────────┬───────────┬────────────┘
                     │               │           │
        ┌────────────┘               │           └─────────────┐
        ▼                            ▼                         ▼
┌──────────────────┐     ┌──────────────────┐    ┌────────────────────┐
│   PostgreSQL     │     │      Redis       │    │   File Storage     │
│   Database       │     │   - Cache        │    │   (S3/Minio)       │
│   - Primary data │     │   - Sessions     │    │   - Resumes        │
│   - Audit logs   │     │   - Pub/Sub      │    │   - Job Desc       │
│   - Full-text    │     │   - Celery queue │    │   - Offer letters  │
└──────────────────┘     └──────────────────┘    └────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   BACKGROUND WORKERS                         │
│  Celery Workers (Python)                                     │
│  - Email sending (async)                                     │
│  - Report generation                                         │
│  - Scheduled reminders                                       │
│  - Data export/import                                        │
│  - Resume parsing (if implemented)                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  - SMTP/SendGrid (email)                                     │
│  - Google Calendar API                                       │
│  - Microsoft Graph API (Outlook)                             │
│  - Job boards APIs (Indeed, LinkedIn)                        │
│  - SSO providers (OAuth2, SAML)                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Principles

1. **Separation of Concerns**: Clear boundaries between presentation, business logic, and data access
2. **API-First Design**: RESTful APIs with OpenAPI documentation
3. **Asynchronous Processing**: Non-blocking I/O for better performance
4. **Stateless Services**: Horizontal scalability through stateless design
5. **Security by Design**: Authentication, authorization, and encryption at every layer
6. **Observability**: Comprehensive logging, metrics, and tracing
7. **Cloud-Native**: Containerized, scalable, and cloud-agnostic

---

## 2. Technology Stack Details

### 2.1 Backend Stack

#### **Core Framework**
- **FastAPI 0.109+**: Modern, fast Python web framework
  - Async/await support for high concurrency
  - Automatic OpenAPI documentation
  - Pydantic validation
  - Dependency injection system
  - WebSocket support

#### **Language & Runtime**
- **Python 3.11+**: 
  - Type hints for better code quality
  - Improved performance over 3.10
  - Pattern matching
  - Better async support

#### **Database & ORM**
- **PostgreSQL 15+**: Primary database
  - JSONB for flexible schemas
  - Full-text search capabilities
  - Advanced indexing
  - Row-level security
- **SQLAlchemy 2.0+ (Async)**: ORM
  - Type-safe queries
  - Relationship management
  - Lazy/eager loading
  - Connection pooling
- **Alembic**: Database migrations
- **asyncpg**: Async PostgreSQL driver

#### **Validation & Serialization**
- **Pydantic v2**: Data validation and settings management
  - Type validation
  - Custom validators
  - Serialization/deserialization
  - Settings management

#### **Authentication & Security**
- **python-jose**: JWT token handling
- **passlib[bcrypt]**: Password hashing
- **python-multipart**: File upload handling
- **cryptography**: Encryption utilities

#### **Async Task Queue**
- **Celery 5.3+**: Distributed task queue
- **Redis**: Message broker and result backend

#### **Caching & Session**
- **Redis 7+**: 
  - Session storage
  - Cache layer
  - Pub/Sub for WebSockets
  - Rate limiting

#### **Email**
- **FastAPI-Mail** or **aiosmtplib**: Async email sending
- **Jinja2**: Email templating

#### **Testing**
- **pytest**: Test framework
- **pytest-asyncio**: Async test support
- **httpx**: Async HTTP client for testing
- **faker**: Test data generation

#### **Code Quality**
- **Black**: Code formatting
- **isort**: Import sorting
- **mypy**: Static type checking
- **pylint/ruff**: Linting
- **pre-commit**: Git hooks

### 2.2 Frontend Stack

#### **Core Framework**
- **React 18**: UI library
  - Concurrent features
  - Automatic batching
  - Suspense for data fetching

#### **Build Tool**
- **Vite 5+**: Fast build tool and dev server
  - Hot Module Replacement (HMR)
  - Fast cold start
  - Optimized production builds

#### **Language**
- **TypeScript 5+**: Type-safe JavaScript
  - Better IDE support
  - Early error detection
  - Self-documenting code

#### **UI Component Library**
- **Material-UI (MUI) v5** or **Ant Design v5**
  - Pre-built components
  - Theming support
  - Responsive design
  - Accessibility

#### **Routing**
- **React Router v6**: Client-side routing
  - Nested routes
  - Protected routes
  - Lazy loading

#### **State Management**
- **Zustand** or **Redux Toolkit**:
  - Global state management
  - DevTools support
  - Middleware support

#### **Data Fetching**
- **React Query (TanStack Query) v5**:
  - Server state management
  - Automatic caching
  - Background refetching
  - Optimistic updates
  - Pagination/infinite scroll

#### **Forms**
- **React Hook Form**: Form management
- **Zod**: Schema validation (matches Pydantic on backend)

#### **HTTP Client**
- **Axios**: HTTP requests
  - Interceptors for auth
  - Request/response transformation

#### **WebSocket**
- **native WebSocket API** or **Socket.IO client**

#### **Date/Time**
- **date-fns** or **Day.js**: Date manipulation

#### **Rich Text Editor**
- **TipTap** or **Draft.js**: Job description editing

#### **File Upload**
- **react-dropzone**: Drag & drop file uploads

#### **Notifications**
- **react-toastify**: Toast notifications

#### **Charts & Visualizations**
- **Recharts** or **Chart.js**: Dashboard charts

#### **Testing**
- **Vitest**: Unit testing
- **React Testing Library**: Component testing
- **Playwright** or **Cypress**: E2E testing

#### **Code Quality**
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript compiler**: Type checking

### 2.3 DevOps Stack

#### **Containerization**
- **Docker**: Container runtime
- **Docker Compose**: Local development orchestration

#### **CI/CD**
- **GitHub Actions**: Automated workflows
  - Build and test
  - Linting and type checking
  - Deployment pipelines

#### **Infrastructure**
- **NGINX**: Reverse proxy and load balancer
- **AWS/Azure/GCP**: Cloud hosting options
- **Terraform** (optional): Infrastructure as code

#### **Monitoring**
- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **Sentry**: Error tracking
- **ELK Stack** or **Loki**: Log aggregation

---

## 3. System Components

### 3.1 Backend Components

#### **3.1.1 API Layer (FastAPI Routers)**

**File Structure:**
```
app/
├── api/
│   └── v1/
│       ├── __init__.py
│       ├── auth.py           # Authentication endpoints
│       ├── users.py           # User management
│       ├── requirements.py    # Hiring requirements
│       ├── approvals.py       # Approval workflows
│       ├── candidates.py      # Candidate management
│       ├── interviews.py      # Interview scheduling
│       ├── offers.py          # Offer management
│       ├── reports.py         # Analytics & reporting
│       └── websocket.py       # WebSocket connections
```

**Key Responsibilities:**
- Request validation (Pydantic schemas)
- Response serialization
- Error handling
- Authentication dependency injection
- Rate limiting
- API documentation

#### **3.1.2 Core Services**

```
app/
├── services/
│   ├── __init__.py
│   ├── auth_service.py          # JWT, login, logout
│   ├── requirement_service.py   # CRUD + business logic
│   ├── approval_service.py      # Workflow engine
│   ├── notification_service.py  # Email, in-app, push
│   ├── calendar_service.py      # Google/Outlook integration
│   ├── job_board_service.py     # External job posting
│   ├── report_service.py        # Analytics generation
│   └── file_service.py          # S3/storage operations
```

**Key Responsibilities:**
- Business logic implementation
- Transaction management
- Cross-entity operations
- External service integration

#### **3.1.3 Data Access Layer**

```
app/
├── models/              # SQLAlchemy models
│   ├── __init__.py
│   ├── user.py
│   ├── requirement.py
│   ├── approval.py
│   ├── candidate.py
│   ├── interview.py
│   ├── offer.py
│   └── audit_log.py
├── schemas/             # Pydantic schemas
│   ├── __init__.py
│   ├── user.py
│   ├── requirement.py
│   ├── approval.py
│   ├── candidate.py
│   ├── interview.py
│   └── offer.py
└── repositories/        # Data access repositories (optional)
    ├── __init__.py
    └── base.py
```

**Key Responsibilities:**
- Database operations (CRUD)
- Query optimization
- Data validation
- Relationship management

#### **3.1.4 Background Workers (Celery)**

```
app/
├── tasks/
│   ├── __init__.py
│   ├── email_tasks.py        # Send emails async
│   ├── reminder_tasks.py     # Daily reminders
│   ├── report_tasks.py       # Generate reports
│   ├── cleanup_tasks.py      # Data cleanup
│   └── integration_tasks.py  # Sync with external systems
```

**Key Responsibilities:**
- Async email sending
- Scheduled notifications
- Report generation
- Data exports
- External API calls

#### **3.1.5 Core Utilities**

```
app/
├── core/
│   ├── config.py         # Settings management
│   ├── security.py       # Password hashing, JWT
│   ├── deps.py          # FastAPI dependencies
│   └── database.py      # DB connection
├── utils/
│   ├── email.py
│   ├── validators.py
│   ├── formatters.py
│   └── helpers.py
```

### 3.2 Frontend Components

#### **3.2.1 Application Structure**

```
src/
├── api/                 # API client
│   ├── client.ts
│   ├── auth.ts
│   ├── requirements.ts
│   ├── approvals.ts
│   └── ...
├── components/          # Reusable components
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Table.tsx
│   │   └── Modal.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── features/
│       ├── requirements/
│       ├── approvals/
│       ├── candidates/
│       └── interviews/
├── pages/               # Page components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Requirements/
│   ├── Approvals/
│   ├── Candidates/
│   └── Reports/
├── hooks/               # Custom hooks
│   ├── useAuth.ts
│   ├── useRequirements.ts
│   └── useWebSocket.ts
├── stores/              # State management
│   ├── authStore.ts
│   ├── requirementStore.ts
│   └── notificationStore.ts
├── types/               # TypeScript types
│   ├── models.ts
│   ├── api.ts
│   └── enums.ts
├── utils/               # Utilities
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
└── routes/              # Route definitions
    └── index.tsx
```

---

## 4. Data Architecture

### 4.1 Database Design Principles

1. **Normalization**: 3NF for transactional data
2. **Audit Trail**: All mutations logged with user/timestamp
3. **Soft Deletes**: Use `deleted_at` instead of hard deletes
4. **Timestamps**: `created_at`, `updated_at` on all tables
5. **UUID Primary Keys**: Better for distributed systems
6. **Foreign Key Constraints**: Enforce referential integrity
7. **Indexes**: Strategic indexing for query performance

### 4.2 Core Entities

**Main Tables:**
1. `users` - System users (all roles)
2. `departments` - Organizational structure
3. `job_levels` - Job levels/grades
4. `requirements` - Hiring requirements
5. `approvals` - Approval records
6. `approval_workflows` - Workflow definitions
7. `candidates` - Candidate information
8. `interviews` - Interview details
9. `interview_feedback` - Feedback from panel
10. `offers` - Job offers
11. `job_postings` - External job posts
12. `audit_logs` - Complete audit trail
13. `notifications` - User notifications
14. `file_attachments` - File metadata

*Detailed schema in database-schema.md (to be created)*

### 4.3 Data Access Patterns

#### **Read Patterns:**
- Dashboard: Aggregate queries with caching
- Requirement list: Paginated with filters
- Approval queue: User-specific filtered views
- Candidate pipeline: Status-based filtering
- Reports: Complex joins with materialized views

#### **Write Patterns:**
- Requirement creation: Single transaction with validations
- Approval actions: Transaction with workflow state update + notification
- Status changes: Optimistic locking to prevent conflicts
- Bulk operations: Batch inserts with transaction management

### 4.4 Caching Strategy

**Redis Cache Layers:**

1. **Session Cache** (TTL: 24h)
   - User session data
   - JWT blacklist

2. **Data Cache** (TTL: 5-15 min)
   - User profile
   - Department list
   - Job level list
   - Approval workflow templates

3. **Query Cache** (TTL: 1-5 min)
   - Dashboard statistics
   - Recent requirements list
   - Pending approvals count

4. **WebSocket Pub/Sub**
   - Real-time notifications
   - Status updates
   - Online user presence

---

## 5. API Architecture

### 5.1 RESTful API Design

#### **Base URL:**
```
https://api.hiringhare.com/v1
```

#### **Authentication:**
```
Authorization: Bearer <JWT_TOKEN>
```

#### **Standard Endpoints Pattern:**

```
GET    /api/v1/{resource}              # List (paginated)
POST   /api/v1/{resource}              # Create
GET    /api/v1/{resource}/{id}         # Get by ID
PUT    /api/v1/{resource}/{id}         # Full update
PATCH  /api/v1/{resource}/{id}         # Partial update
DELETE /api/v1/{resource}/{id}         # Delete (soft)
```

#### **Example Endpoints:**

**Authentication:**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
```

**Requirements:**
```
GET    /api/v1/requirements                    # List with filters
POST   /api/v1/requirements                    # Create draft
GET    /api/v1/requirements/{id}               # Get details
PUT    /api/v1/requirements/{id}               # Update
POST   /api/v1/requirements/{id}/submit        # Submit for approval
POST   /api/v1/requirements/{id}/cancel        # Cancel
GET    /api/v1/requirements/{id}/history       # Audit history
GET    /api/v1/requirements/{id}/timeline      # Timeline view
```

**Approvals:**
```
GET    /api/v1/approvals/pending               # My pending approvals
POST   /api/v1/approvals/{id}/approve          # Approve
POST   /api/v1/approvals/{id}/reject           # Reject
POST   /api/v1/approvals/{id}/request-info     # Request more info
```

*Complete API specification in api-specification.md (to be created)*

### 5.2 Request/Response Format

#### **Standard Response Envelope:**

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-01-03T10:30:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2026-01-03T10:30:00Z"
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total_items": 156,
      "total_pages": 8
    }
  }
}
```

### 5.3 WebSocket Architecture

**Connection:**
```
wss://api.hiringhare.com/ws?token=<JWT_TOKEN>
```

**Message Format:**
```json
{
  "type": "notification",
  "event": "requirement.approved",
  "data": {
    "requirement_id": "uuid",
    "title": "Senior Developer",
    "approved_by": "John Doe"
  },
  "timestamp": "2026-01-03T10:30:00Z"
}
```

**Event Types:**
- `requirement.created`
- `requirement.submitted`
- `approval.pending`
- `approval.approved`
- `approval.rejected`
- `candidate.added`
- `interview.scheduled`
- `offer.extended`

---

## 6. Security Architecture

### 6.1 Authentication

**JWT-Based Authentication:**
- Access Token: Short-lived (15 min), stored in memory
- Refresh Token: Long-lived (7 days), stored in httpOnly cookie
- Token rotation on refresh
- Token blacklist for logout

**Flow:**
```
1. User submits credentials
2. Backend validates and issues JWT pair
3. Frontend stores access token in memory
4. Frontend includes token in Authorization header
5. Backend validates token on each request
6. On expiry, frontend uses refresh token
7. Backend issues new token pair
```

### 6.2 Authorization

**Role-Based Access Control (RBAC):**

**Roles:**
1. `super_admin` - Full system access
2. `admin` - Organization-level admin
3. `hiring_manager` - Create requirements
4. `approver` - Approve requirements
5. `recruiter` - Manage candidates
6. `interviewer` - Provide feedback
7. `viewer` - Read-only access

**Permission Matrix:**
| Resource | Create | Read | Update | Delete | Approve |
|----------|--------|------|--------|--------|---------|
| **Requirement** | HM, Admin | All | HM (own), Admin | Admin | Approver |
| **Candidate** | Recruiter, Admin | Recruiter, HM, Admin | Recruiter, Admin | Admin | - |
| **Interview** | Recruiter, Admin | Interviewer, Recruiter | Recruiter, Admin | Admin | - |
| **User** | Admin | Admin | Admin (all), User (self) | Admin | - |

**Implementation:**
```python
from functools import wraps
from fastapi import HTTPException, Depends

def require_role(required_role: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(current_user: User = Depends(get_current_user)):
            if not current_user.has_role(required_role):
                raise HTTPException(403, "Insufficient permissions")
            return await func(current_user=current_user)
        return wrapper
    return decorator

@router.post("/requirements")
@require_role("hiring_manager")
async def create_requirement(...):
    pass
```

### 6.3 Data Security

1. **Encryption at Rest:**
   - Database: PostgreSQL encryption
   - File storage: S3 encryption (AES-256)
   - Sensitive fields: Application-level encryption

2. **Encryption in Transit:**
   - TLS 1.3 for all connections
   - HTTPS only (HSTS enabled)
   - WSS for WebSockets

3. **Password Security:**
   - Bcrypt hashing (cost factor: 12)
   - Minimum password requirements
   - Password history (prevent reuse)

4. **Input Validation:**
   - Pydantic validation on all inputs
   - SQL injection prevention (ORM)
   - XSS prevention (output escaping)
   - CSRF tokens for state-changing operations

5. **Rate Limiting:**
   - Per-user: 100 req/min
   - Per-IP: 500 req/min
   - Login attempts: 5 per 15 min

6. **Audit Logging:**
   - All data mutations logged
   - User actions tracked
   - IP address and user agent logged
   - Immutable audit trail

---

## 7. Deployment Architecture

### 7.1 Container Architecture

**Docker Compose (Development):**
```yaml
services:
  backend:
    image: hiringhare-backend:latest
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://...
  
  frontend:
    image: hiringhare-frontend:latest
    ports: ["3000:80"]
  
  postgres:
    image: postgres:15
    volumes: [postgres_data:/var/lib/postgresql/data]
  
  redis:
    image: redis:7-alpine
  
  celery_worker:
    image: hiringhare-backend:latest
    command: celery -A app.tasks worker
  
  celery_beat:
    image: hiringhare-backend:latest
    command: celery -A app.tasks beat
```

### 7.2 Production Deployment

**Option 1: Traditional Server (Single Server)**
```
NGINX (80/443)
  ├── Static files (React build)
  └── Proxy to FastAPI (8000)
PostgreSQL (5432)
Redis (6379)
Celery Workers (background)
```

**Option 2: Cloud (AWS Example)**
```
Route 53 (DNS)
  └── CloudFront (CDN)
       ├── S3 (React static files)
       └── ALB (Load Balancer)
            └── ECS/Fargate (Backend containers)
                 ├── RDS PostgreSQL
                 ├── ElastiCache Redis
                 └── SQS/EventBridge (Celery alternative)
```

**Option 3: Kubernetes (Scalable)**
```
Ingress Controller (NGINX/Traefik)
  ├── Frontend Pods (React)
  └── Backend Pods (FastAPI)
       ├── Horizontal Pod Autoscaler
       ├── PostgreSQL StatefulSet
       ├── Redis Deployment
       └── Celery Worker Deployment
```

### 7.3 Environment Configuration

**Environments:**
1. **Development**: Local Docker Compose
2. **Staging**: Cloud deployment (smaller resources)
3. **Production**: Cloud deployment (auto-scaling)

**Environment Variables:**
```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db
DATABASE_POOL_SIZE=20

# Redis
REDIS_URL=redis://host:6379/0

# Security
SECRET_KEY=<random-256-bit-key>
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=["https://app.hiringhare.com"]

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<api-key>

# File Storage
S3_BUCKET=hiringhare-files
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>

# External APIs
GOOGLE_CALENDAR_CLIENT_ID=<id>
GOOGLE_CALENDAR_CLIENT_SECRET=<secret>
```

---

## 8. Development Environment

### 8.1 Local Setup

**Prerequisites:**
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Git
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

**Backend Setup:**
```bash
# Clone repository
git clone <repo-url>
cd hiring-hare/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run migrations
alembic upgrade head

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend Setup:**
```bash
cd hiring-hare/frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Run development server
npm run dev
```

**Docker Compose (Recommended):**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Run migrations
docker-compose exec backend alembic upgrade head

# Access services
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

### 8.2 Development Workflow

1. **Branch Strategy:**
   - `main` - Production
   - `develop` - Development
   - `feature/*` - Features
   - `bugfix/*` - Bug fixes
   - `hotfix/*` - Urgent fixes

2. **Commit Convention:**
   ```
   feat: Add requirement creation endpoint
   fix: Fix approval workflow bug
   docs: Update API documentation
   test: Add tests for candidate service
   refactor: Improve query performance
   ```

3. **Code Review Process:**
   - Create feature branch
   - Implement changes
   - Write tests
   - Run linting: `make lint`
   - Run tests: `make test`
   - Create pull request
   - Code review
   - Merge to develop

4. **Testing Strategy:**
   - Unit tests: 80% coverage target
   - Integration tests: API endpoints
   - E2E tests: Critical user flows
   - Performance tests: Load testing

---

## 9. Performance & Scalability

### 9.1 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **API Response Time** | < 200ms (p95) | APM monitoring |
| **Page Load Time** | < 2s (p95) | Real User Monitoring |
| **Database Query Time** | < 50ms (p95) | Query logging |
| **WebSocket Latency** | < 100ms | Custom metrics |
| **Concurrent Users** | 1000+ | Load testing |

### 9.2 Optimization Strategies

**Backend:**
1. **Database Optimization:**
   - Strategic indexes on frequently queried columns
   - Query optimization (EXPLAIN ANALYZE)
   - Connection pooling (20-50 connections)
   - Read replicas for reporting queries

2. **Caching:**
   - Redis caching for reference data
   - Query result caching
   - HTTP cache headers for static content
   - CDN for frontend assets

3. **Async Processing:**
   - Background jobs for email/reports
   - WebSocket for real-time updates
   - Async I/O for external API calls

4. **Code Optimization:**
   - Lazy loading relationships
   - Pagination for large lists
   - Data serialization optimization
   - Response compression (gzip)

**Frontend:**
1. **Bundle Optimization:**
   - Code splitting by route
   - Tree shaking
   - Lazy loading components
   - Dynamic imports

2. **Rendering:**
   - Virtual scrolling for large lists
   - Memoization (React.memo, useMemo)
   - Debouncing/throttling user input
   - Optimistic UI updates

3. **Network:**
   - Request deduplication
   - Batch API calls where possible
   - Prefetching critical data
   - Service Worker caching

### 9.3 Scalability Plan

**Horizontal Scaling:**
- Load balancer distributes traffic
- Stateless backend servers (2-10 instances)
- Shared PostgreSQL (managed service)
- Redis cluster for high availability

**Vertical Scaling:**
- Database: 4-16 CPU, 16-64 GB RAM
- Backend: 2-4 CPU, 4-8 GB RAM per instance
- Redis: 2-4 GB RAM

**Auto-scaling Triggers:**
- CPU > 70% for 5 minutes → scale up
- CPU < 30% for 10 minutes → scale down
- Request rate > 1000/sec → scale up

---

## 10. Monitoring & Observability

### 10.1 Logging

**Log Levels:**
- DEBUG: Detailed diagnostic info
- INFO: General informational messages
- WARNING: Warning messages
- ERROR: Error events
- CRITICAL: Critical failures

**Log Structure (JSON):**
```json
{
  "timestamp": "2026-01-03T10:30:00Z",
  "level": "INFO",
  "logger": "app.api.requirements",
  "message": "Requirement created",
  "user_id": "uuid",
  "requirement_id": "uuid",
  "ip_address": "192.168.1.1",
  "trace_id": "abc123"
}
```

**Log Aggregation:**
- Centralized logging (ELK Stack / Loki)
- Log retention: 30 days
- Search and filtering capabilities
- Alert on ERROR/CRITICAL logs

### 10.2 Metrics

**Application Metrics:**
- Request rate (req/sec)
- Response time (p50, p95, p99)
- Error rate (%)
- Active users
- Database query time
- Cache hit rate

**Business Metrics:**
- Requirements created/day
- Average approval time
- Candidates added/day
- Interviews scheduled/day
- Offers accepted/day

**Infrastructure Metrics:**
- CPU utilization
- Memory usage
- Disk I/O
- Network throughput
- Database connections

**Tools:**
- Prometheus for metrics collection
- Grafana for dashboards
- Alert Manager for notifications

### 10.3 Error Tracking

**Sentry Integration:**
- Automatic error capture
- Stack traces
- User context
- Breadcrumbs
- Release tracking
- Performance monitoring

**Alert Thresholds:**
- Error rate > 1% → Alert
- API response time > 1s → Warning
- Database query time > 500ms → Warning
- Server CPU > 90% → Alert

### 10.4 Health Checks

**Endpoints:**
```
GET /health              # Basic health check
GET /health/ready        # Ready to serve traffic
GET /health/live         # Application is alive
```

**Checks:**
- Database connectivity
- Redis connectivity
- Disk space
- Memory usage
- External service status

---

## 11. Development Roadmap

### Phase 0: Setup (Week 1-2)
- [ ] Repository setup
- [ ] Docker environment
- [ ] CI/CD pipeline
- [ ] Development documentation

### Phase 1: Foundation (Week 3-6)
- [ ] Authentication & authorization
- [ ] User management
- [ ] Basic CRUD operations
- [ ] Dashboard layout

### Phase 2: Core Features (Week 7-14)
- [ ] Requirement management
- [ ] Approval workflows
- [ ] Email notifications
- [ ] File uploads

### Phase 3: Advanced Features (Week 15-22)
- [ ] Candidate management
- [ ] Interview scheduling
- [ ] Calendar integration
- [ ] Reporting

### Phase 4: Polish (Week 23-26)
- [ ] Offer management
- [ ] Onboarding tracking
- [ ] Advanced analytics
- [ ] Performance optimization

---

## Appendix

### A. Glossary
- **ASGI**: Asynchronous Server Gateway Interface
- **ORM**: Object-Relational Mapping
- **CRUD**: Create, Read, Update, Delete
- **JWT**: JSON Web Token
- **RBAC**: Role-Based Access Control
- **CDN**: Content Delivery Network
- **SPA**: Single Page Application

### B. References
- FastAPI Documentation: https://fastapi.tiangolo.com
- SQLAlchemy Documentation: https://docs.sqlalchemy.org
- React Documentation: https://react.dev
- PostgreSQL Documentation: https://www.postgresql.org/docs

---

**Document Control**
- Version: 1.0
- Last Updated: January 3, 2026
- Next Review: Upon completion of database schema design
- Owner: Technical Lead

