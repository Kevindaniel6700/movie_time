"""
Service for interacting with the OMDb API.
"""
import httpx
import os
from typing import Optional

OMDB_API_URL = "http://www.omdbapi.com/"
OMDB_API_KEY = "d6aa3778"  # Hardcoded as per requirements

async def fetch_poster_url(title: str, release_year: Optional[int] = None) -> Optional[str]:
    """
    Fetch the poster URL for a movie from the OMDb API.
    
    Args:
        title: The title of the movie.
        release_year: Optional release year to refine the search.
        
    Returns:
        The URL of the poster if found, None otherwise.
    """
    params = {
        "apikey": OMDB_API_KEY,
        "t": title,
    }
    
    if release_year:
        params["y"] = str(release_year)
        
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(OMDB_API_URL, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            poster = data.get("Poster")
            if poster and poster != "N/A" and poster.startswith("http"):
                return poster
                
    except Exception as e:
        print(f"Error fetching poster for '{title}': {str(e)}")
        # Continue processing other movies even if this one fails
        
    return None
