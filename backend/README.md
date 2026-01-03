# Hiring Hare - Backend

FastAPI backend for Hiring Hare recruitment tracking system.

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+

### Setup

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Initialize database:**
```bash
# Run migrations
alembic upgrade head

# Seed initial data
python scripts/seed_data.py
```

5. **Run development server:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

6. **Access API documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/              # API routes
│   │   └── v1/          # API version 1
│   ├── core/            # Core configuration
│   │   ├── config.py    # Settings
│   │   ├── database.py  # Database setup
│   │   ├── security.py  # Auth utilities
│   │   └── deps.py      # Dependencies
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   ├── tasks/           # Celery tasks
│   ├── utils/           # Utilities
│   └── main.py          # FastAPI app
├── migrations/          # Alembic migrations
├── tests/              # Tests
├── scripts/            # Utility scripts
├── requirements.txt    # Dependencies
└── .env.example        # Environment template
```

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py
```

## 🔧 Code Quality

```bash
# Format code
black app/
isort app/

# Lint code
ruff app/
mypy app/

# Pre-commit hooks
pre-commit install
pre-commit run --all-files
```

## 📝 Development

### Creating a new endpoint

1. Define model in `app/models/`
2. Create schema in `app/schemas/`
3. Implement service in `app/services/`
4. Add route in `app/api/v1/`
5. Write tests in `tests/`

### Database migrations

```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## 🔐 Authentication

API uses JWT bearer tokens:

```bash
# Login to get token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Use token in requests
curl http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📚 API Documentation

Once the server is running:
- Interactive docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc
- OpenAPI schema: http://localhost:8000/openapi.json

## 🐛 Debugging

### Using VS Code

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "app.main:app",
        "--reload",
        "--host",
        "0.0.0.0",
        "--port",
        "8000"
      ],
      "jinja": true
    }
  ]
}
```

## 🚢 Deployment

See main [Deployment Guide](../docs/deployment-guide.md) for production deployment instructions.

## 📄 License

Proprietary - All rights reserved
