from typing import Dict, Any, List
from app.database.mongodb import get_actors_collection, get_directors_collection, get_genres_collection

async def format_movie_for_frontend(doc: Dict[str, Any]) -> Dict[str, Any]:
    """
    Format a movie document for the frontend.
    Populates director, actors, and genres.
    Converts keys to camelCase.
    """
    actors_collection = get_actors_collection()
    directors_collection = get_directors_collection()
    genres_collection = get_genres_collection()

    # Fetch director
    director = None
    if "director_id" in doc:
        d = await directors_collection.find_one({"_id": doc["director_id"]})
        if d:
            director = {"id": str(d["_id"]), "name": d["name"], "bio": d.get("bio")}
    
    # Fetch actors
    actors = []
    if "actor_ids" in doc and doc["actor_ids"]:
        async for a in actors_collection.find({"_id": {"$in": doc["actor_ids"]}}):
            actors.append({"id": str(a["_id"]), "name": a["name"], "bio": a.get("bio")})
            
    # Fetch genres
    genres = []
    if "genre_ids" in doc and doc["genre_ids"]:
        async for g in genres_collection.find({"_id": {"$in": doc["genre_ids"]}}):
            genres.append({"id": str(g["_id"]), "name": g["name"]})
            
    return {
        "id": str(doc["_id"]),
        "title": doc["title"],
        "releaseYear": doc["release_year"],
        "rating": doc["rating"],
        "director": director or {"id": "", "name": "Unknown"},
        "actors": actors,
        "genres": genres,
        "description": doc.get("description", f"A movie released in {doc['release_year']}."),
        "isFeatured": doc.get("isFeatured", False), 
        "posterUrl": doc.get("poster_url"),
        "reviews": doc.get("reviews", [])
    }
