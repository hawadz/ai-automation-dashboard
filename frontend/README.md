# Agate AI Suite

Agate AI Suite is a simple AI-powered web application built to support basic game development workflows. This project was built as part of a technical assessment.

It provides two main features: **Batch Content Generator** and **Document Summarizer**. The app also logs every execution and shows basic statistics on a centralized dashboard.

## Project Overview

### 1. Batch Content Generator
Generate multiple pieces of structured content in a single request.

Users can specify:
- Content type
- Genre
- Tone
- Number of items
- Additional context

> **Note:** The system stores each generation in a task log and allows users to re-open previous results without regenerating them, saving API costs.

### 2. Document Summarizer
Summarizes long text into structured, easy-to-read formats:
- TL;DR
- Key points
- Action items

> **Note:** Previous summaries are stored and can be revisited through the Task Logs page at any time.

### 3. Task Logs & Dashboard
- Stores the input and output of each task.
- Tracks execution duration for performance monitoring.
- Displays the overall success rate.
- Shows the number of active tasks.
- Allows a "rerun" with a previous result preview before making a new API call.

## Tech Stack

**Frontend:**
- React (Vite)
- React Router
- Axios
- React Bootstrap

**Backend:**
- Flask
- SQLAlchemy
- SQLite
- OpenAI API

## Setup Instructions

### 1. Clone the Repository

    git clone <your-repository-url>
    cd <repository-folder>

### 2. Backend Setup
Create a virtual environment (optional but highly recommended):

    python -m venv venv
    venv\Scripts\activate   # Windows
    source venv/bin/activate # macOS/Linux

Install dependencies:

    pip install -r requirements.txt

Create a .env file in the backend folder and add your API key:

    OPENAI_API_KEY=your_api_key_here

Run the backend server:

    python app.py

*The backend runs on: https://ai-automation-dashboard-production.up.railway.app*

### 3. Frontend Setup
Navigate to the frontend folder:

    cd frontend
    npm install
    npm run dev

*The frontend runs on: http://localhost:5173*

## Deployment

**Public URL:** *(To be added)*

The application will be deployed using a public hosting service such as Vercel, Render, Railway, or Fly.io.

## Time Log

| Task | Estimated Time |
| :--- | :--- |
| Project setup | 2 hours |
| Backend API development | 4 hours |
| Frontend UI implementation | 5 hours |
| Database & logging system | 3 hours |
| Rerun logic & UX improvements | 3 hours |
| Testing & debugging | 2 hours |
| **Total** | **~19 hours** |

## AI Tools Used

- **OpenAI (GPT-4o-mini):** Used for content generation and text summarization.
- **ChatGPT:** Used for development assistance, including debugging, architectural suggestions, and code refinement.

## Notes

- The commit history reflects meaningful development milestones.
- The application stores both input and output for each task to maintain a reliable history.
- The rerun feature previews previous results before regenerating, preventing accidental and unnecessary API calls.