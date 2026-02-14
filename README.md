# Student Academic Development Platform

An AI-powered web application for student academic development, tracking, and coaching recommendations.

## Tech Stack

*   **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, ShadCN UI
*   **Backend**: FastAPI, SQLAlchemy, Pydantic
*   **Database**: PostgreSQL, Redis
*   **AI**: Scikit-learn, XGBoost

## Prerequisites

*   Docker & Docker Compose
*   Node.js 18+ (for local frontend dev)
*   Python 3.9+ (for local backend dev)

## Getting Started

### Using Docker (Recommended)

1.  Clone the repository.
2.  Run `docker-compose up --build`.
3.  Access the frontend at `http://localhost:3000`.
4.  Access the backend API docs at `http://localhost:8000/docs`.

### Local Development

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```
