# Movie Time

A full-stack movie exploration platform built with **FastAPI**, **React**, and **MongoDB**.

## Quick Start (Single Click)

Run the entire application with a single command:

```bash
./start.sh
```

This will:
1. Build all Docker containers
2. Start MongoDB database
3. Seed the database with real movie data (500+ movies)
4. Start the backend API
5. Start the frontend application

Once ready, access the application:
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) (Docker Desktop recommended)
- Bash shell (macOS/Linux built-in, or Git Bash on Windows)

## Manual Docker Commands

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove all data (full reset)
docker-compose down -v
```

## Project Structure

```
Movie Time/
├── backend/              # FastAPI backend (Python)
│   ├── app/              # Application code
│   ├── Dockerfile        # Backend container
│   ├── entrypoint.sh     # Startup script with DB seeding
│   └── seed_data.py      # Database seeding script
├── cinestream-view/      # React frontend (Vite + TypeScript)
│   ├── src/              # Source code
│   ├── Dockerfile        # Frontend container (multi-stage)
│   └── nginx.conf        # Nginx configuration
├── docker-compose.yml    # Container orchestration
└── start.sh              # Single-click startup script
```

## Development Setup

### Backend (Local)
```bash
cd backend
pip install -r requirements.txt
python3 seed_data.py        # Seed database
uvicorn app.main:app --reload
```

### Frontend (Local)
```bash
cd cinestream-view
npm install
npm run dev
```

## Testing

```bash
# Backend tests
cd backend && pytest

# Frontend tests
cd cinestream-view && npm test
```

