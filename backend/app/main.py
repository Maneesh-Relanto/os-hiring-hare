"""
Main FastAPI application entry point
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import api_router
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    print(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f"📝 Environment: {settings.ENVIRONMENT}")
    print(f"📚 API Docs: http://localhost:8000/docs")
    
    yield
    
    # Shutdown
    print(f"👋 Shutting down {settings.APP_NAME}")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Recruitment Requirement Tracking System API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API health check"""
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs": "/docs",
    }


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred",
                "detail": str(exc) if settings.DEBUG else None,
            },
        },
    )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info",
    )
