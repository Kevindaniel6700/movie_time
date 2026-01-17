#!/bin/bash
set -e

echo "Movie Time Backend Starting..."

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

# Use a simple Python script that properly handles async MongoDB connection
until python -c "
import sys
from pymongo import MongoClient
import os
try:
    client = MongoClient(os.getenv('MONGODB_URL', 'mongodb://localhost:27017'), serverSelectionTimeoutMS=2000)
    client.admin.command('ping')
    client.close()
    sys.exit(0)
except Exception as e:
    sys.exit(1)
" 2>/dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "[ERROR] MongoDB not available after $MAX_RETRIES attempts. Exiting."
        exit 1
    fi
    echo "  MongoDB not ready yet... (attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

echo "[OK] MongoDB is ready!"

# Check if database needs seeding
echo "Checking if database needs seeding..."
MOVIE_COUNT=$(python -c "
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os

async def count():
    client = AsyncIOMotorClient(os.getenv('MONGODB_URL'))
    db = client[os.getenv('DATABASE_NAME', 'movie_explorer')]
    count = await db.movies.count_documents({})
    print(count)
    client.close()

asyncio.run(count())
")

if [ "$MOVIE_COUNT" -eq "0" ]; then
    echo "Database is empty. Running seed script..."
    python seed_data.py
    echo "[OK] Database seeded successfully!"
else
    echo "[OK] Database already has $MOVIE_COUNT movies. Skipping seeding."
fi

# Start the server
echo "Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000

