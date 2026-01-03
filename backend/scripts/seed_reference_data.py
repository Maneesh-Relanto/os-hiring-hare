"""
Seed script to populate reference data tables
"""
import asyncio
import sys
from pathlib import Path

# Add the project root to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import uuid4

from app.core.database import async_session_maker
from app.models.department import Department
from app.models.job_level import JobLevel
from app.models.location import Location


async def seed_reference_data():
    """Seed reference data for departments, job levels, and locations"""
    async with async_session_maker() as session:
        try:
            # Check if data already exists
            result = await session.execute(select(Department))
            existing_depts = result.scalars().all()
            
            if len(existing_depts) > 0:
                print(f"✓ Found {len(existing_depts)} existing departments. Skipping seed...")
                return
            
            print("Seeding reference data...")
            
            # Departments
            departments = [
                Department(id=uuid4(), name="Engineering", code="ENG", description="Software and technical teams"),
                Department(id=uuid4(), name="Product", code="PRD", description="Product management and strategy"),
                Department(id=uuid4(), name="Design", code="DSN", description="UX/UI and creative design"),
                Department(id=uuid4(), name="Marketing", code="MKT", description="Marketing and communications"),
                Department(id=uuid4(), name="Sales", code="SAL", description="Sales and business development"),
                Department(id=uuid4(), name="Operations", code="OPS", description="Operations and infrastructure"),
                Department(id=uuid4(), name="Human Resources", code="HR", description="HR and people operations"),
                Department(id=uuid4(), name="Finance", code="FIN", description="Finance and accounting"),
            ]
            
            # Job Levels
            job_levels = [
                JobLevel(id=uuid4(), name="Junior", code="L1", level_order=1, description="Entry-level position"),
                JobLevel(id=uuid4(), name="Mid-Level", code="L2", level_order=2, description="Intermediate level"),
                JobLevel(id=uuid4(), name="Senior", code="L3", level_order=3, description="Senior level position"),
                JobLevel(id=uuid4(), name="Lead", code="L4", level_order=4, description="Technical or team lead"),
                JobLevel(id=uuid4(), name="Manager", code="M1", level_order=5, description="People manager"),
                JobLevel(id=uuid4(), name="Senior Manager", code="M2", level_order=6, description="Senior manager"),
                JobLevel(id=uuid4(), name="Director", code="D1", level_order=7, description="Director level"),
                JobLevel(id=uuid4(), name="VP", code="VP", level_order=8, description="Vice President"),
            ]
            
            # Locations
            locations = [
                Location(id=uuid4(), name="San Francisco, CA", code="SF", country="USA", city="San Francisco", state="California"),
                Location(id=uuid4(), name="New York, NY", code="NYC", country="USA", city="New York", state="New York"),
                Location(id=uuid4(), name="Austin, TX", code="AUS", country="USA", city="Austin", state="Texas"),
                Location(id=uuid4(), name="Seattle, WA", code="SEA", country="USA", city="Seattle", state="Washington"),
                Location(id=uuid4(), name="Boston, MA", code="BOS", country="USA", city="Boston", state="Massachusetts"),
                Location(id=uuid4(), name="Remote - USA", code="REM-US", country="USA", is_remote=True),
                Location(id=uuid4(), name="Remote - Global", code="REM-GL", is_remote=True),
            ]
            
            # Add all records
            session.add_all(departments)
            session.add_all(job_levels)
            session.add_all(locations)
            
            await session.commit()
            
            print(f"✓ Seeded {len(departments)} departments")
            print(f"✓ Seeded {len(job_levels)} job levels")
            print(f"✓ Seeded {len(locations)} locations")
            print("\nReference data seeding complete!")
            
        except Exception as e:
            print(f"Error seeding data: {e}")
            await session.rollback()
            raise


if __name__ == "__main__":
    print("Starting reference data seeding...\n")
    asyncio.run(seed_reference_data())
