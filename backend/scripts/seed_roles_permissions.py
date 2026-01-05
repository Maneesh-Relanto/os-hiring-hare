"""
Seed roles and permissions for RBAC
"""
import psycopg2
from uuid import uuid4
from datetime import datetime

# Database connection parameters
DB_PARAMS = {
    'dbname': 'hiring_hare',
    'user': 'hiring_hare_user',
    'password': 'HiringHare2024',
    'host': 'localhost',
    'port': '5432'
}

# Define roles with their descriptions
ROLES = [
    {
        'name': 'super_admin',
        'display_name': 'Super Administrator',
        'description': 'Full system access with all permissions',
        'is_system_role': True
    },
    {
        'name': 'admin',
        'display_name': 'Administrator',
        'description': 'Administrative access to manage system and users',
        'is_system_role': True
    },
    {
        'name': 'hiring_manager',
        'display_name': 'Hiring Manager',
        'description': 'Creates and manages job requirements for their department',
        'is_system_role': True
    },
    {
        'name': 'approver',
        'display_name': 'Approver',
        'description': 'Approves or rejects job requirements',
        'is_system_role': True
    },
    {
        'name': 'recruiter',
        'display_name': 'Recruiter',
        'description': 'Manages candidates and recruitment process',
        'is_system_role': True
    },
    {
        'name': 'interviewer',
        'display_name': 'Interviewer',
        'description': 'Conducts interviews and provides feedback',
        'is_system_role': True
    },
    {
        'name': 'viewer',
        'display_name': 'Viewer',
        'description': 'Read-only access to view requirements and candidates',
        'is_system_role': True
    }
]

# Define permissions (resource.action format)
PERMISSIONS = [
    # Requirement permissions
    {'name': 'requirement.create', 'resource': 'requirement', 'action': 'create', 'description': 'Create new job requirements'},
    {'name': 'requirement.read', 'resource': 'requirement', 'action': 'read', 'description': 'View job requirements'},
    {'name': 'requirement.update', 'resource': 'requirement', 'action': 'update', 'description': 'Update job requirements'},
    {'name': 'requirement.delete', 'resource': 'requirement', 'action': 'delete', 'description': 'Delete job requirements'},
    {'name': 'requirement.approve', 'resource': 'requirement', 'action': 'approve', 'description': 'Approve job requirements'},
    {'name': 'requirement.assign', 'resource': 'requirement', 'action': 'assign', 'description': 'Assign requirements to recruiters'},
    
    # Candidate permissions
    {'name': 'candidate.create', 'resource': 'candidate', 'action': 'create', 'description': 'Add new candidates'},
    {'name': 'candidate.read', 'resource': 'candidate', 'action': 'read', 'description': 'View candidate information'},
    {'name': 'candidate.update', 'resource': 'candidate', 'action': 'update', 'description': 'Update candidate information'},
    {'name': 'candidate.delete', 'resource': 'candidate', 'action': 'delete', 'description': 'Delete candidates'},
    
    # Interview permissions
    {'name': 'interview.create', 'resource': 'interview', 'action': 'create', 'description': 'Schedule interviews'},
    {'name': 'interview.read', 'resource': 'interview', 'action': 'read', 'description': 'View interview details'},
    {'name': 'interview.update', 'resource': 'interview', 'action': 'update', 'description': 'Update interview details'},
    {'name': 'interview.delete', 'resource': 'interview', 'action': 'delete', 'description': 'Delete interviews'},
    {'name': 'interview.feedback', 'resource': 'interview', 'action': 'feedback', 'description': 'Provide interview feedback'},
    
    # Job Posting permissions
    {'name': 'job_posting.create', 'resource': 'job_posting', 'action': 'create', 'description': 'Create job postings'},
    {'name': 'job_posting.read', 'resource': 'job_posting', 'action': 'read', 'description': 'View job postings'},
    {'name': 'job_posting.update', 'resource': 'job_posting', 'action': 'update', 'description': 'Update job postings'},
    {'name': 'job_posting.delete', 'resource': 'job_posting', 'action': 'delete', 'description': 'Delete job postings'},
    {'name': 'job_posting.publish', 'resource': 'job_posting', 'action': 'publish', 'description': 'Publish job postings'},
    
    # User management permissions
    {'name': 'user.create', 'resource': 'user', 'action': 'create', 'description': 'Create new users'},
    {'name': 'user.read', 'resource': 'user', 'action': 'read', 'description': 'View user information'},
    {'name': 'user.update', 'resource': 'user', 'action': 'update', 'description': 'Update user information'},
    {'name': 'user.delete', 'resource': 'user', 'action': 'delete', 'description': 'Delete users'},
    {'name': 'user.assign_role', 'resource': 'user', 'action': 'assign_role', 'description': 'Assign roles to users'},
    
    # Report permissions
    {'name': 'report.read', 'resource': 'report', 'action': 'read', 'description': 'View reports and analytics'},
    {'name': 'report.export', 'resource': 'report', 'action': 'export', 'description': 'Export reports'},
    
    # Settings permissions
    {'name': 'settings.read', 'resource': 'settings', 'action': 'read', 'description': 'View system settings'},
    {'name': 'settings.update', 'resource': 'settings', 'action': 'update', 'description': 'Update system settings'},
]

