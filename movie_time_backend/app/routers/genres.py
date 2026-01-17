"""
Genres router - API endpoints for genre operations.
"""
from fastapi import APIRouter, HTTPException, status
from typing import List
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from app.database.mongodb import get_genres_collection
from app.models.genre import GenreCreate, GenreResponse
from app.models.response import success_response, error_response

router = APIRouter(prefix="/genres", tags=["Genres"])


def genre_doc_to_response(doc: dict) -> dict:
    """Convert MongoDB document to response format."""
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "description": doc["description"]
    }


@router.get(
    "",
    response_model=dict,
    summary="Get all genres",
    description="Retrieve a list of all available genres."
)
async def get_genres():
    """Get all genres."""
    collection = get_genres_collection()
    genres = []
    
    cursor = collection.find({})
    async for doc in cursor:
        genres.append(genre_doc_to_response(doc))
    
    return success_response(
        message=f"Retrieved {len(genres)} genres",
        data=genres
    )


@router.get(
    "/{genre_id}",
    response_model=dict,
    summary="Get genre by ID",
    description="Retrieve a specific genre by its ID."
)
async def get_genre(genre_id: str):
    """Get a genre by ID."""
    collection = get_genres_collection()
    
    try:
        oid = ObjectId(genre_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_response("Invalid ObjectId format")
        )
    
    doc = await collection.find_one({"_id": oid})
    
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=error_response(f"Genre with ID {genre_id} not found")
        )
    
    return success_response(
        message="Genre retrieved successfully",
        data=genre_doc_to_response(doc)
    )



