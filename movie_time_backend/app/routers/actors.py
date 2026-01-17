"""
Actors router - API endpoints for actor operations.
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from bson import ObjectId

from app.database.mongodb import get_actors_collection, get_movies_collection
from app.models.actor import ActorCreate, ActorResponse
from app.models.response import success_response, error_response
from app.utils.objectid import validate_object_id
from app.services.filters import build_actor_filter, get_actor_ids_by_genre

router = APIRouter(prefix="/actors", tags=["Actors"])


from app.services.formatters import format_movie_for_frontend

async def actor_doc_to_response(doc: dict) -> dict:
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
    summary="Get all actors",
    description="Retrieve a list of all actors. Can be filtered by movie_id or genre_id."
)
async def get_actors(
    movie_id: Optional[str] = Query(None, description="Filter by movie ID"),
    genre_id: Optional[str] = Query(None, description="Filter by genre ID (actors in movies of this genre)")
):
    """Get all actors with optional filters."""
    collection = get_actors_collection()
    actors = []
    
    # Build base filter
    try:
        filter_query = build_actor_filter(movie_id=movie_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_response(str(e))
        )
    
    # Handle genre_id filter (requires aggregation)
    if genre_id:
        try:
            movies_collection = get_movies_collection()
            actor_ids = await get_actor_ids_by_genre(genre_id, movies_collection)
            
            if not actor_ids:
                # No actors found for this genre - return empty array
                return success_response(
                    message="Retrieved 0 actors",
                    data=[]
                )
            
            filter_query["_id"] = {"$in": actor_ids}
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_response(str(e))
            )
    
    cursor = collection.find(filter_query)
    async for doc in cursor:
        actors.append(await actor_doc_to_response(doc))
    
    return success_response(
        message=f"Retrieved {len(actors)} actors",
        data=actors
    )


@router.get(
    "/{actor_id}",
    response_model=dict,
    summary="Get actor by ID",
    description="Retrieve a specific actor by their ID."
)
async def get_actor(actor_id: str):
    """Get an actor by ID."""
    collection = get_actors_collection()
    
    try:
        oid = ObjectId(actor_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_response("Invalid ObjectId format")
        )
    
    doc = await collection.find_one({"_id": oid})
    
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=error_response(f"Actor with ID {actor_id} not found")
        )
    
    return success_response(
        message="Actor retrieved successfully",
        data=await actor_doc_to_response(doc)
    )



