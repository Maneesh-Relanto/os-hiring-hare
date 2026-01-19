# Hiring Hare - Project Overview

**Developer-focused technical guide**

---

## What is Hiring Hare?

A modern recruitment tracking system that helps organizations manage hiring from job requisition to candidate onboarding.

**Tech Stack:**
- **Backend:** Python 3.13 + FastAPI
- **Frontend:** React 18 + TypeScript + Material-UI
- **Database:** PostgreSQL 17
- **Auth:** JWT with refresh tokens
- **State:** Zustand (frontend)
- **Styling:** TailwindCSS + MUI components

---

## Core Features

### 1. Requirement Management
- Create and track hiring requirements
- Multi-level approval workflows
- Status tracking and history

### 2. Candidate Pipeline
- Track candidates through hiring stages
- Store resumes, links, and notes
- Link candidates to requirements

### 3. User Roles & Permissions
- Role-Based Access Control (RBAC)
- Roles: Admin, Hiring Manager, Recruiter, Approver
- Granular permissions system

### 4. Dashboard & Reports
- Real-time metrics
- Requirement status overview
- Candidate pipeline visibility

---

## Architecture

### Backend Structure
```
backend/app/
├── api/v1/endpoints/   # API routes
├── core/               # Config, security, database
├── models/             # SQLAlchemy models
├── schemas/            # Pydantic schemas
├── services/           # Business logic
├── tasks/              # Background tasks
└── utils/              # Helper functions
```

### Frontend Structure
```
frontend/src/
├── api/                # API client
├── components/         # Reusable components
├── pages/              # Page components
├── routes/             # Routing config
├── stores/             # Zustand stores
├── types/              # TypeScript types
└── utils/              # Helper functions
```

---

## Key Technologies

### Backend
- **FastAPI** - Modern async Python web framework
- **SQLAlchemy 2.0** - ORM with async support
- **Alembic** - Database migrations
- **Pydantic** - Data validation
- **PyJWT** - JWT authentication
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **React Query** - Server state
- **Zustand** - Client state
- **Material-UI** - Component library

### Database
- **PostgreSQL 17** - Primary database
- **JSONB** - For flexible data (skills, metadata)
- **UUID** - Primary keys
- **Soft deletes** - Audit trail preservation

---

## API Structure

### Authentication
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
```

### Requirements
```
GET    /api/v1/requirements
POST   /api/v1/requirements
GET    /api/v1/requirements/{id}
PUT    /api/v1/requirements/{id}
DELETE /api/v1/requirements/{id}
```

### Candidates
```
GET    /api/v1/candidates
POST   /api/v1/candidates
GET    /api/v1/candidates/{id}
PUT    /api/v1/candidates/{id}
```

### Users & Roles
```
GET    /api/v1/users
GET    /api/v1/roles
POST   /api/v1/users/{id}/roles
```

**Full API docs:** http://localhost:8000/docs (when running)

---

## Database Schema

### Core Tables
- `users` - User accounts and authentication
- `roles` - User roles (Admin, Recruiter, etc.)
- `permissions` - Granular permissions
- `role_permissions` - Role-permission mapping
- `user_roles` - User-role mapping

### Business Tables
- `requirements` - Hiring requirements/requisitions
- `candidates` - Candidate information
- `approvals` - Approval workflow records
- `departments` - Organization departments
- `locations` - Office locations
- `job_levels` - Job level definitions

See [database-schema.md](../architecture/database-schema.md) for details.

---

## Development Workflow

### 1. Setup (First Time)
```bash
# See SETUP.md for full instructions
cd backend
py -3.13 -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head

cd ../frontend
npm install
```

### 2. Daily Development
```bash
# Terminal 1: Backend
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 3. Database Changes
```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

### 4. Code Quality
```bash
# Backend
black .           # Format
ruff check .      # Lint
mypy .           # Type check

# Frontend
npm run lint      # ESLint
npm run build     # Check for errors
```

---

## Configuration

### Environment Variables

**Backend (.env):**
```bash
DATABASE_URL=postgresql://user:pass@localhost/hiring_hare
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

**Frontend (.env):**
```bash
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Testing

### Backend Tests
```bash
cd backend
pytest                    # Run all tests
pytest tests/test_auth.py # Specific test
pytest -v                 # Verbose
pytest --cov              # Coverage
```

### Frontend Tests
```bash
cd frontend
npm test                  # Run tests
npm run test:coverage     # With coverage
```

---

## Deployment

### Production Checklist
- [ ] Set strong `SECRET_KEY`
- [ ] Configure production database
- [ ] Set `DEBUG=False`
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Set up backups
- [ ] Configure logging
- [ ] Set up monitoring

### Build Commands
```bash
# Backend
pip install -r requirements.txt
alembic upgrade head

# Frontend
npm run build
# Output: frontend/dist/
```

---

## Common Tasks

### Add New API Endpoint
1. Create route in `backend/app/api/v1/endpoints/`
2. Define schema in `backend/app/schemas/`
3. Add business logic in `backend/app/services/`
4. Update API client in `frontend/src/api/`
5. Create React Query hook in `frontend/src/hooks/`

### Add Database Table
1. Create model in `backend/app/models/`
2. Create migration: `alembic revision --autogenerate`
3. Review and apply: `alembic upgrade head`
4. Create schema in `backend/app/schemas/`
5. Add TypeScript type in `frontend/src/types/`

### Add New Page
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/routes/`
3. Update navigation in `frontend/src/components/layout/`

---

## Troubleshooting

### Backend Issues
- **Import errors:** Check virtual environment is activated
- **Database errors:** Verify DATABASE_URL and PostgreSQL is running
- **Migration conflicts:** Check alembic versions table

### Frontend Issues
- **API errors:** Check VITE_API_URL is correct
- **Auth issues:** Clear localStorage and login again
- **Build errors:** Delete node_modules and reinstall

### Database Issues
- **Connection refused:** Check PostgreSQL service is running
- **Authentication failed:** Verify credentials in .env
- **Migration errors:** Check alembic_version table

---

## Resources

- **Setup Guide:** [SETUP.md](../SETUP.md)
- **Contributing:** [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Database Schema:** [database-schema.md](../architecture/database-schema.md)
- **System Architecture:** [system-architecture.md](../architecture/system-architecture.md)
- **API Docs:** http://localhost:8000/docs

---

## Support

- **Issues:** Report bugs on GitHub Issues
- **Discussions:** Use GitHub Discussions for questions
- **Email:** [your-email@example.com]

---

**Last Updated:** January 19, 2026
