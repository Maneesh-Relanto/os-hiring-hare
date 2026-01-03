# Hiring Hare - Database Schema Design
**Project:** Hiring Hare - Recruitment Requirement Tracking System  
**Database:** PostgreSQL 15+  
**Version:** 1.0  
**Date:** January 3, 2026

---

## Table of Contents
1. [Schema Overview](#1-schema-overview)
2. [Core Tables](#2-core-tables)
3. [Relationships & Constraints](#3-relationships--constraints)
4. [Indexes & Performance](#4-indexes--performance)
5. [Migrations Strategy](#5-migrations-strategy)
6. [Sample Queries](#6-sample-queries)

---

## 1. Schema Overview

### 1.1 Database Architecture

**Database:** `hiring_hare_db`  
**Schema:** `public` (default)  
**Encoding:** UTF-8  
**Timezone:** UTC (all timestamps in UTC)

### 1.2 Table Categories

1. **Identity & Access (IAM)**
   - users
   - roles
   - permissions
   - user_roles

2. **Organizational**
   - departments
   - job_levels
   - locations

3. **Core Hiring**
   - requirements
   - requirement_history
   - job_postings

4. **Approval Workflow**
   - approval_workflows
   - approval_stages
   - approvals
   - approval_history

5. **Candidate Management**
   - candidates
   - candidate_sources
   - candidate_applications

6. **Interview Process**
   - interviews
   - interview_rounds
   - interview_feedback
   - interview_panel_members

7. **Offer Management**
   - offers
   - offer_approvals

8. **System & Audit**
   - audit_logs
   - notifications
   - file_attachments
   - system_settings

### 1.3 Design Principles

✅ **UUID Primary Keys**: Better for distributed systems and security  
✅ **Soft Deletes**: `deleted_at` timestamp instead of hard deletes  
✅ **Audit Fields**: `created_at`, `updated_at`, `created_by`, `updated_by` on all tables  
✅ **Enum Types**: PostgreSQL ENUMs for status fields  
✅ **JSONB Fields**: Flexible storage for dynamic data  
✅ **Full-Text Search**: `tsvector` columns for searchable text  
✅ **Foreign Key Constraints**: Enforce referential integrity  
✅ **Check Constraints**: Validate data at database level

---

## 2. Core Tables

### 2.1 Identity & Access Management

#### **Table: users**
**Description:** All system users across all roles

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department_id UUID REFERENCES departments(id),
    job_title VARCHAR(200),
    employee_id VARCHAR(50) UNIQUE,
    manager_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE,
    profile_picture_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_department ON users(department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_manager ON users(manager_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_active ON users(is_active) WHERE deleted_at IS NULL;
```

**Sample Data:**
```sql
INSERT INTO users (email, username, first_name, last_name, job_title, is_superuser) VALUES
('admin@company.com', 'admin', 'System', 'Admin', 'System Administrator', TRUE),
('john.doe@company.com', 'jdoe', 'John', 'Doe', 'Engineering Manager', FALSE);
```

#### **Table: roles**
**Description:** System roles for RBAC

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE, -- Cannot be deleted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_roles_name ON roles(name);
```

**Sample Data:**
```sql
INSERT INTO roles (name, display_name, description, is_system_role) VALUES
('super_admin', 'Super Administrator', 'Full system access', TRUE),
('admin', 'Administrator', 'Organization-level admin', TRUE),
('hiring_manager', 'Hiring Manager', 'Can create and manage hiring requirements', TRUE),
('approver', 'Approver', 'Can approve/reject requirements', TRUE),
('recruiter', 'Recruiter', 'Can manage candidates and job postings', TRUE),
('interviewer', 'Interviewer', 'Can provide interview feedback', TRUE),
('viewer', 'Viewer', 'Read-only access', TRUE);
```

#### **Table: permissions**
**Description:** Granular permissions

```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL, -- e.g., 'requirement', 'candidate'
    action VARCHAR(50) NOT NULL,   -- e.g., 'create', 'read', 'update', 'delete'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_permissions_resource ON permissions(resource);
CREATE UNIQUE INDEX idx_permissions_resource_action ON permissions(resource, action);
```

#### **Table: user_roles**
**Description:** Many-to-many relationship between users and roles

```sql
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiration
    
    UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);
```

#### **Table: role_permissions**
**Description:** Permissions assigned to roles

```sql
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    
    UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
```

---

### 2.2 Organizational Structure

#### **Table: departments**
**Description:** Organizational departments

```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    parent_department_id UUID REFERENCES departments(id),
    head_user_id UUID REFERENCES users(id),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_departments_parent ON departments(parent_department_id);
CREATE INDEX idx_departments_active ON departments(is_active) WHERE deleted_at IS NULL;
```

**Sample Data:**
```sql
INSERT INTO departments (name, code) VALUES
('Engineering', 'ENG'),
('Product', 'PROD'),
('Sales', 'SALES'),
('Marketing', 'MKTG'),
('Human Resources', 'HR'),
('Finance', 'FIN');
```

#### **Table: job_levels**
**Description:** Job levels/grades

```sql
CREATE TABLE job_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    level_order INTEGER NOT NULL, -- 1, 2, 3... for hierarchy
    min_salary DECIMAL(12, 2),
    max_salary DECIMAL(12, 2),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(level_order)
);

CREATE INDEX idx_job_levels_order ON job_levels(level_order);
```

**Sample Data:**
```sql
INSERT INTO job_levels (name, code, level_order) VALUES
('Junior', 'L1', 1),
('Mid-Level', 'L2', 2),
('Senior', 'L3', 3),
('Lead', 'L4', 4),
('Principal', 'L5', 5),
('Director', 'L6', 6),
('VP', 'L7', 7),
('C-Level', 'L8', 8);
```

#### **Table: locations**
**Description:** Office locations

```sql
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    address TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_locations_country_city ON locations(country, city);
```

---

### 2.3 Core Hiring Requirements

#### **Table: requirements**
**Description:** Main hiring requirements table

```sql
-- Create ENUM types
CREATE TYPE requirement_type AS ENUM ('new_headcount', 'backfill', 'contractor', 'intern');
CREATE TYPE requirement_status AS ENUM ('draft', 'submitted', 'pending_approval', 'approved', 'rejected', 'on_hold', 'active', 'filled', 'cancelled');
CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contract', 'intern');
CREATE TYPE work_mode AS ENUM ('onsite', 'remote', 'hybrid');
CREATE TYPE priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_number VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated: REQ-2026-0001
    
    -- Basic Information
    position_title VARCHAR(200) NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    job_level_id UUID NOT NULL REFERENCES job_levels(id),
    location_id UUID NOT NULL REFERENCES locations(id),
    reporting_to_user_id UUID REFERENCES users(id),
    
    -- Requirement Details
    requirement_type requirement_type NOT NULL,
    employment_type employment_type NOT NULL,
    work_mode work_mode NOT NULL,
    number_of_positions INTEGER NOT NULL DEFAULT 1,
    priority priority NOT NULL DEFAULT 'medium',
    
    -- Job Details
    job_description TEXT NOT NULL,
    key_responsibilities TEXT,
    required_qualifications TEXT NOT NULL,
    preferred_qualifications TEXT,
    required_skills JSONB DEFAULT '[]', -- Array of skills
    
    -- Compensation
    min_salary DECIMAL(12, 2),
    max_salary DECIMAL(12, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    additional_compensation TEXT, -- Bonuses, equity, etc.
    
    -- Timeline & Urgency
    target_start_date DATE,
    expected_closure_date DATE,
    justification TEXT NOT NULL, -- Why is this hire needed?
    
    -- Status & Workflow
    status requirement_status NOT NULL DEFAULT 'draft',
    current_approval_stage_id UUID REFERENCES approval_stages(id),
    
    -- Assignment
    created_by UUID NOT NULL REFERENCES users(id),
    hiring_manager_id UUID NOT NULL REFERENCES users(id),
    assigned_recruiter_id UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    
    -- Dates & Timestamps
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    posted_at TIMESTAMP WITH TIME ZONE,
    filled_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Search
    search_vector tsvector,
    
    CONSTRAINT min_max_salary CHECK (min_salary IS NULL OR max_salary IS NULL OR min_salary <= max_salary),
    CONSTRAINT positive_positions CHECK (number_of_positions > 0)
);

-- Indexes
CREATE INDEX idx_requirements_status ON requirements(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_requirements_department ON requirements(department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_requirements_hiring_manager ON requirements(hiring_manager_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_requirements_recruiter ON requirements(assigned_recruiter_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_requirements_created_by ON requirements(created_by);
CREATE INDEX idx_requirements_number ON requirements(requirement_number);
CREATE INDEX idx_requirements_created_at ON requirements(created_at DESC);
CREATE INDEX idx_requirements_priority ON requirements(priority) WHERE status = 'active';

-- Full-text search index
CREATE INDEX idx_requirements_search ON requirements USING GIN(search_vector);

-- Trigger to update search_vector
CREATE OR REPLACE FUNCTION requirements_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.position_title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.job_description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.required_qualifications, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER requirements_search_vector_trigger
    BEFORE INSERT OR UPDATE ON requirements
    FOR EACH ROW EXECUTE FUNCTION requirements_search_vector_update();
```

#### **Table: requirement_history**
**Description:** Audit trail for requirement changes

```sql
CREATE TABLE requirement_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_by UUID NOT NULL REFERENCES users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    change_reason TEXT
);

CREATE INDEX idx_requirement_history_requirement ON requirement_history(requirement_id);
CREATE INDEX idx_requirement_history_changed_at ON requirement_history(changed_at DESC);
```

---

### 2.4 Approval Workflows

#### **Table: approval_workflows**
**Description:** Workflow templates for different requirement types

```sql
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    requirement_type requirement_type,
    department_id UUID REFERENCES departments(id), -- Department-specific workflows
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_approval_workflows_type ON approval_workflows(requirement_type);
CREATE INDEX idx_approval_workflows_department ON approval_workflows(department_id);
```

#### **Table: approval_stages**
**Description:** Stages in an approval workflow

```sql
CREATE TYPE stage_type AS ENUM ('sequential', 'parallel', 'any_one');

CREATE TABLE approval_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES approval_workflows(id) ON DELETE CASCADE,
    stage_name VARCHAR(200) NOT NULL,
    stage_order INTEGER NOT NULL,
    stage_type stage_type NOT NULL DEFAULT 'sequential',
    required_role_id UUID REFERENCES roles(id), -- e.g., 'approver' role
    specific_approver_id UUID REFERENCES users(id), -- Specific person (optional)
    approval_required BOOLEAN DEFAULT TRUE,
    sla_hours INTEGER, -- Time limit for this stage
    auto_approve_on_timeout BOOLEAN DEFAULT FALSE,
    escalate_to_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(workflow_id, stage_order)
);

CREATE INDEX idx_approval_stages_workflow ON approval_stages(workflow_id);
```

#### **Table: approvals**
**Description:** Individual approval records

```sql
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'skipped', 'timeout');

CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
    stage_id UUID NOT NULL REFERENCES approval_stages(id),
    approver_id UUID NOT NULL REFERENCES users(id),
    
    -- Status & Decision
    status approval_status NOT NULL DEFAULT 'pending',
    decision_date TIMESTAMP WITH TIME ZONE,
    comments TEXT,
    rejection_reason TEXT,
    
    -- Delegation
    delegated_to UUID REFERENCES users(id),
    delegated_at TIMESTAMP WITH TIME ZONE,
    delegation_reason TEXT,
    
    -- SLA Tracking
    due_date TIMESTAMP WITH TIME ZONE,
    reminder_sent_at TIMESTAMP WITH TIME ZONE,
    escalated_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_approvals_requirement ON approvals(requirement_id);
CREATE INDEX idx_approvals_approver ON approvals(approver_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_due_date ON approvals(due_date) WHERE status = 'pending';
```

#### **Table: approval_history**
**Description:** Complete history of approval actions

```sql
CREATE TABLE approval_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_id UUID NOT NULL REFERENCES approvals(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'approved', 'rejected', 'delegated', 'reminded'
    performed_by UUID NOT NULL REFERENCES users(id),
    comments TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_approval_history_approval ON approval_history(approval_id);
CREATE INDEX idx_approval_history_created_at ON approval_history(created_at DESC);
```

---

### 2.5 Job Postings

#### **Table: job_postings**
**Description:** External job postings

```sql
CREATE TYPE posting_status AS ENUM ('draft', 'active', 'paused', 'closed', 'filled');
CREATE TYPE posting_channel AS ENUM ('internal', 'company_website', 'linkedin', 'indeed', 'glassdoor', 'other');

CREATE TABLE job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
    
    -- Posting Details
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    posting_channel posting_channel NOT NULL,
    external_url TEXT,
    external_posting_id VARCHAR(200), -- ID from external platform
    
    -- Status & Dates
    status posting_status NOT NULL DEFAULT 'draft',
    posted_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    
    -- Analytics
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    
    -- Audit
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_job_postings_requirement ON job_postings(requirement_id);
CREATE INDEX idx_job_postings_status ON job_postings(status);
CREATE INDEX idx_job_postings_channel ON job_postings(posting_channel);
```

---

### 2.6 Candidate Management

#### **Table: candidate_sources**
**Description:** How candidates are sourced

```sql
CREATE TABLE candidate_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO candidate_sources (name) VALUES
('Referral'), ('LinkedIn'), ('Indeed'), ('Glassdoor'),
('Company Website'), ('Recruiter'), ('Direct Application'), ('Other');
```

#### **Table: candidates**
**Description:** Candidate information

```sql
CREATE TYPE candidate_status AS ENUM (
    'new', 'screening', 'interviewing', 'offered', 
    'accepted', 'rejected', 'withdrawn', 'hired'
);

CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(200),
    current_company VARCHAR(200),
    current_title VARCHAR(200),
    linkedin_url TEXT,
    portfolio_url TEXT,
    
    -- Professional Details
    total_experience_years DECIMAL(4, 2),
    current_salary DECIMAL(12, 2),
    expected_salary DECIMAL(12, 2),
    notice_period_days INTEGER,
    
    -- Source
    source_id UUID REFERENCES candidate_sources(id),
    referred_by_user_id UUID REFERENCES users(id),
    
    -- Status
    overall_status candidate_status DEFAULT 'new',
    
    -- Documents
    resume_url TEXT,
    cover_letter_url TEXT,
    
    -- Notes & Tags
    notes TEXT,
    tags JSONB DEFAULT '[]',
    skills JSONB DEFAULT '[]',
    
    -- Audit
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Search
    search_vector tsvector
);

CREATE INDEX idx_candidates_email ON candidates(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_candidates_status ON candidates(overall_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_candidates_source ON candidates(source_id);
CREATE INDEX idx_candidates_search ON candidates USING GIN(search_vector);

-- Trigger for search vector
CREATE OR REPLACE FUNCTION candidates_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.first_name || ' ' || NEW.last_name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.email, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.current_company, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.current_title, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER candidates_search_vector_trigger
    BEFORE INSERT OR UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION candidates_search_vector_update();
```

#### **Table: candidate_applications**
**Description:** Links candidates to specific requirements (a candidate can apply to multiple positions)

```sql
CREATE TABLE candidate_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
    status candidate_status DEFAULT 'new',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_stage VARCHAR(100), -- e.g., "Technical Interview Round 2"
    rejection_reason TEXT,
    rejected_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    
    UNIQUE(candidate_id, requirement_id)
);

CREATE INDEX idx_candidate_applications_candidate ON candidate_applications(candidate_id);
CREATE INDEX idx_candidate_applications_requirement ON candidate_applications(requirement_id);
CREATE INDEX idx_candidate_applications_status ON candidate_applications(status);
```

---

### 2.7 Interview Management

#### **Table: interview_rounds**
**Description:** Interview round definitions

```sql
CREATE TABLE interview_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    round_order INTEGER NOT NULL,
    typical_duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO interview_rounds (name, round_order, typical_duration_minutes) VALUES
('Phone Screening', 1, 30),
('Technical Interview - Round 1', 2, 60),
('Technical Interview - Round 2', 3, 60),
('Hiring Manager Interview', 4, 45),
('Behavioral Interview', 5, 45),
('Final Round / Leadership', 6, 60);
```

#### **Table: interviews**
**Description:** Scheduled interviews

```sql
CREATE TYPE interview_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE interview_mode AS ENUM ('in_person', 'video_call', 'phone_call');

CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES candidate_applications(id) ON DELETE CASCADE,
    round_id UUID REFERENCES interview_rounds(id),
    
    -- Scheduling
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    end_time TIMESTAMP WITH TIME ZONE,
    
    -- Mode & Location
    interview_mode interview_mode NOT NULL,
    location VARCHAR(200), -- Office or address
    meeting_link TEXT, -- Video call link
    meeting_instructions TEXT,
    
    -- Status
    status interview_status NOT NULL DEFAULT 'scheduled',
    
    -- Reminders
    reminder_sent_at TIMESTAMP WITH TIME ZONE,
    reminder_sent_to JSONB DEFAULT '[]', -- Array of user IDs
    
    -- Notes
    interviewer_notes TEXT,
    
    -- Audit
    scheduled_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT
);

CREATE INDEX idx_interviews_application ON interviews(application_id);
CREATE INDEX idx_interviews_scheduled_at ON interviews(scheduled_at);
CREATE INDEX idx_interviews_status ON interviews(status);
```

#### **Table: interview_panel_members**
**Description:** Interviewers for each interview

```sql
CREATE TABLE interview_panel_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    interviewer_id UUID NOT NULL REFERENCES users(id),
    is_primary BOOLEAN DEFAULT FALSE, -- Primary interviewer
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    declined_at TIMESTAMP WITH TIME ZONE,
    decline_reason TEXT,
    
    UNIQUE(interview_id, interviewer_id)
);

CREATE INDEX idx_interview_panel_interview ON interview_panel_members(interview_id);
CREATE INDEX idx_interview_panel_interviewer ON interview_panel_members(interviewer_id);
```

#### **Table: interview_feedback**
**Description:** Feedback from interviewers

```sql
CREATE TYPE interview_recommendation AS ENUM ('strong_hire', 'hire', 'neutral', 'no_hire', 'strong_no_hire');

CREATE TABLE interview_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    panel_member_id UUID NOT NULL REFERENCES interview_panel_members(id),
    interviewer_id UUID NOT NULL REFERENCES users(id),
    
    -- Ratings (1-5 scale)
    technical_skills_rating INTEGER CHECK (technical_skills_rating BETWEEN 1 AND 5),
    communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
    problem_solving_rating INTEGER CHECK (problem_solving_rating BETWEEN 1 AND 5),
    culture_fit_rating INTEGER CHECK (culture_fit_rating BETWEEN 1 AND 5),
    overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
    
    -- Detailed Feedback
    strengths TEXT,
    weaknesses TEXT,
    detailed_feedback TEXT NOT NULL,
    
    -- Recommendation
    recommendation interview_recommendation NOT NULL,
    
    -- Timestamps
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(interview_id, interviewer_id)
);

CREATE INDEX idx_interview_feedback_interview ON interview_feedback(interview_id);
CREATE INDEX idx_interview_feedback_interviewer ON interview_feedback(interviewer_id);
```

---

### 2.8 Offer Management

#### **Table: offers**
**Description:** Job offers

```sql
CREATE TYPE offer_status AS ENUM ('draft', 'pending_approval', 'approved', 'extended', 'accepted', 'rejected', 'withdrawn', 'expired');

CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES candidate_applications(id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES requirements(id),
    candidate_id UUID NOT NULL REFERENCES candidates(id),
    
    -- Offer Details
    position_title VARCHAR(200) NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    job_level_id UUID NOT NULL REFERENCES job_levels(id),
    location_id UUID NOT NULL REFERENCES locations(id),
    employment_type employment_type NOT NULL,
    start_date DATE,
    
    -- Compensation
    base_salary DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    bonus_amount DECIMAL(12, 2),
    equity_amount DECIMAL(12, 2),
    other_benefits TEXT,
    
    -- Offer Letter
    offer_letter_url TEXT,
    offer_letter_template TEXT,
    
    -- Status & Workflow
    status offer_status NOT NULL DEFAULT 'draft',
    
    -- Key Dates
    extended_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Audit
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_offers_application ON offers(application_id);
CREATE INDEX idx_offers_requirement ON offers(requirement_id);
CREATE INDEX idx_offers_candidate ON offers(candidate_id);
CREATE INDEX idx_offers_status ON offers(status);
```

#### **Table: offer_approvals**
**Description:** Approval chain for offers (similar to requirement approvals)

```sql
CREATE TABLE offer_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES users(id),
    status approval_status NOT NULL DEFAULT 'pending',
    decision_date TIMESTAMP WITH TIME ZONE,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_offer_approvals_offer ON offer_approvals(offer_id);
CREATE INDEX idx_offer_approvals_approver ON offer_approvals(approver_id);
```

---

### 2.9 System & Audit

#### **Table: audit_logs**
**Description:** Complete audit trail of all system actions

```sql
CREATE TYPE action_type AS ENUM ('create', 'read', 'update', 'delete', 'login', 'logout', 'approve', 'reject');

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Action Details
    action action_type NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- 'requirement', 'candidate', etc.
    resource_id UUID NOT NULL,
    
    -- User Context
    user_id UUID REFERENCES users(id),
    username VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    
    -- Change Details
    old_values JSONB,
    new_values JSONB,
    description TEXT,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

#### **Table: notifications**
**Description:** User notifications

```sql
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');
CREATE TYPE notification_channel AS ENUM ('in_app', 'email', 'sms', 'push');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Content
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL DEFAULT 'info',
    
    -- Related Resource
    resource_type VARCHAR(50), -- 'requirement', 'approval', etc.
    resource_id UUID,
    action_url TEXT, -- Deep link to resource
    
    -- Delivery
    channels notification_channel[] DEFAULT ARRAY['in_app']::notification_channel[],
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Email specific
    email_sent_at TIMESTAMP WITH TIME ZONE,
    email_delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE NOT is_read;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

#### **Table: file_attachments**
**Description:** File metadata and storage references

```sql
CREATE TYPE file_category AS ENUM ('resume', 'cover_letter', 'job_description', 'offer_letter', 'other');

CREATE TABLE file_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- File Details
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL, -- Size in bytes
    mime_type VARCHAR(100) NOT NULL,
    category file_category NOT NULL,
    
    -- Related Resource
    resource_type VARCHAR(50), -- 'requirement', 'candidate', etc.
    resource_id UUID,
    
    -- Storage
    storage_provider VARCHAR(50) DEFAULT 's3', -- 's3', 'local', etc.
    bucket_name VARCHAR(200),
    object_key TEXT,
    
    -- Security
    is_public BOOLEAN DEFAULT FALSE,
    encryption_key VARCHAR(255),
    
    -- Metadata
    uploaded_by UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_file_attachments_resource ON file_attachments(resource_type, resource_id);
CREATE INDEX idx_file_attachments_uploaded_by ON file_attachments(uploaded_by);
```

#### **Table: system_settings**
**Description:** Application configuration

```sql
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    value_type VARCHAR(20) NOT NULL DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Can be accessed without authentication
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO system_settings (key, value, value_type, description) VALUES
('app.name', 'Hiring Hare', 'string', 'Application name'),
('app.timezone', 'UTC', 'string', 'Default timezone'),
('requirement.auto_number_prefix', 'REQ', 'string', 'Prefix for requirement numbers'),
('email.from_address', 'noreply@hiringhare.com', 'string', 'From email address'),
('approval.sla_default_hours', '72', 'number', 'Default SLA for approvals in hours'),
('password.min_length', '8', 'number', 'Minimum password length');
```

---

## 3. Relationships & Constraints

### 3.1 Key Relationships

```
users ──────┬─── requirements (created_by, hiring_manager_id, assigned_recruiter_id)
            ├─── departments (head_user_id)
            ├─── approvals (approver_id)
            ├─── candidates (created_by, referred_by_user_id)
            └─── interviews (scheduled_by)

departments ─── requirements (department_id)
            └─── offers (department_id)

requirements ──┬─── approvals (requirement_id)
               ├─── job_postings (requirement_id)
               ├─── candidate_applications (requirement_id)
               └─── offers (requirement_id)

candidates ────┬─── candidate_applications (candidate_id)
               └─── offers (candidate_id)

candidate_applications ──┬─── interviews (application_id)
                         └─── offers (application_id)

interviews ────┬─── interview_panel_members (interview_id)
               └─── interview_feedback (interview_id)

approval_workflows ─── approval_stages (workflow_id)
approval_stages ─── approvals (stage_id)
```

### 3.2 Referential Integrity

**ON DELETE Behaviors:**
- **CASCADE**: Delete child records when parent is deleted
  - `candidate_applications` → `interviews`
  - `requirements` → `approvals`
  - `users` → `user_roles`
  
- **RESTRICT** (default): Prevent deletion if child records exist
  - `departments` → `requirements`
  - `job_levels` → `requirements`
  
- **SET NULL**: Set foreign key to NULL when parent is deleted
  - `users(manager_id)` → `users`

---

## 4. Indexes & Performance

### 4.1 Index Strategy

**Primary Indexes:**
- All primary keys (UUID) - automatic B-tree index
- All foreign keys - explicit B-tree indexes
- Unique constraints - automatic unique index

**Query Optimization Indexes:**
- Status columns with WHERE clauses for non-deleted records
- Date/timestamp columns for sorting and filtering
- Composite indexes for common filter combinations

**Full-Text Search:**
- `requirements.search_vector` - GIN index
- `candidates.search_vector` - GIN index

**JSONB Indexes:**
```sql
-- For querying skills/tags
CREATE INDEX idx_requirements_skills ON requirements USING GIN(required_skills);
CREATE INDEX idx_candidates_tags ON candidates USING GIN(tags);
```

### 4.2 Performance Considerations

**Connection Pooling:**
- Min pool size: 10
- Max pool size: 50
- Connection timeout: 30s

**Query Optimization:**
- Use prepared statements
- Avoid N+1 queries (use eager loading)
- Paginate large result sets
- Use SELECT specific columns, not SELECT *

**Monitoring:**
- Enable `pg_stat_statements` for query performance
- Monitor slow queries (> 500ms)
- Track index usage with `pg_stat_user_indexes`

---

## 5. Migrations Strategy

### 5.1 Alembic Setup

**Configuration:**
```python
# alembic.ini
[alembic]
script_location = migrations
file_template = %%(year)d%%(month).2d%%(day).2d_%%(hour).2d%%(minute).2d_%%(slug)s
```

**Migration Workflow:**
```bash
# Create new migration
alembic revision --autogenerate -m "Create requirements table"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Show current version
alembic current

# Show migration history
alembic history
```

### 5.2 Migration Best Practices

1. **Never modify applied migrations** - always create new ones
2. **Test migrations** on staging before production
3. **Include rollback logic** in down() function
4. **Backup database** before major migrations
5. **Small, focused migrations** - one logical change per migration
6. **Document breaking changes** in migration files

---

## 6. Sample Queries

### 6.1 Common Queries

#### **Get user's pending approvals:**
```sql
SELECT 
    r.requirement_number,
    r.position_title,
    r.department_id,
    a.due_date,
    a.created_at
FROM approvals a
JOIN requirements r ON a.requirement_id = r.id
WHERE a.approver_id = :user_id
  AND a.status = 'pending'
  AND r.deleted_at IS NULL
ORDER BY a.due_date ASC, a.created_at ASC;
```

#### **Get hiring manager's requirements with status:**
```sql
SELECT 
    r.requirement_number,
    r.position_title,
    r.status,
    r.created_at,
    d.name as department_name,
    u.first_name || ' ' || u.last_name as recruiter_name,
    COUNT(DISTINCT ca.id) as candidate_count
FROM requirements r
LEFT JOIN departments d ON r.department_id = d.id
LEFT JOIN users u ON r.assigned_recruiter_id = u.id
LEFT JOIN candidate_applications ca ON r.id = ca.requirement_id
WHERE r.hiring_manager_id = :user_id
  AND r.deleted_at IS NULL
GROUP BY r.id, d.name, u.first_name, u.last_name
ORDER BY r.created_at DESC;
```

#### **Get candidate pipeline for a requirement:**
```sql
SELECT 
    c.id,
    c.first_name,
    c.last_name,
    c.email,
    ca.status,
    ca.current_stage,
    COUNT(i.id) as interview_count,
    MAX(i.scheduled_at) as last_interview_date
FROM candidate_applications ca
JOIN candidates c ON ca.candidate_id = c.id
LEFT JOIN interviews i ON ca.id = i.application_id
WHERE ca.requirement_id = :requirement_id
  AND c.deleted_at IS NULL
GROUP BY c.id, ca.status, ca.current_stage
ORDER BY ca.applied_at DESC;
```

#### **Full-text search for requirements:**
```sql
SELECT 
    requirement_number,
    position_title,
    department_id,
    status,
    ts_rank(search_vector, plainto_tsquery('english', :query)) as rank
FROM requirements
WHERE search_vector @@ plainto_tsquery('english', :query)
  AND deleted_at IS NULL
ORDER BY rank DESC, created_at DESC
LIMIT 20;
```

#### **Dashboard statistics:**
```sql
-- Requirements by status
SELECT status, COUNT(*) as count
FROM requirements
WHERE deleted_at IS NULL
  AND hiring_manager_id = :user_id
GROUP BY status;

-- Overdue approvals
SELECT COUNT(*)
FROM approvals
WHERE status = 'pending'
  AND due_date < NOW()
  AND requirement_id IN (
      SELECT id FROM requirements WHERE deleted_at IS NULL
  );

-- Candidates by stage
SELECT current_stage, COUNT(*) as count
FROM candidate_applications
WHERE requirement_id = :requirement_id
  AND status NOT IN ('rejected', 'withdrawn')
GROUP BY current_stage;
```

---

## 7. Data Seeding

### 7.1 Essential Seed Data

**For development environment:**
```sql
-- 1. Roles
-- (Already provided in schema)

-- 2. Departments
-- (Already provided in schema)

-- 3. Job Levels
-- (Already provided in schema)

-- 4. Locations
INSERT INTO locations (name, city, state, country, timezone) VALUES
('HQ - San Francisco', 'San Francisco', 'CA', 'USA', 'America/Los_Angeles'),
('Austin Office', 'Austin', 'TX', 'USA', 'America/Chicago'),
('New York Office', 'New York', 'NY', 'USA', 'America/New_York'),
('Remote', 'Remote', NULL, 'USA', 'UTC');

-- 5. Default admin user (password: Admin@123)
INSERT INTO users (email, username, first_name, last_name, password_hash, is_superuser, email_verified)
VALUES (
    'admin@hiringhare.com',
    'admin',
    'System',
    'Administrator',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5v2RZ9i9xZU3m', -- Admin@123
    TRUE,
    TRUE
);

-- 6. Candidate sources
-- (Already provided in schema)

-- 7. Interview rounds
-- (Already provided in schema)

-- 8. Default approval workflow
INSERT INTO approval_workflows (name, description, is_default, is_active) VALUES
('Standard Approval', 'Default approval workflow for all requirements', TRUE, TRUE);

-- Get the workflow ID and create stages
-- Stage 1: Hiring Manager
INSERT INTO approval_stages (workflow_id, stage_name, stage_order, stage_type, sla_hours) VALUES
((SELECT id FROM approval_workflows WHERE is_default = TRUE), 'Hiring Manager Review', 1, 'sequential', 24);

-- Stage 2: Department Head
INSERT INTO approval_stages (workflow_id, stage_name, stage_order, stage_type, sla_hours) VALUES
((SELECT id FROM approval_workflows WHERE is_default = TRUE), 'Department Head Approval', 2, 'sequential', 48);

-- Stage 3: Finance
INSERT INTO approval_stages (workflow_id, stage_name, stage_order, stage_type, sla_hours) VALUES
((SELECT id FROM approval_workflows WHERE is_default = TRUE), 'Finance Approval', 3, 'sequential', 72);
```

---

## Appendix

### A. PostgreSQL Version Requirements
- **Minimum:** PostgreSQL 12
- **Recommended:** PostgreSQL 15+
- **Features used:**
  - `gen_random_uuid()` (requires `pgcrypto` extension in PG < 13)
  - JSONB operations
  - Full-text search (tsvector)
  - ENUM types

### B. Database Size Estimates

**For 1000 requirements/year:**
- `requirements`: ~500 KB
- `candidates`: ~5 MB (5000 candidates)
- `interviews`: ~2 MB
- `audit_logs`: ~50 MB
- `file_attachments` (metadata only): ~1 MB
- **Total:** ~60-80 MB/year (excluding file storage)

**For 10,000 requirements/year:**
- Estimated: 600-800 MB/year (excluding file storage)

### C. Backup Strategy

**Daily Backups:**
```bash
pg_dump -Fc hiring_hare_db > backup_$(date +%Y%m%d).dump
```

**Point-in-Time Recovery:**
- Enable WAL archiving
- Retention: 30 days

### D. Schema Evolution

**Version History:**
- v1.0 (Jan 2026): Initial schema design
- Future versions will be tracked in migration files

---

**Document Control**
- Version: 1.0
- Last Updated: January 3, 2026
- Next Review: After Phase 1 implementation
- Owner: Technical Lead / Database Architect

