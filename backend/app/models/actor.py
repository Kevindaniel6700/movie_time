"""
Actor Pydantic models for request/response validation.
"""
from pydantic import BaseModel, Field
from typing import List, Optional


class ActorCreate(BaseModel):
    """Schema for creating a new actor."""
    name: str = Field(..., min_length=1, max_length=200, description="Actor name")
    bio: str = Field(..., min_length=1, max_length=2000, description="Actor biography")
    movie_ids: List[str] = Field(default=[], description="List of movie IDs the actor appeared in")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "Leonardo DiCaprio",
                    "bio": "American actor and film producer known for his work in biopics and period films.",
                    "movie_ids": []
                }
            ]
        }
    }


class ActorResponse(BaseModel):
    """Schema for actor response."""
    id: str = Field(..., description="Actor ID")
    name: str = Field(..., description="Actor name")
    bio: str = Field(..., description="Actor biography")
    movie_ids: List[str] = Field(default=[], description="List of movie IDs the actor appeared in")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "id": "507f1f77bcf86cd799439011",
                    "name": "Leonardo DiCaprio",
                    "bio": "American actor and film producer known for his work in biopics and period films.",
                    "movie_ids": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
                }
            ]
        }
    }


class ActorUpdate(BaseModel):
    """Schema for updating an actor."""
    name: Optional[str] = Field(None, min_length=1, max_length=200, description="Actor name")
    bio: Optional[str] = Field(None, min_length=1, max_length=2000, description="Actor biography")
    movie_ids: Optional[List[str]] = Field(None, description="List of movie IDs the actor appeared in")
