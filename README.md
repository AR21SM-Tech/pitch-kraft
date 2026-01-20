# PitchKraft

## Overview

PitchKraft is an automated cold outreach platform that leverages generative AI and retrieval-augmented generation (RAG) to synthesize hyper-personalized emails. By scraping job descriptions and semantically matching them against a portfolio database, the system generates high-conversion outreach messages using the AIDA (Attention, Interest, Desire, Action) framework. This solution significantly reduces the manual effort required for business development while maintaining high relevance and personalization.

## Research and Architecture

The application is architected as a decoupled monorepo system to ensure scalability and separation of concerns.

### Frontend Architecture
The user interface is built with **Next.js 14** (App Router), utilizing React Server Components for optimal performance.
*   **State Management**: Complex form state and asynchronous polling are handled via React Hooks.
*   **Styling System**: Tailwind CSS coupled with the shadcn/ui component library provides a consistent, accessible design system.
*   **Networking**: The frontend communicates with the backend services via a RESTful API layer.

### Backend Architecture
The core logic resides in a high-performance **Python FastAPI** service.
*   **LLM Inference**: Utilizes Groq's LPU inference engine to run Llama-3-70B models with sub-second latency.
*   **Vector Search (RAG)**: Implements a semantic search engine using ChromaDB and OpenAI Embeddings. This allows the system to retrieve relevance-scored portfolio items based on job description keywords.
*   **Data Ingestion**: A custom scraping pipeline (BeautifulSoup/LangChain) parses unstructured web content into structured JSON schemas (Role, Skills, Experience).

## Technology Stack

*   **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
*   **Backend**: Python 3.10, FastAPI, Uvicorn
*   **AI/ML**: LangChain, Groq SDK (Llama-3), OpenAI Embeddings
*   **Database**: ChromaDB (Vector Store)

## Installation and Setup

### 1. Backend Configuration

Navigate to the backend directory and set up the Python environment.

```bash
cd backend
python -m venv venv
# Activate the virtual environment
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory with the following credentials:
```env
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
```

Start the FastAPI server:
```bash
uvicorn main:app --reload
```
The server will initialize on `http://localhost:8000`.

### 2. Frontend Configuration

Navigate to the frontend directory and install dependencies.

```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:3000`.

## Usage Guide

1.  Ensure both the backend API and frontend dev server are running.
2.  Input a target job URL (e.g., from a company career page or job board).
3.  The system will scrape the content, analyze the requirements, and retrieve relevant portfolio capabilities.
4.  A generated email based on the AIDA framework will be presented for review.

## License

This project is licensed under the MIT License.
