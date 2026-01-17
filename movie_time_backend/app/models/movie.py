"""
Movie Pydantic models for request/response validation.
"""
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime


class Review(BaseModel):
    """Schema for movie review."""
    user: str = Field(..., min_length=1, max_length=100, description="Username of reviewer")
    comment: str = Field(..., min_length=1, max_length=1000, description="Review comment")
    rating: float = Field(..., ge=0, le=10, description="Rating from 0 to 10")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "user": "moviefan123",
                    "comment": "An absolute masterpiece! The cinematography is stunning.",
                    "rating": 9.5
                }
            ]
        }
    }


class MovieCreate(BaseModel):
    """Schema for creating a new movie."""
    title: str = Field(..., min_length=1, max_length=300, description="Movie title")
    release_year: int = Field(..., ge=1888, le=2100, description="Release year")
    director_id: str = Field(..., description="Director's ObjectId")
    actor_ids: List[str] = Field(default=[], description="List of actor ObjectIds")
    genre_ids: List[str] = Field(default=[], description="List of genre ObjectIds")
    rating: float = Field(..., ge=0, le=10, description="Movie rating from 0 to 10")
    reviews: List[Review] = Field(default=[], description="List of reviews")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "title": "Inception",
                    "release_year": 2010,
                    "director_id": "507f1f77bcf86cd799439011",
                    "actor_ids": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
                    "genre_ids": ["507f1f77bcf86cd799439014", "507f1f77bcf86cd799439015"],
                    "rating": 8.8,
                    "reviews": [
                        {
                            "user": "moviefan123",
                            "comment": "Mind-bending plot with amazing visuals!",
                            "rating": 9.0
                        }
                    ]
                }
            ]
        }
    }


class MovieResponse(BaseModel):
    """Schema for movie response."""
    id: str = Field(..., description="Movie ID")
    title: str = Field(..., description="Movie title")
    release_year: int = Field(..., description="Release year")
    director_id: str = Field(..., description="Director's ObjectId")
    actor_ids: List[str] = Field(default=[], description="List of actor ObjectIds")
    genre_ids: List[str] = Field(default=[], description="List of genre ObjectIds")
    rating: float = Field(..., description="Movie rating")
    reviews: List[Review] = Field(default=[], description="List of reviews")
    poster_url: Optional[str] = Field(None, description="Movie poster URL")
    created_at: datetime = Field(..., description="Creation timestamp")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "id": "507f1f77bcf86cd799439011",
                    "title": "Inception",
                    "release_year": 2010,
                    "director_id": "507f1f77bcf86cd799439012",
                    "actor_ids": ["507f1f77bcf86cd799439013"],
                    "genre_ids": ["507f1f77bcf86cd799439014"],
                    "rating": 8.8,
                    "reviews": [],
                    "created_at": "2024-01-15T10:30:00Z"
                }
            ]
        }
    }


class MovieUpdate(BaseModel):
    """Schema for updating a movie."""
    title: Optional[str] = Field(None, min_length=1, max_length=300, description="Movie title")
    release_year: Optional[int] = Field(None, ge=1888, le=2100, description="Release year")
    director_id: Optional[str] = Field(None, description="Director's ObjectId")
    actor_ids: Optional[List[str]] = Field(None, description="List of actor ObjectIds")
    genre_ids: Optional[List[str]] = Field(None, description="List of genre ObjectIds")
    rating: Optional[float] = Field(None, ge=0, le=10, description="Movie rating from 0 to 10")
    reviews: Optional[List[Review]] = Field(None, description="List of reviews")
    poster_url: Optional[str] = Field(None, description="Movie poster URL")


class MovieSummary(BaseModel):
    """Schema for simplified movie response."""
    title: str = Field(..., description="Movie title")
    director: str = Field(..., description="Director name")
    actors: List[str] = Field(..., description="List of actor names")
    rating: float = Field(..., description="Movie rating")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "title": "Inception",
                    "director": "Christopher Nolan",
                    "actors": ["Leonardo DiCaprio"],
                    "rating": 8.8
                }
            ]
        }
    }


class MovieDetails(BaseModel):
    """Schema for movie with full details."""
    title: str = Field(..., description="Movie title")
    release_year: int = Field(..., description="Release year")
    poster_url: Optional[str] = Field(None, description="Movie poster URL")
    director: str = Field(..., description="Director name")
    actors: List[str] = Field(..., description="List of actor names")
    genres: List[str] = Field(..., description="List of genre names")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "title": "Inception",
                    "release_year": 2010,
                    "poster_url": "https://example.com/poster.jpg",
                    "director": "Christopher Nolan",
                    "actors": ["Leonardo DiCaprio"],
                    "genres": ["Sci-Fi", "Action"]
                }
            ]
        }
    }