# Define role-permission mappings
ROLE_PERMISSIONS = {
    'super_admin': ['*'],  # All permissions (handled specially)
    
    'admin': [
        'requirement.*', 'candidate.*', 'interview.*', 'job_posting.*',
        'user.create', 'user.read', 'user.update', 'user.delete', 'user.assign_role',
        'report.read', 'report.export', 'settings.read', 'settings.update'
    ],
    
    'hiring_manager': [
        'requirement.create', 'requirement.read', 'requirement.update', 'requirement.delete', 'requirement.assign',
        'candidate.read', 'interview.read', 'job_posting.read',
        'report.read'
    ],
    
    'approver': [
        'requirement.read', 'requirement.approve',
        'candidate.read', 'interview.read',
        'report.read'
    ],
    
    'recruiter': [
        'requirement.read', 'requirement.update',
        'candidate.create', 'candidate.read', 'candidate.update', 'candidate.delete',
        'interview.create', 'interview.read', 'interview.update', 'interview.delete',
        'job_posting.create', 'job_posting.read', 'job_posting.update', 'job_posting.delete', 'job_posting.publish',
        'report.read'
    ],
    
    'interviewer': [
        'requirement.read',
        'candidate.read',
        'interview.read', 'interview.feedback',
        'report.read'
    ],
    
    'viewer': [
        'requirement.read',
        'candidate.read',
        'interview.read',
        'job_posting.read',
        'report.read'
    ]
}


def expand_permission_pattern(pattern, all_permissions):
    """Expand wildcard permission patterns like 'requirement.*' to actual permissions"""
    if pattern == '*':
        return [p['name'] for p in all_permissions]
    
    if pattern.endswith('.*'):
        resource = pattern[:-2]
        return [p['name'] for p in all_permissions if p['resource'] == resource]
    
    return [pattern]


def seed_roles_and_permissions():
    """Seed roles and permissions"""
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()
    
    try:
        # Check if roles already exist
        cur.execute("SELECT COUNT(*) FROM roles")
        count = cur.fetchone()[0]
        
        if count > 0:
            print(f"Found {count} existing roles. Skipping seed...")
            return
        
        print("Seeding roles and permissions...\n")
        
        # Insert permissions first
        permission_ids = {}
        for perm in PERMISSIONS:
            perm_id = str(uuid4())
            permission_ids[perm['name']] = perm_id
            
            cur.execute(
                """
                INSERT INTO permissions (id, name, resource, action, description, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (perm_id, perm['name'], perm['resource'], perm['action'], perm['description'], datetime.now(), datetime.now())
            )
        
        print(f"✓ Seeded {len(PERMISSIONS)} permissions")
        
        # Insert roles
        role_ids = {}
        for role in ROLES:
            role_id = str(uuid4())
            role_ids[role['name']] = role_id
            
            cur.execute(
                """
                INSERT INTO roles (id, name, display_name, description, is_system_role, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (role_id, role['name'], role['display_name'], role['description'], role['is_system_role'], datetime.now(), datetime.now())
            )
        
        print(f"✓ Seeded {len(ROLES)} roles")
        
        # Assign permissions to roles
        total_assignments = 0
        for role_name, permission_patterns in ROLE_PERMISSIONS.items():
            role_id = role_ids[role_name]
            
            # Expand wildcard patterns
            assigned_permissions = []
            for pattern in permission_patterns:
                expanded = expand_permission_pattern(pattern, PERMISSIONS)
                assigned_permissions.extend(expanded)
            
            # Remove duplicates
            assigned_permissions = list(set(assigned_permissions))
            
            # Insert role-permission associations
            for perm_name in assigned_permissions:
                if perm_name in permission_ids:
                    assoc_id = str(uuid4())
                    cur.execute(
                        """
                        INSERT INTO role_permissions (id, role_id, permission_id)
                        VALUES (%s, %s, %s)
                        """,
                        (assoc_id, role_id, permission_ids[perm_name])
                    )
                    total_assignments += 1
            
            print(f"  ✓ {role_name}: {len(assigned_permissions)} permissions")
        
        print(f"\n✓ Created {total_assignments} role-permission assignments")
        
        conn.commit()
        print("\n✅ Roles and permissions seeding complete!")
        
    except Exception as e:
        print(f"❌ Error seeding roles and permissions: {e}")
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    print("=" * 60)
    print("Starting RBAC seeding...")
    print("=" * 60 + "\n")
    seed_roles_and_permissions()
