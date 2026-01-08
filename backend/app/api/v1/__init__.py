"""
API v1 router
"""
from fastapi import APIRouter

# Import route modules
from app.api.v1.endpoints import auth, requirements, reference_data, candidates, users, approvals, public, postings

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router, tags=["Authentication"])
api_router.include_router(requirements.router, tags=["Requirements"])
api_router.include_router(approvals.router, prefix="/approvals", tags=["Approvals"])
api_router.include_router(postings.router, tags=["Job Postings"])
api_router.include_router(reference_data.router, tags=["Reference Data"])
api_router.include_router(candidates.router, tags=["Candidates"])
api_router.include_router(users.router, tags=["Users"])
api_router.include_router(public.router, tags=["Public"])
