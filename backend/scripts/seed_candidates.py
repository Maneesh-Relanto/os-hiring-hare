"""
Seed test candidates
"""
import asyncio
from uuid import uuid4
from datetime import datetime
from app.core.database import async_session_maker
from app.models.candidate import Candidate, CandidateStatus
from app.models.requirement import Requirement
from sqlalchemy import select

# Test candidate data
CANDIDATES_DATA = [
    {
        "first_name": "John", "last_name": "Smith",
        "email": "john.smith@email.com", "phone": "+1-555-0101",
        "status": CandidateStatus.NEW.value,
        "current_company": "Tech Corp", "current_title": "Senior Software Engineer",
        "total_experience_years": "7", "source": "LinkedIn",
        "linkedin_url": "https://linkedin.com/in/johnsmith",
        "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"],
        "notes": "Strong backend developer with cloud experience"
    },
    {
        "first_name": "Sarah", "last_name": "Johnson",
        "email": "sarah.johnson@email.com", "phone": "+1-555-0102",
        "status": CandidateStatus.SCREENING.value,
        "current_company": "Startup Inc", "current_title": "Full Stack Developer",
        "total_experience_years": "5", "source": "Indeed",
        "linkedin_url": "https://linkedin.com/in/sarahjohnson",
        "skills": ["React", "TypeScript", "Node.js", "MongoDB", "GraphQL"],
        "notes": "Excellent communication skills, looking for growth opportunities"
    },
    {
        "first_name": "Michael", "last_name": "Chen",
        "email": "michael.chen@email.com", "phone": "+1-555-0103",
        "status": CandidateStatus.INTERVIEWING.value,
        "current_company": "Big Tech Co", "current_title": "Staff Engineer",
        "total_experience_years": "10", "source": "Referral",
        "linkedin_url": "https://linkedin.com/in/michaelchen",
        "portfolio_url": "https://github.com/michaelchen",
        "skills": ["Java", "Spring Boot", "Kubernetes", "Microservices", "Redis"],
        "notes": "Senior level candidate with strong system design skills"
    },
    {
        "first_name": "Emily", "last_name": "Williams",
        "email": "emily.williams@email.com", "phone": "+1-555-0104",
        "status": CandidateStatus.NEW.value,
        "current_company": "Digital Agency", "current_title": "Frontend Developer",
        "total_experience_years": "4", "source": "Company Website",
        "linkedin_url": "https://linkedin.com/in/emilywilliams",
        "skills": ["Vue.js", "CSS", "HTML", "JavaScript", "Figma"],
        "notes": "Great UI/UX sensibility"
    },
    {
        "first_name": "David", "last_name": "Martinez",
        "email": "david.martinez@email.com", "phone": "+1-555-0105",
        "status": CandidateStatus.OFFERED.value,
        "current_company": "Cloud Solutions", "current_title": "DevOps Engineer",
        "total_experience_years": "6", "source": "LinkedIn",
        "linkedin_url": "https://linkedin.com/in/davidmartinez",
        "skills": ["AWS", "Terraform", "Jenkins", "Docker", "Kubernetes"],
        "notes": "Offer extended, awaiting response"
    },
    {
        "first_name": "Lisa", "last_name": "Anderson",
        "email": "lisa.anderson@email.com", "phone": "+1-555-0106",
        "status": CandidateStatus.SCREENING.value,
        "current_company": "E-commerce Co", "current_title": "Product Manager",
        "total_experience_years": "8", "source": "Glassdoor",
        "linkedin_url": "https://linkedin.com/in/lisaanderson",
        "skills": ["Agile", "JIRA", "Product Strategy", "Stakeholder Management"],
        "notes": "Strong product background, technical PM"
    },
    {
        "first_name": "James", "last_name": "Taylor",
        "email": "james.taylor@email.com", "phone": "+1-555-0107",
        "status": CandidateStatus.NEW.value,
        "current_company": "Data Analytics Inc", "current_title": "Data Engineer",
        "total_experience_years": "5", "source": "Indeed",
        "linkedin_url": "https://linkedin.com/in/jamestaylor",
        "skills": ["Python", "Spark", "Airflow", "SQL", "BigQuery"],
        "notes": "Experience with large-scale data pipelines"
    },
    {
        "first_name": "Jennifer", "last_name": "Brown",
        "email": "jennifer.brown@email.com", "phone": "+1-555-0108",
        "status": CandidateStatus.INTERVIEWING.value,
        "current_company": "Mobile Apps Co", "current_title": "iOS Developer",
        "total_experience_years": "6", "source": "LinkedIn",
        "linkedin_url": "https://linkedin.com/in/jenniferbrown",
        "portfolio_url": "https://apps.apple.com/developer/jennifer-brown",
        "skills": ["Swift", "SwiftUI", "Objective-C", "iOS", "Xcode"],
        "notes": "Published 5 apps on App Store"
    },
    {
        "first_name": "Robert", "last_name": "Davis",
        "email": "robert.davis@email.com", "phone": "+1-555-0109",
        "status": CandidateStatus.REJECTED.value,
        "current_company": "Web Design Studio", "current_title": "Junior Developer",
        "total_experience_years": "2", "source": "Company Website",
        "linkedin_url": "https://linkedin.com/in/robertdavis",
        "skills": ["HTML", "CSS", "JavaScript", "jQuery"],
        "notes": "Not enough experience for senior role"
    },
    {
        "first_name": "Maria", "last_name": "Garcia",
        "email": "maria.garcia@email.com", "phone": "+1-555-0110",
        "status": CandidateStatus.NEW.value,
        "current_company": "FinTech Solutions", "current_title": "Backend Developer",
        "total_experience_years": "7", "source": "Referral",
        "linkedin_url": "https://linkedin.com/in/mariagarcia",
        "skills": ["Go", "Python", "PostgreSQL", "Redis", "RabbitMQ"],
        "notes": "Finance domain expertise"
    },
    {
        "first_name": "Thomas", "last_name": "Wilson",
        "email": "thomas.wilson@email.com", "phone": "+1-555-0111",
        "status": CandidateStatus.SCREENING.value,
        "current_company": "Gaming Studio", "current_title": "Game Developer",
        "total_experience_years": "9", "source": "LinkedIn",
        "linkedin_url": "https://linkedin.com/in/thomaswilson",
        "portfolio_url": "https://github.com/thomaswilson",
        "skills": ["Unity", "C#", "3D Graphics", "Game Design"],
        "notes": "Looking to transition to web development"
    },
    {
        "first_name": "Amanda", "last_name": "Moore",
        "email": "amanda.moore@email.com", "phone": "+1-555-0112",
        "status": CandidateStatus.INTERVIEWING.value,
        "current_company": "AI Research Lab", "current_title": "ML Engineer",
        "total_experience_years": "4", "source": "Indeed",
        "linkedin_url": "https://linkedin.com/in/amandamoore",
        "skills": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "NLP"],
        "notes": "PhD in Computer Science"
    },
    {
        "first_name": "Christopher", "last_name": "Taylor",
        "email": "christopher.taylor@email.com", "phone": "+1-555-0113",
        "status": CandidateStatus.NEW.value,
        "current_company": "Security Corp", "current_title": "Security Engineer",
        "total_experience_years": "8", "source": "LinkedIn",
        "linkedin_url": "https://linkedin.com/in/christophertaylor",
        "skills": ["Security", "Penetration Testing", "Python", "Network Security"],
        "notes": "CISSP certified"
    },
    {
        "first_name": "Jessica", "last_name": "Martinez",
        "email": "jessica.martinez@email.com", "phone": "+1-555-0114",
        "status": CandidateStatus.HIRED.value,
        "current_company": "Consulting Firm", "current_title": "Technical Consultant",
        "total_experience_years": "6", "source": "Referral",
        "linkedin_url": "https://linkedin.com/in/jessicamartinez",
        "skills": ["SAP", "Business Analysis", "Project Management", "SQL"],
        "notes": "Hired! Starting next month"
    },
    {
        "first_name": "Daniel", "last_name": "Rodriguez",
        "email": "daniel.rodriguez@email.com", "phone": "+1-555-0115",
        "status": CandidateStatus.NEW.value,
        "current_company": "Robotics Inc", "current_title": "Embedded Engineer",
        "total_experience_years": "5", "source": "Company Website",
        "linkedin_url": "https://linkedin.com/in/danielrodriguez",
        "skills": ["C++", "C", "Embedded Systems", "Linux", "IoT"],
        "notes": "Hardware background"
    },
    {
        "first_name": "Ashley", "last_name": "Lee",
        "email": "ashley.lee@email.com", "phone": "+1-555-0116",
        "status": CandidateStatus.SCREENING.value,
        "current_company": "Media Company", "current_title": "QA Engineer",
        "total_experience_years": "4", "source": "Indeed",
        "linkedin_url": "https://linkedin.com/in/ashleylee",
        "skills": ["Selenium", "Test Automation", "Python", "JIRA", "Agile"],
        "notes": "Strong automation testing skills"
    },
    {
        "first_name": "Matthew", "last_name": "White",
        "email": "matthew.white@email.com", "phone": "+1-555-0117",
        "status": CandidateStatus.WITHDRAWN.value,
        "current_company": "Blockchain Startup", "current_title": "Blockchain Developer",
        "total_experience_years": "3", "source": "LinkedIn",
        "linkedin_url": "https://linkedin.com/in/matthewwhite",
        "skills": ["Solidity", "Ethereum", "Web3", "Smart Contracts"],
        "notes": "Accepted offer elsewhere"
    },
    {
        "first_name": "Rachel", "last_name": "Harris",
        "email": "rachel.harris@email.com", "phone": "+1-555-0118",
        "status": CandidateStatus.INTERVIEWING.value,
        "current_company": "SaaS Company", "current_title": "Solutions Architect",
        "total_experience_years": "9", "source": "Referral",
        "linkedin_url": "https://linkedin.com/in/rachelharris",
        "skills": ["AWS", "Solution Design", "Microservices", "Architecture"],
        "notes": "Very strong technical background"
    },
    {
        "first_name": "Kevin", "last_name": "Clark",
        "email": "kevin.clark@email.com", "phone": "+1-555-0119",
        "status": CandidateStatus.NEW.value,
        "current_company": "Telecom Provider", "current_title": "Network Engineer",
        "total_experience_years": "7", "source": "Glassdoor",
        "linkedin_url": "https://linkedin.com/in/kevinclark",
        "skills": ["Networking", "Cisco", "Python", "Network Automation"],
        "notes": "Looking for software role"
    },
    {
        "first_name": "Nicole", "last_name": "Lewis",
        "email": "nicole.lewis@email.com", "phone": "+1-555-0120",
        "status": CandidateStatus.SCREENING.value,
        "current_company": "Healthcare Tech", "current_title": "Software Engineer",
        "total_experience_years": "5", "source": "LinkedIn",
        "linkedin_url": "https://linkedin.com/in/nicolelewis",
        "skills": ["Java", "Spring", "REST APIs", "MySQL", "Docker"],
        "notes": "Healthcare domain knowledge"
    }
]


