import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.services.enrichment import enrich_movies_with_posters

@pytest.mark.asyncio
async def test_enrich_movies_with_posters():
    # Mock OS environment
    with patch("os.getenv", return_value="True") as mock_env:
        
        # Mock fetch_poster_url
        with patch("app.services.enrichment.fetch_poster_url", new_callable=AsyncMock) as mock_fetch:
            mock_fetch.return_value = "http://example.com/poster.jpg"
            
            # Mock database collection - use MagicMock because .find() is synchronous (returns cursor)
            mock_collection = MagicMock()
            
            # Ensure update_one is async
            mock_collection.update_one = AsyncMock()
            
            # Mock cursor as an async iterator
            class AsyncIterator:
                def __init__(self, items):
                    self.items = items
                    self.index = 0

                def __aiter__(self):
                    return self

                async def __anext__(self):
                    if self.index < len(self.items):
                        item = self.items[self.index]
                        self.index += 1
                        return item
                    raise StopAsyncIteration

            mock_cursor = AsyncIterator([
                {"_id": "1", "title": "Test Movie", "release_year": 2022},
                {"_id": "2", "title": "Test Movie 2", "release_year": 2023}
            ])
            
            mock_collection.find.return_value = mock_cursor
            
            # Mock get_movies_collection
            with patch("app.services.enrichment.get_movies_collection", return_value=mock_collection):
                
                await enrich_movies_with_posters()
                
                # Check if fetch_poster_url was called
                assert mock_fetch.call_count == 2
                
                # Check if update_one was called
                assert mock_collection.update_one.call_count == 2
                mock_collection.update_one.assert_called_with(
                    {"_id": "2"},
                    {"$set": {"poster_url": "http://example.com/poster.jpg"}}
                )

@pytest.mark.asyncio
async def test_enrich_movies_disabled():
    with patch("os.getenv", return_value="False"):
        with patch("app.services.enrichment.get_movies_collection") as mock_get_collection:
            await enrich_movies_with_posters()
            mock_get_collection.assert_not_called()
