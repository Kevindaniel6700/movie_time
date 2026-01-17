"""
Movie Explorer Backend API

A FastAPI-based backend for exploring movies, actors, directors, and genres.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.database.mongodb import Database
from app.routers import movies, actors, directors, genres
from app.models.response import error_response
from app.services.enrichment import enrich_movies_with_posters
import asyncio


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for database connections."""
    # Startup
    await Database.connect()
    
    # Schedule background enrichment task
    asyncio.create_task(enrich_movies_with_posters())
    
    yield
    # Shutdown
    await Database.disconnect()


# Create FastAPI application
app = FastAPI(
    title="Movie Explorer API",
    description="""
    ## Movie Explorer Backend API
    
    A comprehensive API for exploring movies, actors, directors, and genres.
    
    ### Features
    - Browse and search movies
    - Layered filtering by genre, actor, director, and release year
    - Explore actors and directors
    - Browse genres
    
    ### Response Format
    All responses follow a consistent format:
    ```json
    {
        "success": true/false,
        "message": "Human readable message",
        "data": {}
    }
    ```
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(movies.router)
app.include_router(actors.router)
app.include_router(directors.router)
app.include_router(genres.router)


# Custom exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with consistent response format."""
    # If detail is already a dict (from error_response), use it
    if isinstance(exc.detail, dict):
        return JSONResponse(
            status_code=exc.status_code,
            content=exc.detail
        )
    # Otherwise, format it
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(str(exc.detail))
    )


@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    """Handle Pydantic validation errors."""
    return JSONResponse(
        status_code=400,
        content=error_response(f"Validation error: {str(exc)}")
    )


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    """Handle value errors (e.g., invalid ObjectId)."""
    return JSONResponse(
        status_code=400,
        content=error_response(str(exc))
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    return JSONResponse(
        status_code=500,
        content=error_response(f"Internal server error: {str(exc)}")
    )


# Health check endpoint
@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - health check."""
    return {
        "success": True,
        "message": "Movie Explorer API is running",
        "data": {
            "version": "1.0.0",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "success": True,
        "message": "API is healthy",
        "data": {
            "status": "ok"
        }
    }
