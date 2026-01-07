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
from app.models.organization import Department, JobLevel, Location


async def seed_reference_data():
    """Seed reference data for departments, job levels, and locations"""
    async with async_session_maker() as session:
        try:
            # Check if locations need expansion
            result = await session.execute(select(Location))
            existing_locs = result.scalars().all()
            
            # Check if data already exists
            result = await session.execute(select(Department))
            existing_depts = result.scalars().all()
            
            if len(existing_depts) > 0 and len(existing_locs) >= 50:
                print(f"✓ Found {len(existing_depts)} departments and {len(existing_locs)} locations. Skipping seed...")
                return
            
            if len(existing_locs) >= 50:
                print(f"✓ Found {len(existing_locs)} locations already seeded. Skipping...")
                return
            
            print(f"Adding {70 - len(existing_locs)} new locations (found {len(existing_locs)})...")
            
            # Get existing location names to avoid duplicates
            existing_names = {loc.name for loc in existing_locs}
            
            # Only add departments if they don't exist
            if len(existing_depts) == 0:
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
                session.add_all(departments)
                
                # Job Levels
                job_levels = [
                    JobLevel(id=uuid4(), name="Intern", code="INT", seniority_order=1),
                    JobLevel(id=uuid4(), name="Junior", code="JR", seniority_order=2),
                    JobLevel(id=uuid4(), name="Mid-Level", code="MID", seniority_order=3),
                    JobLevel(id=uuid4(), name="Senior", code="SR", seniority_order=4),
                    JobLevel(id=uuid4(), name="Lead", code="LEAD", seniority_order=5),
                    JobLevel(id=uuid4(), name="Staff", code="STAFF", seniority_order=6),
                    JobLevel(id=uuid4(), name="Principal", code="PRIN", seniority_order=7),
                    JobLevel(id=uuid4(), name="Manager", code="MGR", seniority_order=8),
                    JobLevel(id=uuid4(), name="Director", code="DIR", seniority_order=9),
                    JobLevel(id=uuid4(), name="VP", code="VP", seniority_order=10),
                    JobLevel(id=uuid4(), name="Executive", code="EXEC", seniority_order=11),
                ]
                session.add_all(job_levels)
            
            # Locations - Major global cities (expanded worldwide coverage)
            locations = [
                # India (Top Tech Hubs)
                Location(id=uuid4(), name="Bangalore", city="Bangalore", state="Karnataka", country="India", timezone="Asia/Kolkata"),
                Location(id=uuid4(), name="Mumbai", city="Mumbai", state="Maharashtra", country="India", timezone="Asia/Kolkata"),
                Location(id=uuid4(), name="Delhi NCR", city="New Delhi", state="Delhi", country="India", timezone="Asia/Kolkata"),
                Location(id=uuid4(), name="Hyderabad", city="Hyderabad", state="Telangana", country="India", timezone="Asia/Kolkata"),
                Location(id=uuid4(), name="Pune", city="Pune", state="Maharashtra", country="India", timezone="Asia/Kolkata"),
                Location(id=uuid4(), name="Chennai", city="Chennai", state="Tamil Nadu", country="India", timezone="Asia/Kolkata"),
                Location(id=uuid4(), name="Kolkata", city="Kolkata", state="West Bengal", country="India", timezone="Asia/Kolkata"),
                Location(id=uuid4(), name="Ahmedabad", city="Ahmedabad", state="Gujarat", country="India", timezone="Asia/Kolkata"),
                Location(id=uuid4(), name="Kochi", city="Kochi", state="Kerala", country="India", timezone="Asia/Kolkata"),
                
                # USA (Major Tech Cities)
                Location(id=uuid4(), name="San Francisco, CA", city="San Francisco", state="California", country="USA", timezone="America/Los_Angeles"),
                Location(id=uuid4(), name="New York, NY", city="New York", state="New York", country="USA", timezone="America/New_York"),
                Location(id=uuid4(), name="Austin, TX", city="Austin", state="Texas", country="USA", timezone="America/Chicago"),
                Location(id=uuid4(), name="Seattle, WA", city="Seattle", state="Washington", country="USA", timezone="America/Los_Angeles"),
                Location(id=uuid4(), name="Boston, MA", city="Boston", state="Massachusetts", country="USA", timezone="America/New_York"),
                Location(id=uuid4(), name="Chicago, IL", city="Chicago", state="Illinois", country="USA", timezone="America/Chicago"),
                Location(id=uuid4(), name="Los Angeles, CA", city="Los Angeles", state="California", country="USA", timezone="America/Los_Angeles"),
                Location(id=uuid4(), name="Denver, CO", city="Denver", state="Colorado", country="USA", timezone="America/Denver"),
                Location(id=uuid4(), name="Portland, OR", city="Portland", state="Oregon", country="USA", timezone="America/Los_Angeles"),
                Location(id=uuid4(), name="Atlanta, GA", city="Atlanta", state="Georgia", country="USA", timezone="America/New_York"),
                Location(id=uuid4(), name="Miami, FL", city="Miami", state="Florida", country="USA", timezone="America/New_York"),
                Location(id=uuid4(), name="Washington, DC", city="Washington", state="District of Columbia", country="USA", timezone="America/New_York"),
                
                # UK & Europe
                Location(id=uuid4(), name="London", city="London", state="England", country="UK", timezone="Europe/London"),
                Location(id=uuid4(), name="Manchester", city="Manchester", state="England", country="UK", timezone="Europe/London"),
                Location(id=uuid4(), name="Edinburgh", city="Edinburgh", state="Scotland", country="UK", timezone="Europe/London"),
                Location(id=uuid4(), name="Dublin", city="Dublin", state=None, country="Ireland", timezone="Europe/Dublin"),
                Location(id=uuid4(), name="Berlin", city="Berlin", state=None, country="Germany", timezone="Europe/Berlin"),
                Location(id=uuid4(), name="Munich", city="Munich", state=None, country="Germany", timezone="Europe/Berlin"),
                Location(id=uuid4(), name="Amsterdam", city="Amsterdam", state=None, country="Netherlands", timezone="Europe/Amsterdam"),
                Location(id=uuid4(), name="Paris", city="Paris", state=None, country="France", timezone="Europe/Paris"),
                Location(id=uuid4(), name="Barcelona", city="Barcelona", state=None, country="Spain", timezone="Europe/Madrid"),
                Location(id=uuid4(), name="Madrid", city="Madrid", state=None, country="Spain", timezone="Europe/Madrid"),
                Location(id=uuid4(), name="Lisbon", city="Lisbon", state=None, country="Portugal", timezone="Europe/Lisbon"),
                Location(id=uuid4(), name="Stockholm", city="Stockholm", state=None, country="Sweden", timezone="Europe/Stockholm"),
                Location(id=uuid4(), name="Copenhagen", city="Copenhagen", state=None, country="Denmark", timezone="Europe/Copenhagen"),
                Location(id=uuid4(), name="Zurich", city="Zurich", state=None, country="Switzerland", timezone="Europe/Zurich"),
                Location(id=uuid4(), name="Warsaw", city="Warsaw", state=None, country="Poland", timezone="Europe/Warsaw"),
                
                # Asia-Pacific
                Location(id=uuid4(), name="Singapore", city="Singapore", state=None, country="Singapore", timezone="Asia/Singapore"),
                Location(id=uuid4(), name="Hong Kong", city="Hong Kong", state=None, country="Hong Kong", timezone="Asia/Hong_Kong"),
                Location(id=uuid4(), name="Tokyo", city="Tokyo", state=None, country="Japan", timezone="Asia/Tokyo"),
                Location(id=uuid4(), name="Seoul", city="Seoul", state=None, country="South Korea", timezone="Asia/Seoul"),
                Location(id=uuid4(), name="Shanghai", city="Shanghai", state=None, country="China", timezone="Asia/Shanghai"),
                Location(id=uuid4(), name="Beijing", city="Beijing", state=None, country="China", timezone="Asia/Shanghai"),
                Location(id=uuid4(), name="Sydney", city="Sydney", state="NSW", country="Australia", timezone="Australia/Sydney"),
                Location(id=uuid4(), name="Melbourne", city="Melbourne", state="Victoria", country="Australia", timezone="Australia/Melbourne"),
                Location(id=uuid4(), name="Auckland", city="Auckland", state=None, country="New Zealand", timezone="Pacific/Auckland"),
                Location(id=uuid4(), name="Bangkok", city="Bangkok", state=None, country="Thailand", timezone="Asia/Bangkok"),
                Location(id=uuid4(), name="Kuala Lumpur", city="Kuala Lumpur", state=None, country="Malaysia", timezone="Asia/Kuala_Lumpur"),
                Location(id=uuid4(), name="Manila", city="Manila", state=None, country="Philippines", timezone="Asia/Manila"),
                Location(id=uuid4(), name="Jakarta", city="Jakarta", state=None, country="Indonesia", timezone="Asia/Jakarta"),
                Location(id=uuid4(), name="Ho Chi Minh City", city="Ho Chi Minh City", state=None, country="Vietnam", timezone="Asia/Ho_Chi_Minh"),
                
                # Middle East & Africa
                Location(id=uuid4(), name="Dubai", city="Dubai", state=None, country="UAE", timezone="Asia/Dubai"),
                Location(id=uuid4(), name="Tel Aviv", city="Tel Aviv", state=None, country="Israel", timezone="Asia/Jerusalem"),
                Location(id=uuid4(), name="Riyadh", city="Riyadh", state=None, country="Saudi Arabia", timezone="Asia/Riyadh"),
                Location(id=uuid4(), name="Cape Town", city="Cape Town", state=None, country="South Africa", timezone="Africa/Johannesburg"),
                Location(id=uuid4(), name="Johannesburg", city="Johannesburg", state=None, country="South Africa", timezone="Africa/Johannesburg"),
                Location(id=uuid4(), name="Cairo", city="Cairo", state=None, country="Egypt", timezone="Africa/Cairo"),
                Location(id=uuid4(), name="Lagos", city="Lagos", state=None, country="Nigeria", timezone="Africa/Lagos"),
                
                # Canada & Latin America
                Location(id=uuid4(), name="Toronto", city="Toronto", state="Ontario", country="Canada", timezone="America/Toronto"),
                Location(id=uuid4(), name="Vancouver", city="Vancouver", state="British Columbia", country="Canada", timezone="America/Vancouver"),
                Location(id=uuid4(), name="Montreal", city="Montreal", state="Quebec", country="Canada", timezone="America/Toronto"),
                Location(id=uuid4(), name="Mexico City", city="Mexico City", state=None, country="Mexico", timezone="America/Mexico_City"),
                Location(id=uuid4(), name="São Paulo", city="São Paulo", state=None, country="Brazil", timezone="America/Sao_Paulo"),
                Location(id=uuid4(), name="Buenos Aires", city="Buenos Aires", state=None, country="Argentina", timezone="America/Argentina/Buenos_Aires"),
                Location(id=uuid4(), name="Bogotá", city="Bogotá", state=None, country="Colombia", timezone="America/Bogota"),
                Location(id=uuid4(), name="Santiago", city="Santiago", state=None, country="Chile", timezone="America/Santiago"),
                
                # Remote options
                Location(id=uuid4(), name="Remote - India", city="Remote", state=None, country="India", timezone="Asia/Kolkata"),
                Location(id=uuid4(), name="Remote - USA", city="Remote", state=None, country="USA", timezone="America/New_York"),
                Location(id=uuid4(), name="Remote - Europe", city="Remote", state=None, country="Europe", timezone="Europe/London"),
                Location(id=uuid4(), name="Remote - Asia Pacific", city="Remote", state=None, country="APAC", timezone="Asia/Singapore"),
                Location(id=uuid4(), name="Remote - Global", city="Remote", state=None, country="Global", timezone="UTC"),
            ]
            
            # Filter out locations that already exist
            new_locations = [loc for loc in locations if loc.name not in existing_names]
            session.add_all(new_locations)
            
            await session.commit()
            
            print(f"✓ Added {len(new_locations)} new locations")
            print("\nReference data update complete!")
            
        except Exception as e:
            print(f"Error seeding data: {e}")
            await session.rollback()
            raise


if __name__ == "__main__":
    print("Starting reference data seeding...\n")
    asyncio.run(seed_reference_data())
