"""
Tests for filtering functionality.
"""
import pytest


@pytest.mark.asyncio
class TestMovieFilters:
    """Test cases for movie filtering."""
    
    async def test_filter_by_genre(self, client, sample_movie, sample_genre):
        """Test filtering movies by genre."""
        response = await client.get(f"/movies?genre_id={sample_genre['id']}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]) == 1
        assert data["data"][0]["title"] == "Inception"
    
    async def test_filter_by_nonexistent_genre(self, client, db):
        """Test filtering by a genre with no movies."""
        response = await client.get("/movies?genre_id=507f1f77bcf86cd799439011")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"] == []
    
    async def test_filter_by_invalid_genre_id(self, client, db):
        """Test filtering with invalid genre ID."""
        response = await client.get("/movies?genre_id=invalid_id")
        assert response.status_code == 400
    
    async def test_filter_by_director(self, client, sample_movie, sample_director):
        """Test filtering movies by director."""
        response = await client.get(f"/movies?director_id={sample_director['id']}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]) == 1
        assert data["data"][0]["director_id"] == sample_director["id"]
    
    async def test_filter_by_actor(self, client, sample_movie, sample_actor):
        """Test filtering movies by actor."""
        response = await client.get(f"/movies?actor_id={sample_actor['id']}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]) == 1
        assert sample_actor["id"] in data["data"][0]["actor_ids"]
    
    async def test_filter_by_release_year(self, client, sample_movie):
        """Test filtering movies by release year."""
        response = await client.get("/movies?release_year=2010")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]) == 1
        assert data["data"][0]["release_year"] == 2010
    
    async def test_filter_by_nonexistent_year(self, client, sample_movie):
        """Test filtering by a year with no movies."""
        response = await client.get("/movies?release_year=1999")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"] == []
    
    async def test_combined_filters(self, client, sample_movie, sample_genre, sample_director):
        """Test combining multiple filters."""
        response = await client.get(
            f"/movies?genre_id={sample_genre['id']}&director_id={sample_director['id']}&release_year=2010"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]) == 1
    
    async def test_combined_filters_no_match(self, client, sample_movie, sample_genre):
        """Test combined filters that result in no matches."""
        response = await client.get(
            f"/movies?genre_id={sample_genre['id']}&release_year=1999"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"] == []


@pytest.mark.asyncio
class TestActorFilters:
    """Test cases for actor filtering."""
    
    async def test_filter_actors_by_movie(self, client, sample_movie, sample_actor):
        """Test filtering actors by movie ID."""
        response = await client.get(f"/actors?movie_id={sample_movie['id']}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]) == 1
        assert data["data"][0]["name"] == "Leonardo DiCaprio"
    
    async def test_filter_actors_by_genre(self, client, sample_movie, sample_genre, sample_actor):
        """Test filtering actors by genre ID."""
        response = await client.get(f"/actors?genre_id={sample_genre['id']}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]) >= 1
    
    async def test_filter_actors_by_invalid_movie(self, client, db):
        """Test filtering actors with invalid movie ID."""
        response = await client.get("/actors?movie_id=invalid_id")
        assert response.status_code == 400
    
    async def test_filter_actors_by_nonexistent_genre(self, client, db):
        """Test filtering actors by genre with no movies."""
        response = await client.get("/actors?genre_id=507f1f77bcf86cd799439011")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"] == []
