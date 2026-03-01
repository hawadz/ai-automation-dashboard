# Agate AI Suite — Content Pipeline Dashboard (Option B)

Agate AI Suite is a full-stack AI-powered content automation dashboard built for internal game studio workflows.

This project was developed as part of the **Agate Technical Test — Option B (Content Pipeline Dashboard)**.

It focuses on delivering a functional end-to-end MVP that integrates real AI services, persistent logging, and a clean dashboard interface within a limited time constraint.

---

## Repository

**GitHub:** https://github.com/hawadz/ai-automation-dashboard

---

## Live Demo

**Deployment Platform:** Vercel  
**Public URL:** *(To be added after deployment)*

---

## Option Chosen

**Option B — Content Pipeline Dashboard**

This option was selected to demonstrate:
- Breadth of feature implementation  
- Real AI API integration  
- Functional end-to-end architecture  
- Clean full-stack structure  
- Production-minded logging system  

---

## Core Features

### 1. Batch Content Generator
Generate multiple structured content items in a single request.

Users can specify:
- Content type (e.g., NPC dialogue, item descriptions, quest summaries)
- Genre
- Tone
- Number of items
- Additional context

**Features:**
- Structured JSON output
- Clean list display
- Persistent logging
- Re-run previous generations
- Search and filter support via Task Logs

*All generations are stored in the database with execution duration and status tracking.*

### 2. Document Summarizer
Summarizes long text into structured output including:
- TL;DR
- Key Points
- Action Items

**Features:**
- Structured JSON response
- Persistent task history
- Error handling for empty inputs
- Clean loading states
- Accessible from centralized logs

### 3. Task Logs & Dashboard
A centralized monitoring system for all AI task executions.

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
- Filtering by type, status, and date
- Dark mode support

*Persistent storage is implemented using SQLite.*

---

## Tech Stack

**Frontend:**
- React (Vite)
- React Router
- Axios
- Custom CSS (responsive & dark mode)

**Backend:**
- Flask
- SQLAlchemy
- SQLite
- OpenAI API (GPT-4o-mini)
- Python-dotenv
- Flask-CORS

**Deployment:**
- Vercel (Frontend)
- Backend deployed separately (if applicable)

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
- Ensure consistent structured outputs

*The `response_format={"type": "json_object"}` parameter was used to enforce JSON compliance.*

### 2. ChatGPT
Used for:
- Debugging backend configuration issues
- Refining prompt structure
- Improving frontend architecture
- Code cleanup and refactoring
- UX optimization suggestions
- Error handling improvements

*AI tools were used as development accelerators while maintaining architectural decisions and implementation control.*

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

Activate virtual environment:
```bash
# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend folder and add your API key:
```env
OPENAI_API_KEY=your_api_key_here
```

Run backend:
```bash
python app.py
```
*Backend runs at: `https://ai-automation-dashboard-production.up.railway.app`*

### 3. Frontend Setup
Navigate to the frontend folder and start the development server:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

---

## Design Decisions

- **Persistent Logging with SQLite:** Although persistence was optional, SQLite was implemented to demonstrate production-oriented architecture.
- **Structured JSON Enforcement:** AI responses are constrained to JSON format to ensure frontend stability and predictable parsing.
- **Separation of Concerns:** Frontend handles UI and state. Backend handles AI orchestration, logging, and analytics.
- **Rerun with Preview:** Users can review previous results before triggering a new API call, preventing accidental API usage.
- **Dashboard Metrics:** Lightweight analytics were added to monitor performance and system usage.

---

## What I Would Improve With More Time

- CSV export for batch results
- Streaming responses
- Adjustable AI parameters (temperature, max tokens)
- Authentication system
- Unit testing (backend endpoints)
- More modular prompt templates
- Deployment of backend to managed cloud service