"""
Directors router - API endpoints for director operations.
"""
from fastapi import APIRouter, HTTPException, status
from typing import List
from bson import ObjectId

from app.database.mongodb import get_directors_collection
from app.models.director import DirectorCreate, DirectorResponse
from app.models.response import success_response, error_response
from app.utils.objectid import validate_object_id

router = APIRouter(prefix="/directors", tags=["Directors"])


from app.services.formatters import format_movie_for_frontend
from app.database.mongodb import get_movies_collection

async def director_doc_to_response(doc: dict) -> dict:
    """Convert MongoDB document to response format."""
    movies_collection = get_movies_collection()
    movies = []
    
    if "movie_ids" in doc and doc["movie_ids"]:
        # Fetch full movie details
        cursor = movies_collection.find({"_id": {"$in": doc["movie_ids"]}})
        async for m in cursor:
            movies.append(await format_movie_for_frontend(m))

    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "bio": doc["bio"],
        "movies": movies # Return full movie objects
    }


@router.get(
    "",
    response_model=dict,
    summary="Get all directors",
    description="Retrieve a list of all directors."
)
async def get_directors():
    """Get all directors."""
    collection = get_directors_collection()
    directors = []
    
    cursor = collection.find({})
    async for doc in cursor:
        directors.append(await director_doc_to_response(doc))
    
    return success_response(
        message=f"Retrieved {len(directors)} directors",
        data=directors
    )


@router.get(
    "/{director_id}",
    response_model=dict,
    summary="Get director by ID",
    description="Retrieve a specific director by their ID."
)
async def get_director(director_id: str):
    """Get a director by ID."""
    collection = get_directors_collection()
    
    try:
        oid = ObjectId(director_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_response("Invalid ObjectId format")
        )
    
    doc = await collection.find_one({"_id": oid})
    
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=error_response(f"Director with ID {director_id} not found")
        )
    
    return success_response(
        message="Director retrieved successfully",
        data=await director_doc_to_response(doc)
    )



