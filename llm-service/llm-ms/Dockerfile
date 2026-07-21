# llm-service/llm-ms/.render/Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user and grant directory permissions
RUN useradd -m -u 1000 appuser && \
    mkdir -p /app/chroma_db /tmp/chroma_db && \
    chown -R appuser:appuser /app /tmp/chroma_db
USER appuser

# Expose port
EXPOSE 8001

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]