async def seed_candidates():
    """Seed test candidates"""
    async with async_session_maker() as db:
        try:
            # Check if candidates already exist
            result = await db.execute(select(Candidate))
            existing = result.scalars().all()
            
            if existing:
                print(f"\n⚠️  Found {len(existing)} existing candidates. Skipping seed...")
                return
            
            # Get first requirement to link candidates to
            result = await db.execute(select(Requirement).limit(1))
            requirement = result.scalar_one_or_none()
            
            if not requirement:
                print("\n❌ No requirements found! Please seed requirements first.")
                return
            
            print(f"\n✅ Found requirement: {requirement.position_title}")
            print(f"📝 Creating 20 test candidates...\n")
            
            # Create candidates
            for idx, data in enumerate(CANDIDATES_DATA, 1):
                candidate = Candidate(
                    id=uuid4(),
                    first_name=data["first_name"],
                    last_name=data["last_name"],
                    email=data["email"],
                    phone=data.get("phone"),
                    requirement_id=requirement.id,
                    status=data["status"],
                    current_company=data.get("current_company"),
                    current_title=data.get("current_title"),
                    total_experience_years=data.get("total_experience_years"),
                    source=data.get("source"),
                    linkedin_url=data.get("linkedin_url"),
                    portfolio_url=data.get("portfolio_url"),
                    skills=data.get("skills"),
                    notes=data.get("notes"),
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                db.add(candidate)
                print(f"  {idx}. {candidate.first_name} {candidate.last_name} - {candidate.status}")
            
            await db.commit()
            
            print(f"\n✅ Successfully created {len(CANDIDATES_DATA)} candidates!")
            print(f"\nStatus breakdown:")
            status_counts = {}
            for c in CANDIDATES_DATA:
                status = c["status"]
                status_counts[status] = status_counts.get(status, 0) + 1
            
            for status, count in sorted(status_counts.items()):
                print(f"  • {status}: {count}")
            
        except Exception as e:
            print(f"\n❌ Error seeding candidates: {e}")
            await db.rollback()
            raise


if __name__ == "__main__":
    print("=" * 60)
    print("Seeding Test Candidates")
    print("=" * 60)
    asyncio.run(seed_candidates())
    print("\n" + "=" * 60)
