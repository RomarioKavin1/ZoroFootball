FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    pkg-config \
    libsecp256k1-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ./app /app/

# Create directory for wallet seed if it doesn't exist
RUN mkdir -p /app/data

EXPOSE 8000

# Run with environment variable set at runtime
CMD DSTACK_SIMULATOR_ENDPOINT=http://host.docker.internal:8090 uvicorn main:app --host 0.0.0.0 --port 8000 --reload