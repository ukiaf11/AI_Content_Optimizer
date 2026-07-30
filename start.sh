#!/bin/bash

# Terminate all background processes spawned by this script on exit
trap "kill 0" EXIT

echo "🚀 Starting AI Content Optimizer Platform..."

# 1. Start the FastAPI backend
echo "📦 Launching FastAPI Backend (Port 8000)..."
cd apps/api
uv run uvicorn main:app --port 8000 --host 0.0.0.0 &
API_PID=$!

# Go back to root
cd ../..

# 2. Start the Vite React frontend
echo "💻 Launching React Vite Frontend (Port 5173)..."
cd apps/web
npm run dev -- --host 0.0.0.0 &
WEB_PID=$!

# Wait for user interrupts or processes
echo "🟢 Workspace is ready! Open http://localhost:5173 to view the app."
wait $API_PID $WEB_PID
