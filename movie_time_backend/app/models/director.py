"""
Director Pydantic models for request/response validation.
"""
from pydantic import BaseModel, Field
from typing import List, Optional


class DirectorCreate(BaseModel):
    """Schema for creating a new director."""
    name: str = Field(..., min_length=1, max_length=200, description="Director name")
    bio: str = Field(..., min_length=1, max_length=2000, description="Director biography")
    movie_ids: List[str] = Field(default=[], description="List of movie IDs directed")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "Christopher Nolan",
                    "bio": "British-American filmmaker known for his distinctive narrative style and complex storytelling.",
                    "movie_ids": []
                }
            ]
        }
    }


class DirectorResponse(BaseModel):
    """Schema for director response."""
    id: str = Field(..., description="Director ID")
    name: str = Field(..., description="Director name")
    bio: str = Field(..., description="Director biography")
    movie_ids: List[str] = Field(default=[], description="List of movie IDs directed")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "id": "507f1f77bcf86cd799439011",
                    "name": "Christopher Nolan",
                    "bio": "British-American filmmaker known for his distinctive narrative style and complex storytelling.",
                    "movie_ids": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
                }
            ]
        }
    }


class DirectorUpdate(BaseModel):
    """Schema for updating a director."""
    name: Optional[str] = Field(None, min_length=1, max_length=200, description="Director name")
    bio: Optional[str] = Field(None, min_length=1, max_length=2000, description="Director biography")
    movie_ids: Optional[List[str]] = Field(None, description="List of movie IDs directed")
