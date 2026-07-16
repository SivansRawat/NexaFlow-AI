#!/bin/bash

# NexaFlow AI Installation Script

set -e

echo "🚀 NexaFlow AI Installation Script"
echo "================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.10+"
    exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose"
    exit 1
fi

echo "✅ All prerequisites satisfied"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."

# Backend
echo "📦 Installing backend dependencies..."
cd backend
npm install
npm run db:generate
cd ..

# Frontend
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# LLM Service
echo "📦 Installing LLM service dependencies..."
cd llm-service/llm-ms
pip install -r requirements.txt
cd ../..

echo "✅ All dependencies installed"

# Setup environment files
echo ""
echo "🔧 Setting up environment files..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env"
fi

if [ ! -f llm-service/llm-ms/.env ]; then
    cp llm-service/llm-ms/.env.example llm-service/llm-ms/.env
    echo "✅ Created llm-service/llm-ms/.env"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "Next steps:"
echo "1. Update environment files with your configuration"
echo "2. Run 'docker-compose up -d' to start services"
echo "3. Run 'npm run dev' in each service directory"
echo ""
echo "📚 Documentation:"
echo "   - RAG: backend/RAG_QUICK_START.md"
echo "   - API: http://localhost:8001/docs"
echo "   - Monitoring: http://localhost:3001 (Grafana)"
echo "   - Metrics: http://localhost:9090 (Prometheus)"