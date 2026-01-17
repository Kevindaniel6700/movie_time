"""
MongoDB database connection and management module.
Handles connection lifecycle and provides access to collections.
"""
import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional


class Database:
    """MongoDB database connection manager."""
    
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    
    @classmethod
    async def connect(cls) -> None:
        """Establish connection to MongoDB."""
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        database_name = os.getenv("DATABASE_NAME", "movie_explorer")
        
        cls.client = AsyncIOMotorClient(mongodb_url)
        cls.db = cls.client[database_name]
        
        # Create indexes
        await cls._create_indexes()
        
        print(f"Connected to MongoDB: {database_name}")
    
    @classmethod
    async def disconnect(cls) -> None:
        """Close MongoDB connection."""
        if cls.client:
            cls.client.close()
            print("Disconnected from MongoDB")
    
    @classmethod
    async def _create_indexes(cls) -> None:
        """Create indexes for efficient querying."""
        if cls.db is None:
            return
        
        # Movies indexes
        await cls.db.movies.create_index("release_year")
        await cls.db.movies.create_index("director_id")
        await cls.db.movies.create_index("genre_ids")
        await cls.db.movies.create_index("actor_ids")
        await cls.db.movies.create_index("rating")
        
        # Actors indexes
        await cls.db.actors.create_index("name")
        await cls.db.actors.create_index("movie_ids")
        
        # Directors indexes
        await cls.db.directors.create_index("name")
        
        # Genres indexes (unique name)
        await cls.db.genres.create_index("name", unique=True)
    
    @classmethod
    def get_db(cls) -> AsyncIOMotorDatabase:
        """Get the database instance."""
        if cls.db is None:
            raise RuntimeError("Database not connected. Call connect() first.")
        return cls.db


# Collection accessors
def get_movies_collection():
    """Get the movies collection."""
    return Database.get_db().movies


def get_actors_collection():
    """Get the actors collection."""
    return Database.get_db().actors


def get_directors_collection():
    """Get the directors collection."""
    return Database.get_db().directors


def get_genres_collection():
    """Get the genres collection."""
    return Database.get_db().genres
