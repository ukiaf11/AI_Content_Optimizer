FROM python:3.12-slim

# Install system dependencies including FFmpeg for video processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install uv package manager
RUN pip install --no-cache-dir uv

# Copy only requirements definitions first to leverage Docker build cache
COPY pyproject.toml uv.lock* ./

# Install python dependencies globally
RUN uv pip install --system -r pyproject.toml

# Copy the rest of the application files
COPY . .

# Ensure upload directory exists
RUN mkdir -p uploads

# Expose the API server port
EXPOSE 8000

# Start FastAPI via uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
