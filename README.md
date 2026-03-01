# Agate AI Suite - Content Pipeline Dashboard (Option B)

Agate AI Suite is a full-stack AI-powered content automation dashboard built for internal game studio workflows.

This project was developed as part of the **Agate Technical Test - Option B (Content Pipeline Dashboard)**.

It delivers a functional end-to-end MVP integrating real AI services, persistent logging, dashboard analytics, and a clean full-stack architecture within a limited time constraint.

---

## Repository

**GitHub:**
https://github.com/hawadz/ai-automation-dashboard

---

## Live Demo

**Frontend (Vercel):**
https://ai-automation-dashboard-fj44.vercel.app

**Backend (Railway):**
https://ai-automation-dashboard-production.up.railway.app

---

## Option Chosen

**Option B - Content Pipeline Dashboard**

This option was selected to demonstrate:
- Breadth of feature implementation
- Real AI API integration
- Functional end-to-end architecture
- Clean separation of frontend and backend
- Persistent logging with analytics
- Production-minded deployment setup

---

## Core Features

### 1. Batch Content Generator
Generate multiple structured content items in a single request.

**Users can specify:**
- Content type (NPC dialogue, item descriptions, quest summaries)
- Genre
- Tone
- Number of items
- Additional context

**Features:**
- Structured JSON output
- Clean list display
- Persistent logging
- Re-run previous generations
- Search and filter via Task Logs
- Duration tracking per execution

*All generations are stored in the database with execution duration and status tracking.*

---

### 2. Document Summarizer
Summarizes long text into structured output:
- TL;DR
- Key Points
- Action Items

**Features:**
- Structured JSON response
- Persistent task history
- Error handling for empty inputs
- Clean loading states
- Centralized log access
- Execution duration tracking

---

### 3. Task Logs & Dashboard
Centralized monitoring system for all AI task executions.

**Each task stores:**
- Timestamp
- Task type
- Input parameters
- Output data
- Status (success / failure)
- Execution duration

**Dashboard metrics include:**
- Total generations
- Success rate
- Tasks executed today
- Average execution duration

**Additional capabilities:**
- Re-run previous tasks
- Delete logs
- Pagination
- Search functionality
- Filtering by type and status
- Dark mode support

*Persistent storage is implemented using SQLite.*

---

## Tech Stack

**Frontend:**
- React (Vite)
- React Router
- Axios
- Custom CSS (responsive + dark mode)

**Backend:**
- Flask
- SQLAlchemy
- SQLite
- OpenAI API (GPT-4o-mini)
- Python-dotenv
- Flask-CORS

**Deployment:**
- Vercel (Frontend)
- Railway (Backend)

---

## Time Log

**Start Time:** 2026-02-25 09:00 WIB  
**End Time:** 2026-02-25 17:10 WIB  
**Total Working Time:** ~7 hours 40 minutes  

| Activity | Duration |
| :--- | :--- |
| Project setup & environment configuration | 1 hour |
| Backend API structure & OpenAI integration | 2 hours |
| Database model & persistent logging system | 1 hour |
| Batch Content Generator implementation | 1 hour |
| Document Summarizer implementation | 50 minutes |
| Task Logs (filter, search, pagination, rerun) | 1 hour |
| Dashboard metrics & analytics | 40 minutes |
| UI polish, dark mode & UX refinement | 30 minutes |
| Debugging & deployment preparation | 30 minutes |

---

## AI Tools Used

This technical test intentionally leveraged AI-assisted development as encouraged in the instructions.

### 1. OpenAI (GPT-4o-mini)
Used for:
- Content generation
- Structured summarization
- JSON-formatted outputs
- Prompt engineering refinement

Prompts were structured to:
- Enforce valid JSON responses
- Reduce hallucinations
- Ensure predictable structured outputs

*The parameter `response_format={"type": "json_object"}` was used to enforce strict JSON compliance.*

---

### 2. ChatGPT
Used for:
- Debugging backend deployment issues (Railway & environment configuration)
- Refining prompt structure
- Improving frontend architecture
- Code cleanup and refactoring
- UX improvements
- Error handling improvements
- Deployment troubleshooting

*AI tools were used as development accelerators while maintaining architectural decisions and implementation ownership.*

---

## Setup Instructions

### 1. Clone Repository
```bash
git clone [https://github.com/hawadz/ai-automation-dashboard](https://github.com/hawadz/ai-automation-dashboard)
cd ai-automation-dashboard
```

### 2. Backend Setup
Create virtual environment:
```bash
python -m venv venv
```

Activate environment:
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Create `.env` file inside backend folder:
```env
OPENAI_API_KEY=your_api_key_here
```

Run backend:
```bash
python app.py
```
* **Local backend runs at:** `http://localhost:5000`
* **Production backend:** `https://ai-automation-dashboard-production.up.railway.app`

### 3. Frontend Setup
Navigate to frontend:
```bash
cd frontend
npm install
npm run dev
```
* **Local frontend runs at:** `http://localhost:5173`
* **Production frontend:** `https://ai-automation-dashboard-fj44.vercel.app`

---

## Design Decisions
- **Persistent logging with SQLite** to demonstrate production-oriented architecture.
- **Structured JSON enforcement** to ensure frontend stability.
- **Clear separation of concerns** between UI and AI orchestration.
- **Execution duration tracking** for performance monitoring.
- **Re-run preview mechanism** to prevent unnecessary API usage.
- **Dashboard analytics** for monitoring system health and usage.

---

## What I Would Improve With More Time
- CSV export for batch results
- Adjustable AI parameters (temperature, max tokens)
- Streaming responses
- Authentication & role management
- Unit testing for backend endpoints
- Modular prompt templates
- Containerization (Docker) for more scalable deployment
- Replace SQLite with managed database for production scaling