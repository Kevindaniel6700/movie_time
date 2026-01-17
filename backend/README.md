# Movie Explorer Backend

The backend service for the Movie Explorer application, built with **Python**, **FastAPI**, and **MongoDB**. It provides a robust read-only API for browsing and searching movie data.

## Features

- **Advanced Search**: Search movies by title, actor name, or director name.
- **Filtering**: Deep filtering capabilities by release year, genre, and cast members.
- **Rich Data**: APIs return fully populated movie details, including reviews, ratings, and associated filmography for actors and directors.
- **Real-World Data**: Pre-seeded with a large dataset of real movies sourced from Wikipedia.

## Technology Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: MongoDB (using Motor for async operations)
- **Containerization**: Docker & Docker Compose

## Quick Start (Docker)

The easiest way to run the backend is with Docker.

```bash
cd backend
docker-compose up --build
```

The API will be accessible at: `http://localhost:8000`

## Local Development Setup

If you prefer running without Docker:

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Start MongoDB**:
    Ensure your local MongoDB instance is running (default: `localhost:27017`).

3.  **Seed Database (Optional but Recommended)**:
    This script downloads real movie data and populates your local database.
    ```bash
    python3 seed_data.py
    ```

4.  **Run Service**:
    ```bash
    uvicorn app.main:app --reload
    ```

## API Documentation

Interactive API documentation (Swagger UI) is available at:
👉 **[http://localhost:8000/docs](http://localhost:8000/docs)**

### Key Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/movies` | List movies with optional filters (genre, actor, director) |
| `GET` | `/movies/search` | Search by `q` (query) and `type` (title, actor, director) |
| `GET` | `/movies/{id}` | Get full movie details including reviews |
| `GET` | `/actors/{id}` | Get actor profile and filmography |
| `GET` | `/directors/{id}` | Get director profile and filmography |

## Testing

Run the test suite using Pytest:

```bash
pytest
```
