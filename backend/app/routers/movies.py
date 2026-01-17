"""
Movies router - API endpoints for movie operations.
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional, Dict, Any
from bson import ObjectId
from datetime import datetime
import random

from app.database.mongodb import get_movies_collection, get_actors_collection, get_directors_collection, get_genres_collection
from app.models.movie import MovieCreate, MovieUpdate
from app.models.response import success_response, error_response
from app.utils.objectid import validate_object_id
from app.services.filters import build_movie_filter

router = APIRouter(prefix="/movies", tags=["Movies"])


from app.services.formatters import format_movie_for_frontend


@router.get(
    "/details",
    response_model=dict,
    summary="Get all movies with full details",
    description="Retrieve a list of all movies with title, release year, poster URL, director name, actors, and genres."
)
async def get_movies_details():
    """Get all movies with full details."""
    # This endpoint seems redundant now that main list returns details,
    # but we keep it for compatibility if needed, using the new formatter.
    movies_collection = get_movies_collection()
    movies = []
    cursor = movies_collection.find({})
    async for doc in cursor:
        movies.append(await format_movie_for_frontend(doc))
    
    return {"movies": movies}


@router.get(
    "/summary",
    response_model=dict,
    summary="Get simplified movie list"
)
async def get_movies_summary():
    """Get simplified movie list."""
    movies_collection = get_movies_collection()
    movies = []
    cursor = movies_collection.find({})
    async for doc in cursor:
        movies.append(await format_movie_for_frontend(doc))
    
    return success_response(
        message=f"Retrieved {len(movies)} movies",
        data=movies
    )


@router.get(
    "/featured",
    response_model=dict,
    summary="Get featured movies",
    description="Retrieve a list of featured movies (top rated)."
)
async def get_featured_movies():
    """Get featured movies."""
    collection = get_movies_collection()
    movies = []
    
    # Get top 5 rated movies
    cursor = collection.find().sort("rating", -1).limit(5)
    async for doc in cursor:
        fmt = await format_movie_for_frontend(doc)
        fmt["isFeatured"] = True
        movies.append(fmt)
    
    # If fewer than 5, fill with random
    if len(movies) < 5:
        pipeline = [{"$sample": {"size": 5 - len(movies)}}]
        async for doc in collection.aggregate(pipeline):
             # check if not already in movies to avoid duplicates
             if not any(m["id"] == str(doc["_id"]) for m in movies):
                 fmt = await format_movie_for_frontend(doc)
                 fmt["isFeatured"] = True
                 movies.append(fmt)

    return success_response(
        message=f"Retrieved {len(movies)} featured movies",
        data=movies
    )


@router.get(
    "/search",
    response_model=dict,
    summary="Search movies",
    description="Search movies by title."
)
async def search_movies(
    q: Optional[str] = Query(None, description="Search query"),
    type: Optional[str] = Query(None, description="Type filter (unused)")
):
    """Search movies."""
    collection = get_movies_collection()
    actors_collection = get_actors_collection()
    directors_collection = get_directors_collection()
    
    movie_ids_from_actors = set()
    movie_ids_from_directors = set()
    
    search_type = type.lower() if type else "all"
    
    if q:
        # 1. Find actors matching name (if type is actor or all)
        if search_type in ["actor", "all"]:
            actor_cursor = actors_collection.find({"name": {"$regex": q, "$options": "i"}})
            async for actor in actor_cursor:
                for mid in actor.get("movie_ids", []):
                    movie_ids_from_actors.add(mid)
        
        # 2. Find directors matching name (if type is director or all)
        if search_type in ["director", "all"]:
            director_cursor = directors_collection.find({"name": {"$regex": q, "$options": "i"}})
            async for director in director_cursor:
                for mid in director.get("movie_ids", []):
                    movie_ids_from_directors.add(mid)
    
    query = {}
    if q:
        or_conditions = []
        
        # Title search
        if search_type in ["title", "all"]:
            or_conditions.append({"title": {"$regex": q, "$options": "i"}})
            
        # Actor search results
        if movie_ids_from_actors and search_type in ["actor", "all"]:
            or_conditions.append({"_id": {"$in": list(movie_ids_from_actors)}})
            
        # Director search results
        if movie_ids_from_directors and search_type in ["director", "all"]:
            or_conditions.append({"_id": {"$in": list(movie_ids_from_directors)}})
            
        if or_conditions:
            query["$or"] = or_conditions
        else:
            # If nothing matched in specific categories, return simplified empty result
            # Or if specific search yielded no IDs (e.g. Actor "Spielberg" -> 0 actors found -> 0 IDs)
            # We must ensure we return 0 results, not all movies.
            # If query is non-empty but conditions are empty, force empty result.
            return success_response(message="No results found", data=[])
        
    movies = []
    cursor = collection.find(query)
    async for doc in cursor:
        movies.append(await format_movie_for_frontend(doc))
        
    return success_response(
        message=f"Found {len(movies)} movies",
        data=movies
    )


@router.get(
    "",
    response_model=dict,
    summary="Get all movies",
    description="Retrieve a list of all movies."
)
async def get_movies(
    genre_id: Optional[str] = Query(None, alias="genreId"),
    actor_id: Optional[str] = Query(None, alias="actorId"),
    director_id: Optional[str] = Query(None, alias="directorId"),
    genre_id_snake: Optional[str] = Query(None, alias="genre_id"),
    actor_id_snake: Optional[str] = Query(None, alias="actor_id"),
    director_id_snake: Optional[str] = Query(None, alias="director_id"),
    release_year: Optional[int] = Query(None)
):
    """Get all movies with optional filters."""
    collection = get_movies_collection()
    movies = []
    
    # Consolidate aliases
    final_genre_id = genre_id or genre_id_snake
    final_actor_id = actor_id or actor_id_snake
    final_director_id = director_id or director_id_snake

    try:
        filter_query = build_movie_filter(
            genre_id=final_genre_id,
            actor_id=final_actor_id,
            director_id=final_director_id,
            release_year=release_year
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_response(str(e))
        )
    
    cursor = collection.find(filter_query)
    async for doc in cursor:
        movies.append(await format_movie_for_frontend(doc))
    
    return success_response(
        message=f"Retrieved {len(movies)} movies",
        data=movies
    )


@router.get(
    "/{movie_id}/related",
    response_model=dict,
    summary="Get related movies"
)
async def get_related_movies(movie_id: str):
    """Get related movies."""
    collection = get_movies_collection()
    
    try:
        oid = ObjectId(movie_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_response("Invalid ObjectId format")
        )

    current_movie = await collection.find_one({"_id": oid})
    if not current_movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    movies = []
    # Find movies with same genre, exclude current
    if "genre_ids" in current_movie and current_movie["genre_ids"]:
        query = {
            "_id": {"$ne": oid},
            "genre_ids": {"$in": current_movie["genre_ids"]}
        }
        cursor = collection.find(query).limit(5)
        async for doc in cursor:
            movies.append(await format_movie_for_frontend(doc))
            
    return success_response(
        message=f"Retrieved {len(movies)} related movies",
        data=movies
    )


@router.get(
    "/{movie_id}",
    response_model=dict,
    summary="Get movie by ID"
)
async def get_movie(movie_id: str):
    """Get a movie by ID."""
    collection = get_movies_collection()
    
    try:
        oid = ObjectId(movie_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_response("Invalid ObjectId format")
        )
    
    doc = await collection.find_one({"_id": oid})
    
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=error_response(f"Movie with ID {movie_id} not found")
        )
    
    return success_response(
        message="Movie retrieved successfully",
        data=await format_movie_for_frontend(doc)
    )


