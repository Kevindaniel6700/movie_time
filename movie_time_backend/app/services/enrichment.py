"""
Service for enriching movie data with external information.
"""
import os
import asyncio
from app.database.mongodb import get_movies_collection
from app.services.omdb import fetch_poster_url

async def enrich_movies_with_posters():
    """
    Background task to enrich movies with poster URLs from OMDb.
    Runs only once on startup and skips movies that already have a poster.
    """
    if os.getenv("ENABLE_POSTER_ENRICHMENT", "True").lower() != "true":
        print("Poster enrichment disabled by configuration.")
        return

    print("Poster enrichment started.")
    
    try:
        movies_collection = get_movies_collection()
        
        # Find movies without poster_url
        # We look for documents where poster_url is either missing or null
        cursor = movies_collection.find({
            "$or": [
                {"poster_url": {"$exists": False}},
                {"poster_url": None}
            ]
        })
        
        processed_count = 0
        enriched_count = 0
        
        async for movie in cursor:
            processed_count += 1
            title = movie.get("title")
            release_year = movie.get("release_year")
            
            if not title:
                continue
                
            poster_url = await fetch_poster_url(title, release_year)
            
            if poster_url:
                await movies_collection.update_one(
                    {"_id": movie["_id"]},
                    {"$set": {"poster_url": poster_url}}
                )
                enriched_count += 1
                
        print(f"Poster enrichment completed. Processed {processed_count} movies, enriched {enriched_count} with posters.")
        
    except Exception as e:
        print(f"Error during poster enrichment: {str(e)}")
