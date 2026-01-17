"""
Genre Pydantic models for request/response validation.
"""
from pydantic import BaseModel, Field
from typing import Optional


class GenreCreate(BaseModel):
    """Schema for creating a new genre."""
    name: str = Field(..., min_length=1, max_length=100, description="Genre name")
    description: str = Field(..., min_length=1, max_length=500, description="Genre description")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "Action",
                    "description": "Movies with exciting action sequences, stunts, and physical feats."
                }
            ]
        }
    }


class GenreResponse(BaseModel):
    """Schema for genre response."""
    id: str = Field(..., description="Genre ID")
    name: str = Field(..., description="Genre name")
    description: str = Field(..., description="Genre description")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "id": "507f1f77bcf86cd799439011",
                    "name": "Action",
                    "description": "Movies with exciting action sequences, stunts, and physical feats."
                }
            ]
        }
    }


class GenreUpdate(BaseModel):
    """Schema for updating a genre."""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Genre name")
    description: Optional[str] = Field(None, min_length=1, max_length=500, description="Genre description")
