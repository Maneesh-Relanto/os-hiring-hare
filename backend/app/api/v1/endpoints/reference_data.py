"""
Reference Data API endpoints for departments, job levels, and locations
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import async_session_maker
from app.models.organization import Department, JobLevel, Location

router = APIRouter(prefix="/reference-data")


async def get_db() -> AsyncSession:
    async with async_session_maker() as session:
        yield session


@router.get("/departments")
async def list_departments(db: AsyncSession = Depends(get_db)):
    """Get all active departments"""
    result = await db.execute(
        select(Department).where(Department.is_active == True).order_by(Department.name)
    )
    departments = result.scalars().all()
    return [
        {"id": str(dept.id), "name": dept.name, "code": dept.code}
        for dept in departments
    ]


@router.get("/job-levels")
async def list_job_levels(db: AsyncSession = Depends(get_db)):
    """Get all active job levels"""
    result = await db.execute(
        select(JobLevel).where(JobLevel.is_active == True).order_by(JobLevel.level_order)
    )
    levels = result.scalars().all()
    return [
        {"id": str(level.id), "name": level.name, "code": level.code, "level_order": level.level_order}
        for level in levels
    ]


@router.get("/locations")
async def list_locations(db: AsyncSession = Depends(get_db)):
    """Get all active locations"""
    result = await db.execute(
        select(Location).where(Location.is_active == True).order_by(Location.country, Location.city)
    )
    locations = result.scalars().all()
    return [
        {"id": str(loc.id), "name": loc.name, "city": loc.city, "country": loc.country}
        for loc in locations
    ]
