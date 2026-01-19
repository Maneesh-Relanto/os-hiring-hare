# Features Guide

**Overview of Hiring Hare features for developers**

---

## User Roles

### Admin
- Full system access
- Manage users and roles
- Configure system settings
- View all data

### Hiring Manager
- Create hiring requirements
- Submit for approval
- View own department requirements
- Participate in interviews

### Recruiter
- Manage assigned requirements
- Add and track candidates
- Schedule interviews
- Update candidate status

### Approver
- Review and approve/reject requirements
- View pending approvals
- Add approval comments
- Delegate approvals

---

## Core Workflows

### 1. Requirement Creation
1. Hiring Manager creates new requirement
2. Fills in job details (title, department, location, etc.)
3. Submits for approval
4. Requirement enters approval workflow

### 2. Approval Process
1. Requirement routed to approvers based on rules
2. Approvers can:
   - Approve (with optional comments)
   - Reject (must provide reason)
   - Request more information
3. Once approved, requirement becomes active
4. Recruiter is assigned

### 3. Candidate Management
1. Recruiter adds candidates to requirement
2. Tracks candidate through stages:
   - New
   - Screening
   - Interviewing
   - Offered
   - Hired
   - Rejected
   - Withdrawn
3. Stores candidate information and documents
4. Records interview feedback

### 4. Requirement Closure
1. When position is filled, requirement is marked closed
2. Metrics are calculated (time-to-fill, etc.)
3. Full audit trail is preserved

---

## Feature Modules

### Requirements Module
**What it does:**
- Create and manage hiring requisitions
- Track requirement status
- Link to departments and locations
- Support different job types (full-time, contract, etc.)

**Key Fields:**
- Title, department, location
- Number of openings
- Priority level
- Required skills
- Salary range
- Job description
- Hiring manager

### Candidates Module
**What it does:**
- Track candidates for each requirement
- Store candidate information
- Manage candidate pipeline
- Record interview feedback

**Key Fields:**
- Name, email, phone
- Resume URL
- LinkedIn, portfolio links
- Current company and title
- Experience and skills
- Status and notes
- Assigned recruiter

### Approvals Module
**What it does:**
- Route requirements through approval workflow
- Track approval history
- Support multi-level approvals
- Send notifications

**Key Features:**
- Sequential or parallel approvals
- Auto-routing based on rules
- Approval delegation
- Audit trail

### Dashboard Module
**What it does:**
- Display key metrics
- Show pending actions
- Visualize pipeline
- Quick access to recent items

**Key Metrics:**
- Active requirements count
- Candidates in pipeline
- Pending approvals
- Recent activity

---

## Permissions

### Permission Structure
Each role has a set of permissions that control access:

**Requirements:**
- `requirements:view` - View requirements
- `requirements:create` - Create new requirements
- `requirements:edit` - Edit requirements
- `requirements:delete` - Delete requirements
- `requirements:approve` - Approve requirements

**Candidates:**
- `candidates:view` - View candidates
- `candidates:create` - Add candidates
- `candidates:edit` - Edit candidate info
- `candidates:delete` - Remove candidates

**Users:**
- `users:view` - View users
- `users:create` - Create users
- `users:edit` - Edit user info
- `users:delete` - Delete users
- `users:manage_roles` - Assign roles

**Reports:**
- `reports:view` - View reports
- `reports:export` - Export data

---

## Data Model Relationships

```
User
├── has many Requirements (as creator)
├── has many Approvals (as approver)
├── has many Candidates (as assigned recruiter)
└── belongs to many Roles

Role
├── has many Users
└── has many Permissions

Requirement
├── belongs to User (creator)
├── belongs to Department
├── belongs to Location
├── has many Approvals
└── has many Candidates

Candidate
├── belongs to Requirement
└── belongs to User (assigned recruiter)

Approval
├── belongs to Requirement
└── belongs to User (approver)
```

---

## Status Flows

### Requirement Status
1. **Draft** - Being created
2. **Pending Approval** - Submitted for approval
3. **Approved** - Ready for recruitment
4. **Active** - Recruiter assigned, sourcing candidates
5. **On Hold** - Temporarily paused
6. **Closed** - Position filled
7. **Cancelled** - Requirement cancelled

### Candidate Status
1. **New** - Just added
2. **Screening** - Resume review
3. **Interviewing** - In interview process
4. **Offered** - Offer extended
5. **Hired** - Offer accepted, hired
6. **Rejected** - Not selected
7. **Withdrawn** - Candidate withdrew

### Approval Status
1. **Pending** - Awaiting decision
2. **Approved** - Approved
3. **Rejected** - Rejected
4. **More Info Needed** - Requires clarification

---

## API Endpoints by Feature

### Authentication
- POST `/auth/login` - User login
- POST `/auth/refresh` - Refresh token
- GET `/auth/me` - Current user info

### Requirements
- GET `/requirements` - List requirements (filtered by permissions)
- POST `/requirements` - Create requirement
- GET `/requirements/{id}` - Get requirement details
- PUT `/requirements/{id}` - Update requirement
- DELETE `/requirements/{id}` - Delete requirement
- GET `/requirements/{id}/candidates` - Get candidates for requirement

### Candidates
- GET `/candidates` - List candidates
- POST `/candidates` - Add candidate
- GET `/candidates/{id}` - Get candidate details
- PUT `/candidates/{id}` - Update candidate
- PUT `/candidates/{id}/status` - Update candidate status

### Approvals
- GET `/approvals/pending` - Get pending approvals
- POST `/approvals/{id}/approve` - Approve requirement
- POST `/approvals/{id}/reject` - Reject requirement

### Reference Data
- GET `/departments` - List departments
- GET `/locations` - List locations
- GET `/job-levels` - List job levels

### Admin
- GET `/users` - List users
- POST `/users` - Create user
- GET `/roles` - List roles
- POST `/users/{id}/roles` - Assign role to user

---

## Planned Features (Future)

### Phase 2
- Interview scheduling
- Email notifications
- Calendar integration
- Offer letter generation

### Phase 3
- Advanced reporting
- Analytics dashboard
- Bulk import/export
- API webhooks

### Phase 4
- Integration with job boards
- ATS integration
- Mobile app
- AI-powered candidate matching

---

## Configuration Options

### System Settings
- Approval workflow rules
- Email templates
- Default permissions by role
- Requirement fields (required/optional)

### Customization
- Department list
- Location list
- Job levels
- Skill tags
- Priority levels

---

**For developers:** This guide focuses on what the system does. For technical implementation details, see [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) and the code documentation.
