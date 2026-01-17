"""
Tests for movie API endpoints.
"""
import pytest


@pytest.mark.asyncio
class TestMovies:
    """Test cases for movie endpoints."""
    
    async def test_get_movies_empty(self, client, db):
        """Test getting movies when database is empty."""
        response = await client.get("/movies")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"] == []
    
    async def test_create_movie(self, client, sample_genre, sample_director, sample_actor):
        """Test creating a new movie."""
        response = await client.post("/movies", json={
            "title": "The Dark Knight",
            "release_year": 2008,
            "director_id": sample_director["id"],
            "actor_ids": [sample_actor["id"]],
            "genre_ids": [sample_genre["id"]],
            "rating": 9.0,
            "reviews": []
        })
        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert data["data"]["title"] == "The Dark Knight"
        assert data["data"]["release_year"] == 2008
    
    async def test_create_movie_invalid_director_id(self, client):
        """Test creating a movie with invalid director ID."""
        response = await client.post("/movies", json={
            "title": "Test Movie",
            "release_year": 2020,
            "director_id": "invalid_id",
            "actor_ids": [],
            "genre_ids": [],
            "rating": 7.0
        })
        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
    
    async def test_get_movie_by_id(self, client, sample_movie):
        """Test getting a movie by ID."""
        movie_id = sample_movie["id"]
        response = await client.get(f"/movies/{movie_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["id"] == movie_id
        assert data["data"]["title"] == "Inception"
    
    async def test_get_movie_invalid_id(self, client, db):
        """Test getting a movie with invalid ID."""
        response = await client.get("/movies/invalid_id")
        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
    
    async def test_get_movie_not_found(self, client, db):
        """Test getting a movie that doesn't exist."""
        response = await client.get("/movies/507f1f77bcf86cd799439011")
        assert response.status_code == 404
        data = response.json()
        assert data["success"] is False
    
    async def test_update_movie(self, client, sample_movie):
        """Test updating a movie."""
        movie_id = sample_movie["id"]
        response = await client.put(f"/movies/{movie_id}", json={
            "title": "Inception (Updated)",
            "rating": 9.5
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["title"] == "Inception (Updated)"
        assert data["data"]["rating"] == 9.5
    
    async def test_update_movie_not_found(self, client, db):
        """Test updating a movie that doesn't exist."""
        response = await client.put("/movies/507f1f77bcf86cd799439011", json={
            "title": "Test"
        })
        assert response.status_code == 404
    
    async def test_delete_movie(self, client, sample_movie):
        """Test deleting a movie."""
        movie_id = sample_movie["id"]
        response = await client.delete(f"/movies/{movie_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        
        # Verify it's deleted
        response = await client.get(f"/movies/{movie_id}")
        assert response.status_code == 404
    
    async def test_delete_movie_not_found(self, client, db):
        """Test deleting a movie that doesn't exist."""
        response = await client.delete("/movies/507f1f77bcf86cd799439011")
        assert response.status_code == 404


@pytest.mark.asyncio
class TestGenres:
    """Test cases for genre endpoints."""
    
    async def test_get_genres_empty(self, client, db):
        """Test getting genres when database is empty."""
        response = await client.get("/genres")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"] == []
    
    async def test_create_genre(self, client, db):
        """Test creating a new genre."""
        response = await client.post("/genres", json={
            "name": "Comedy",
            "description": "Funny movies"
        })
        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert data["data"]["name"] == "Comedy"
    
    async def test_create_duplicate_genre(self, client, sample_genre):
        """Test creating a genre with duplicate name."""
        response = await client.post("/genres", json={
            "name": "Action",  # Same as sample_genre
            "description": "Another action description"
        })
        assert response.status_code == 400


@pytest.mark.asyncio
class TestDirectors:
    """Test cases for director endpoints."""
    
    async def test_get_directors_empty(self, client, db):
        """Test getting directors when database is empty."""
        response = await client.get("/directors")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"] == []
    
    async def test_create_director(self, client, db):
        """Test creating a new director."""
        response = await client.post("/directors", json={
            "name": "Steven Spielberg",
            "bio": "American filmmaker"
        })
        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert data["data"]["name"] == "Steven Spielberg"
    
    async def test_get_director_by_id(self, client, sample_director):
        """Test getting a director by ID."""
        director_id = sample_director["id"]
        response = await client.get(f"/directors/{director_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["name"] == "Christopher Nolan"


@pytest.mark.asyncio
class TestActors:
    """Test cases for actor endpoints."""
    
    async def test_get_actors_empty(self, client, db):
        """Test getting actors when database is empty."""
        response = await client.get("/actors")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"] == []
    
    async def test_create_actor(self, client, db):
        """Test creating a new actor."""
        response = await client.post("/actors", json={
            "name": "Tom Hanks",
            "bio": "American actor"
        })
        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert data["data"]["name"] == "Tom Hanks"
    
    async def test_get_actor_by_id(self, client, sample_actor):
        """Test getting an actor by ID."""
        actor_id = sample_actor["id"]
        response = await client.get(f"/actors/{actor_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["name"] == "Leonardo DiCaprio"
