# Contributing to Hiring Hare 🐇

Thank you for your interest in contributing to Hiring Hare! This document provides guidelines and instructions for contributing to the project.

---

## 🌟 Ways to Contribute

- **Report Bugs**: Submit detailed bug reports with reproduction steps
- **Suggest Features**: Propose new features or enhancements
- **Improve Documentation**: Fix typos, clarify instructions, add examples
- **Submit Code**: Fix bugs, implement features, improve performance
- **Share Feedback**: Tell us about your experience using Hiring Hare

---

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/os-hiring-hare.git
cd os-hiring-hare
```

### 2. Set Up Development Environment

Follow the detailed setup instructions in [SETUP.md](SETUP.md):

```bash
# Backend setup
cd backend
py -3.13 -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

### 3. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bugfix branch
git checkout -b bugfix/issue-description
```

---

## 📝 Contribution Guidelines

### Code Style

**Backend (Python)**
- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for functions and classes
- Keep functions focused and small

**Frontend (TypeScript)**
- Follow TypeScript best practices
- Use functional components with hooks
- Keep components small and reusable
- Use meaningful variable names

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good examples:
git commit -m "feat: add candidate bulk import functionality"
git commit -m "fix: resolve 403 error on candidates page"
git commit -m "docs: update SETUP.md with PostgreSQL 17 instructions"
git commit -m "refactor: extract RBAC middleware to separate module"

# Format:
# <type>: <description>
#
# Types: feat, fix, docs, style, refactor, test, chore
```

### Testing

- **Backend**: Run tests before submitting PR
  ```bash
  cd backend
  pytest
  ```

- **Frontend**: Ensure build succeeds
  ```bash
  cd frontend
  npm run build
  ```

- **Manual Testing**: Test your changes in the UI
  1. Start both backend and frontend servers
  2. Test the affected functionality
  3. Verify no regressions in existing features

---

## 🐛 Reporting Bugs

### Before Submitting

1. Check existing [issues](https://github.com/Maneesh-Relanto/os-hiring-hare/issues)
2. Update to the latest version
3. Try to reproduce the bug

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g., Windows 11]
- Python Version: [e.g., 3.13.7]
- Node Version: [e.g., 18.16.0]
- Browser: [e.g., Chrome 120]

**Error Messages**
```
Paste any error messages here
```
```

---

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Problem It Solves**
What problem does this feature address?

**Proposed Solution**
How would you implement this feature?

**Alternatives Considered**
Other approaches you've considered

**Additional Context**
Any other context, screenshots, or examples
```

---

## 🔧 Pull Request Process

### 1. Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Build succeeds without warnings
- [ ] Documentation is updated if needed
- [ ] Commit messages are clear and descriptive

### 2. Submitting PR

1. Push your branch to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request on GitHub
3. Fill out the PR template completely
4. Link any related issues

### 3. PR Template

```markdown
**Description**
What does this PR do?

**Related Issue**
Fixes #[issue-number]

**Changes Made**
- Change 1
- Change 2
- Change 3

**Testing Done**
How did you test these changes?

**Screenshots**
If applicable, add screenshots

**Checklist**
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes
```

### 4. Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, PR will be merged
- Your contribution will be credited!

---

## 🏗️ Development Workflow

### Setting Up for Development

```bash
# 1. Install dependencies
cd backend && pip install -r requirements.txt
cd ../frontend && npm install

# 2. Set up database
psql -U postgres -c "CREATE DATABASE hiring_hare_dev;"
cd backend
py -3.13 -m alembic upgrade head
py -3.13 scripts/seed_data.py

# 3. Run in development mode
# Terminal 1 - Backend
cd backend
py -3.13 -m uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Making Changes

1. **Backend Changes**:
   - Modify Python files in `backend/app/`
   - Add/update tests
   - Update Alembic migrations if database changes
   - Test with `pytest`

2. **Frontend Changes**:
   - Modify TypeScript/React files in `frontend/src/`
   - Ensure TypeScript compiles without errors
   - Test in browser at http://localhost:3000

3. **Database Changes**:
   ```bash
   # Create migration
   cd backend
   py -3.13 -m alembic revision --autogenerate -m "Description"
   
   # Apply migration
   py -3.13 -m alembic upgrade head
   ```

---

## 📚 Project Structure

```
Hiring Hare/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── core/         # Config, security, deps
│   │   └── services/     # Business logic
│   ├── scripts/          # Seed scripts
│   └── alembic/          # Database migrations
│
├── frontend/             # React TypeScript frontend
│   └── src/
│       ├── components/   # React components
│       ├── pages/        # Page components
│       ├── services/     # API services
│       └── store/        # State management
│
└── docs/                 # Documentation
```

---

## 🤝 Community Guidelines

### Be Respectful

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Communication

- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions and discussions
- **Discussions**: General questions and ideas

---

## ❓ Questions?

- Check [README.md](README.md) for project overview
- Read [SETUP.md](SETUP.md) for installation guide
- Review [docs/project-reference.md](docs/project-reference.md) for detailed documentation
- Open a [Discussion](https://github.com/Maneesh-Relanto/os-hiring-hare/discussions) for questions

---

## 🎉 Recognition

Contributors will be:
- Listed in our Contributors section
- Credited in release notes
- Recognized in project documentation

Thank you for contributing to Hiring Hare! 🐇✨
