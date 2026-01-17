"""
Pytest configuration and fixtures for testing.
"""
import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from motor.motor_asyncio import AsyncIOMotorClient
import os

# Set test environment
os.environ["MONGODB_URL"] = "mongodb://localhost:27017"
os.environ["DATABASE_NAME"] = "movie_explorer_test"

from app.main import app
from app.database.mongodb import Database


@pytest.fixture(scope="session")
def event_loop():
    """Create an event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def db():
    """Setup test database and clean up after each test."""
    # Connect to test database
    await Database.connect()
    
    yield Database.get_db()
    
    # Clean up - drop all collections
    db = Database.get_db()
    await db.movies.delete_many({})
    await db.actors.delete_many({})
    await db.directors.delete_many({})
    await db.genres.delete_many({})
    
    await Database.disconnect()


@pytest.fixture
async def client(db):
    """Create an async HTTP client for testing."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def sample_genre(client):
    """Create a sample genre for testing."""
    response = await client.post("/genres", json={
        "name": "Action",
        "description": "Action-packed movies with exciting sequences"
    })
    return response.json()["data"]


@pytest.fixture
async def sample_director(client):
    """Create a sample director for testing."""
    response = await client.post("/directors", json={
        "name": "Christopher Nolan",
        "bio": "British-American filmmaker known for complex narratives"
    })
    return response.json()["data"]


@pytest.fixture
async def sample_actor(client):
    """Create a sample actor for testing."""
    response = await client.post("/actors", json={
        "name": "Leonardo DiCaprio",
        "bio": "American actor and film producer"
    })
    return response.json()["data"]


@pytest.fixture
async def sample_movie(client, sample_genre, sample_director, sample_actor):
    """Create a sample movie for testing."""
    response = await client.post("/movies", json={
        "title": "Inception",
        "release_year": 2010,
        "director_id": sample_director["id"],
        "actor_ids": [sample_actor["id"]],
        "genre_ids": [sample_genre["id"]],
        "rating": 8.8,
        "reviews": [
            {
                "user": "testuser",
                "comment": "Amazing movie!",
                "rating": 9.0
            }
        ]
    })
    return response.json()["data"]
