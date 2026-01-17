"""
API response models for consistent response formatting.
"""
from pydantic import BaseModel, Field
from typing import Any, Optional, Generic, TypeVar, List

T = TypeVar('T')


class APIResponse(BaseModel, Generic[T]):
    """Standard API response wrapper."""
    success: bool = Field(..., description="Whether the request was successful")
    message: str = Field(..., description="Human readable message")
    data: Optional[T] = Field(None, description="Response data")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "success": True,
                    "message": "Operation completed successfully",
                    "data": {}
                }
            ]
        }
    }


class ErrorResponse(BaseModel):
    """Error response format."""
    success: bool = Field(default=False, description="Always false for errors")
    message: str = Field(..., description="Error description")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "success": False,
                    "message": "Invalid ObjectId format"
                }
            ]
        }
    }


def success_response(message: str, data: Any = None) -> dict:
    """
    Create a success response dictionary.
    
    Args:
        message: Human readable success message
        data: Response data
        
    Returns:
        Formatted success response dictionary
    """
    return {
        "success": True,
        "message": message,
        "data": data
    }


def error_response(message: str) -> dict:
    """
    Create an error response dictionary.
    
    Args:
        message: Error description
        
    Returns:
        Formatted error response dictionary
    """
    return {
        "success": False,
        "message": message
    }
