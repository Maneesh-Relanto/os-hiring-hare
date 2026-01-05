"""
Assign roles to existing users and create test users with different roles
"""
import psycopg2
from uuid import uuid4
from datetime import datetime
from passlib.context import CryptContext

# Database connection parameters
DB_PARAMS = {
    'dbname': 'hiring_hare',
    'user': 'hiring_hare_user',
    'password': 'HiringHare2024',
    'host': 'localhost',
    'port': '5432'
}

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Test users with roles
TEST_USERS = [
    {
        'email': 'admin@hiringhare.com',
        'roles': ['admin'],  # Already exists, just assign role
        'update_only': True
    },
    {
        'email': 'manager@hiringhare.com',
        'username': 'hiring_manager',
        'password': 'Manager@2024',
        'first_name': 'John',
        'last_name': 'Manager',
        'job_title': 'Engineering Manager',
        'roles': ['hiring_manager']
    },
    {
        'email': 'approver@hiringhare.com',
        'username': 'approver',
        'password': 'Approver@2024',
        'first_name': 'Sarah',
        'last_name': 'Approver',
        'job_title': 'Director of Engineering',
        'roles': ['approver', 'hiring_manager']  # Can have multiple roles
    },
    {
        'email': 'recruiter@hiringhare.com',
        'username': 'recruiter',
        'password': 'Recruiter@2024',
        'first_name': 'Mike',
        'last_name': 'Recruiter',
        'job_title': 'Senior Recruiter',
        'roles': ['recruiter']
    },
    {
        'email': 'interviewer@hiringhare.com',
        'username': 'interviewer',
        'password': 'Interviewer@2024',
        'first_name': 'Lisa',
        'last_name': 'Interviewer',
        'job_title': 'Senior Engineer',
        'roles': ['interviewer']
    },
    {
        'email': 'viewer@hiringhare.com',
        'username': 'viewer',
        'password': 'Viewer@2024',
        'first_name': 'Tom',
        'last_name': 'Viewer',
        'job_title': 'Analyst',
        'roles': ['viewer']
    }
]


def get_password_hash(password: str) -> str:
    """Hash password"""
    password_bytes = password.encode('utf-8')[:72]  # bcrypt max length
    return pwd_context.hash(password_bytes)


def assign_user_roles():
    """Assign roles to users"""
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()
    
    try:
        print("Assigning roles to users...\n")
        
        # Get all role IDs
        cur.execute("SELECT id, name FROM roles")
        role_map = {name: role_id for role_id, name in cur.fetchall()}
        
        # Get engineering department ID for new users
        cur.execute("SELECT id FROM departments WHERE code = 'ENG' LIMIT 1")
        dept_result = cur.fetchone()
        dept_id = dept_result[0] if dept_result else None
        
        for user_data in TEST_USERS:
            email = user_data['email']
            
            # Check if user exists
            cur.execute("SELECT id, first_name, last_name FROM users WHERE email = %s", (email,))
            existing_user = cur.fetchone()
            
            if existing_user:
                user_id = existing_user[0]
                user_name = f"{existing_user[1]} {existing_user[2]}"
                print(f"Found existing user: {user_name} ({email})")
            else:
                # Create new user
                if user_data.get('update_only'):
                    print(f"⚠️  User {email} not found and update_only is True, skipping...")
                    continue
                
                user_id = str(uuid4())
                password_hash = get_password_hash(user_data['password'])
                
                cur.execute(
                    """
                    INSERT INTO users (
                        id, email, username, password_hash, first_name, last_name,
                        job_title, department_id, is_active, is_superuser, 
                        email_verified, phone_verified, created_at, updated_at, preferences
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        user_id, email, user_data['username'], password_hash,
                        user_data['first_name'], user_data['last_name'],
                        user_data['job_title'], dept_id,
                        True, False, True, False,  # is_active, is_superuser, email_verified, phone_verified
                        datetime.now(), datetime.now(), '{}'
                    )
                )
                
                user_name = f"{user_data['first_name']} {user_data['last_name']}"
                print(f"✓ Created user: {user_name} ({email})")
            
            # Clear existing role assignments for this user
            cur.execute("DELETE FROM user_roles WHERE user_id = %s", (user_id,))
            
            # Assign roles
            assigned_roles = []
            for role_name in user_data['roles']:
                if role_name in role_map:
                    assoc_id = str(uuid4())
                    cur.execute(
                        """
                        INSERT INTO user_roles (id, user_id, role_id, assigned_at)
                        VALUES (%s, %s, %s, %s)
                        """,
                        (assoc_id, user_id, role_map[role_name], datetime.now())
                    )
                    assigned_roles.append(role_name)
            
            print(f"  → Assigned roles: {', '.join(assigned_roles)}\n")
        
        conn.commit()
        print("✅ User role assignment complete!")
        print("\n" + "=" * 60)
        print("Test Users Summary:")
        print("=" * 60)
        for user in TEST_USERS:
            if not user.get('update_only'):
                print(f"\n📧 {user['email']}")
                print(f"   Password: {user['password']}")
                print(f"   Roles: {', '.join(user['roles'])}")
            else:
                print(f"\n📧 {user['email']}")
                print(f"   Password: Admin@2024")
                print(f"   Roles: {', '.join(user['roles'])}")
        print("\n" + "=" * 60)
        
    except Exception as e:
        print(f"❌ Error assigning roles: {e}")
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    print("=" * 60)
    print("Starting user role assignment...")
    print("=" * 60 + "\n")
    assign_user_roles()
