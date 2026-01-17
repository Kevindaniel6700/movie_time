"""
Filtering service for building MongoDB query filters.
Handles combining multiple filter parameters efficiently.
"""
from bson import ObjectId
from typing import Optional, Dict, Any, List
from app.utils.objectid import validate_object_id


def build_movie_filter(
    genre_id: Optional[str] = None,
    actor_id: Optional[str] = None,
    director_id: Optional[str] = None,
    release_year: Optional[int] = None
) -> Dict[str, Any]:
    """
    Build a MongoDB filter query for movies.
    
    Combines multiple filter parameters into a single query.
    All filters are combined with AND logic.
    
    Args:
        genre_id: Filter by genre ObjectId
        actor_id: Filter by actor ObjectId
        director_id: Filter by director ObjectId
        release_year: Filter by release year
        
    Returns:
        MongoDB-compatible filter dictionary
        
    Raises:
        ValueError: If any ObjectId format is invalid
    """
    filter_query: Dict[str, Any] = {}
    
    if genre_id:
        oid = validate_object_id(genre_id)
        filter_query["genre_ids"] = oid
    
    if actor_id:
        oid = validate_object_id(actor_id)
        filter_query["actor_ids"] = oid
    
    if director_id:
        oid = validate_object_id(director_id)
        filter_query["director_id"] = oid
    
    if release_year:
        filter_query["release_year"] = release_year
    
    return filter_query


def build_actor_filter(
    movie_id: Optional[str] = None,
    genre_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Build a MongoDB filter query for actors.
    
    Args:
        movie_id: Filter by movie ObjectId
        genre_id: Filter by genre ObjectId (requires aggregation - returns movie_ids to filter)
        
    Returns:
        MongoDB-compatible filter dictionary
        
    Raises:
        ValueError: If any ObjectId format is invalid
    """
    filter_query: Dict[str, Any] = {}
    
    if movie_id:
        oid = validate_object_id(movie_id)
        filter_query["movie_ids"] = oid
    
    return filter_query


async def get_actor_ids_by_genre(genre_id: str, movies_collection) -> List[ObjectId]:
    """
    Get all actor IDs that appear in movies of a specific genre.
    
    Args:
        genre_id: Genre ObjectId string
        movies_collection: MongoDB movies collection
        
    Returns:
        List of unique actor ObjectIds
    """
    oid = validate_object_id(genre_id)
    
    # Find all movies with this genre and collect their actor_ids
    actor_ids = set()
    cursor = movies_collection.find({"genre_ids": oid}, {"actor_ids": 1})
    
    async for movie in cursor:
        for actor_id in movie.get("actor_ids", []):
            actor_ids.add(actor_id)
    
    return list(actor_ids)


def build_director_filter() -> Dict[str, Any]:
    """
    Build a MongoDB filter query for directors.
    
    Currently no specific filters for directors.
    
    Returns:
        Empty filter dictionary (returns all directors)
    """
    return {}


def build_genre_filter() -> Dict[str, Any]:
    """
    Build a MongoDB filter query for genres.
    
    Currently no specific filters for genres.
    
    Returns:
        Empty filter dictionary (returns all genres)
    """
    return {}
