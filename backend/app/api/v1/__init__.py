"""
API v1 router
"""
from fastapi import APIRouter

# Import route modules (will be created)
# from app.api.v1 import auth, users, requirements, approvals

api_router = APIRouter()

# Include routers (uncomment as they are created)
# api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
# api_router.include_router(users.router, prefix="/users", tags=["Users"])
# api_router.include_router(requirements.router, prefix="/requirements", tags=["Requirements"])
# api_router.include_router(approvals.router, prefix="/approvals", tags=["Approvals"])
