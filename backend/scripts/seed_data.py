"""
Seed reference data using SQL
"""
import psycopg2
from psycopg2 import sql
from uuid import uuid4

# Database connection parameters
DB_PARAMS = {
    'dbname': 'hiring_hare',
    'user': 'hiring_hare_user',
    'password': 'HiringHare2024',
    'host': 'localhost',
    'port': '5432'
}

def seed_data():
    """Seed reference data"""
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()
    
    try:
        # Check if data already exists
        cur.execute("SELECT COUNT(*) FROM departments")
        count = cur.fetchone()[0]
        
        if count > 0:
            print(f"Found {count} existing departments. Skipping seed...")
            return
        
        print("Seeding reference data...")
        
        # Insert departments
        departments = [
            (str(uuid4()), "Engineering", "ENG", "Software and technical teams", True),
            (str(uuid4()), "Product", "PRD", "Product management and strategy", True),
            (str(uuid4()), "Design", "DSN", "UX/UI and creative design", True),
            (str(uuid4()), "Marketing", "MKT", "Marketing and communications", True),
            (str(uuid4()), "Sales", "SAL", "Sales and business development", True),
            (str(uuid4()), "Operations", "OPS", "Operations and infrastructure", True),
            (str(uuid4()), "Human Resources", "HR", "HR and people operations", True),
            (str(uuid4()), "Finance", "FIN", "Finance and accounting", True),
        ]
        
        cur.executemany(
            "INSERT INTO departments (id, name, code, description, is_active, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, NOW(), NOW())",
            departments
        )
        print(f"✓ Seeded {len(departments)} departments")
        
        # Insert job levels
        job_levels = [
            (str(uuid4()), "Junior", "L1", 1, "Entry-level position", True),
            (str(uuid4()), "Mid-Level", "L2", 2, "Intermediate level", True),
            (str(uuid4()), "Senior", "L3", 3, "Senior level position", True),
            (str(uuid4()), "Lead", "L4", 4, "Technical or team lead", True),
            (str(uuid4()), "Manager", "M1", 5, "People manager", True),
            (str(uuid4()), "Senior Manager", "M2", 6, "Senior manager", True),
            (str(uuid4()), "Director", "D1", 7, "Director level", True),
            (str(uuid4()), "VP", "VP", 8, "Vice President", True),
        ]
        
        cur.executemany(
            "INSERT INTO job_levels (id, name, code, level_order, description, is_active, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())",
            job_levels
        )
        print(f"✓ Seeded {len(job_levels)} job levels")
        
        # Insert locations
        locations = [
            (str(uuid4()), "San Francisco, CA", "USA", "California", "San Francisco", "America/Los_Angeles", True),
            (str(uuid4()), "New York, NY", "USA", "New York", "New York", "America/New_York", True),
            (str(uuid4()), "Austin, TX", "USA", "Texas", "Austin", "America/Chicago", True),
            (str(uuid4()), "Seattle, WA", "USA", "Washington", "Seattle", "America/Los_Angeles", True),
            (str(uuid4()), "Boston, MA", "USA", "Massachusetts", "Boston", "America/New_York", True),
            (str(uuid4()), "Remote - USA", "USA", None, "Remote", "America/New_York", True),
            (str(uuid4()), "Remote - Global", "Global", None, "Remote", "UTC", True),
        ]
        
        cur.executemany(
            "INSERT INTO locations (id, name, country, state, city, timezone, is_active, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())",
            locations
        )
        print(f"✓ Seeded {len(locations)} locations")
        
        conn.commit()
        print("\n✓ Reference data seeding complete!")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    print("Starting reference data seeding...\n")
    seed_data()
