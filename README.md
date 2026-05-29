```markdown
# NexaFlow AI

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://www.nexaflowai.com)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**NexaFlow AI** is  all‑in‑one AI automation platform for businesses. It provides 15+ AI‑powered tools including Excel analysis, PDF chat, email generation, social media caption writing, and bulk document processing – all powered by a self‑hosted RAG (Retrieval‑Augmented Generation) pipeline with local LLMs.

---

## 🚀 Features

- **📊 Excel Genius Suite** – AI Sheet Summarizer, Formula Master, Error & Trend Detector, Chart Builder, Export Wizard.
- **📄 PDF Intelligence Hub** – PDF Brain (summarization), PDF Chat Agent (ask your PDF), Smart Data Extractor, Bulk PDF Toolkit, PDF Converter Pro.
- **🧠 AI Workmate** – ChatGPT‑level assistant, prompt library, chat history.
- **✉️ MailCraft AI** – Email Wizard, Subject Line Optimizer, Tone Polisher.
- **📱 Social Pro Toolkit** – CaptionPro, Hashtag Strategist, Ad Caption Generator, Caption Rewriter.
- **📑 SmartDocs Generator** – Offer Letter Composer, Smart Invoice Builder.
- **📨 BulkMailer Pro** – Excel‑to‑Email Engine, Mail Merge AI, Smart Template Library.
- **💳 Payments & Auth** – Razorpay integration, JWT authentication, Google OAuth, usage limits.

---

## 🛠️ Tech Stack

| Layer          | Technologies                                                |
| -------------- | ----------------------------------------------------------- |
| **Frontend**   | React 18, TypeScript, Tailwind CSS, Vite, React Router DOM  |
| **Backend**    | Node.js, Express.js, Prisma ORM, PostgreSQL                 |
| **AI/ML**      | FastAPI, Ollama (Llama 3.2, nomic‑embed‑text), ChromaDB     |
| **RAG**        | Custom RAG pipeline – chunking, embeddings, semantic search |
| **Payment**    | Razorpay API                                                |
| **Auth**       | JWT (access/refresh tokens), Google OAuth                   |
| **Deployment** | Docker Compose, Vercel (frontend), Neon PostgreSQL          |

---

## 🏗️ Architecture
```

Frontend (React) → Backend (Express) → LLM Service (FastAPI) → Ollama (LLM + Embeddings)
↓ ↓
PostgreSQL (metadata) ChromaDB (vectors)

````

- **RAG flow**: PDF/Excel upload → text extraction → chunking → embedding → ChromaDB storage → query → retrieval → LLM answer.
- **Multi‑tenant isolation**: per‑user ChromaDB collections (`user_{id}_documents`).
- **Graceful fallback**: RAG → context window → raw LLM.

---

## 📦 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+, Python 3.10+, Docker & Docker Compose

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/nexaflow-ai.git
cd nexaflow-ai

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# LLM service
cd ../llm-service/llm-ms && pip install -r requirements.txt
````

2. Environment Variables

Copy .env.example to .env in each service and fill in your keys (Razorpay, Google OAuth, etc.).
Never commit .env files.

3. Run with Docker Compose

```bash
cd ..  # back to project root
docker compose up -d
```

4. Run Services

```bash
# Terminal 1 – Backend
cd backend && npm run dev

# Terminal 2 – LLM Service
cd llm-service/llm-ms && python run.py

# Terminal 3 – Frontend
cd frontend && npm run dev
```

5. Access

· Frontend: http://localhost:3000
· Backend API: http://localhost:5000
· LLM Service Docs: http://localhost:8001/docs

---

🧪 Testing RAG

```bash
# Ingest a test document
curl -X POST http://localhost:8001/api/rag/ingest \
  -H "Content-Type: application/json" \
  -d '{"document_id":"test","document_text":"Revenue was $5M in 2024"}'

# Query RAG
curl -X POST http://localhost:8001/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{"query":"What was revenue?"}'
```

---

📁 Project Structure

```
nexaflow-ai/
├── backend/               # Express.js + Prisma
│   ├── src/
│   ├── prisma/
│   └── .env
├── frontend/              # React + Vite
│   ├── src/
│   └── .env
├── llm-service/           # FastAPI + Ollama + ChromaDB
│   └── llm-ms/
├── docker-compose.yml
└── README.md
```

---

🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

📄 License

MIT

---

Acknowledgements

· Ollama for local LLMs
· ChromaDB for vector database
· FastAPI for the LLM microservice
· Razorpay for payment integration

---

```

```
