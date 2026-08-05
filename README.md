# 📝 A Developer's Guide to the Notes App

Welcome! This is a simple, beginner-friendly **Full-Stack CRUD Notes Application**. 

I built this project to serve as a clear, clean example of how to connect a modern **React (Vite)** frontend to a **Python FastAPI** backend, storing data in a **MySQL** database. If you're learning how to stitch these technologies together, you're in the right place!

---

## 🏗️ How it Fits Together

Before diving into the code, here is how the data flows through the application:

```text
  [ React Frontend ]  <─── Axios (HTTP) ───>  [ FastAPI Backend ]  <─── SQLAlchemy ORM ───>  [ MySQL Database ]
     (App.jsx)                                    (main.py)                  (models.py)           (notes_db)
```

1. **Frontend (React + Vite):** Renders the user interface. It triggers API requests using `axios` when you type, display, edit, or delete notes.
2. **Backend (FastAPI):** A high-performance Python API that listens for HTTP requests, validates incoming data schemas via Pydantic, and calls database CRUD helpers.
3. **Database (MySQL + SQLAlchemy):** Persists your notes. SQLAlchemy acts as our Object-Relational Mapper (ORM), letting us write Python code instead of raw SQL queries.

---

## 📂 Project Blueprint

Here is a quick walkthrough of the files and why they exist:

```text
notes-app/
├── backend/
│   ├── main.py          # The entry point: sets up FastAPI, configures CORS, and handles routes
│   ├── database.py      # Establishes the connection to MySQL and manages database sessions
│   ├── models.py        # Defines what a "Note" looks like in the MySQL database (SQLAlchemy Model)
│   ├── schemas.py       # Defines data shapes for API requests/responses (Pydantic Models)
│   ├── crud.py          # Contains clean helper functions for database actions (Create, Read, Update, Delete)
│   ├── setup.sql        # A quick SQL script to build the database if you want to run it manually
│   └── requirements.txt # Python packages needed to run the API
│
└── frontend/
    ├── index.html       # The HTML wrapper for our React SPA
    ├── vite.config.js   # Vite configuration (runs on http://localhost:5173 by default)
    └── src/
        ├── main.jsx     # Renders the React application into the index.html DOM root
        ├── App.jsx      # The heart of the frontend: manages all shared state (notes, inputs, loading states)
        ├── App.css      # All styling for the app (written in clean, plain CSS)
        ├── components/
        │   ├── NoteInput.jsx     # Handles note typing, submitting, and triggering list updates
        │   ├── NoteCard.jsx      # Individual card component showing the note text, edit, and delete options
        │   ├── NoteList.jsx      # Loops over notes and displays them, handling empty and loading states
        │   └── StatusMessage.jsx # Renders success and error banners at the top of the page
        └── services/
            └── notesApi.js       # Centralised Axios HTTP calls to the backend
```

---

## 🚀 Getting Started

To run this application locally, you will need:
* **Node.js** (v18 or newer) & **npm** (v9 or newer)
* **Python** (v3.10 or newer)
* **MySQL 8** running on your local machine

---

### Step 1: Database Setup

First, let's create the database. Open your MySQL client (Workbench, CLI, DBeaver, etc.) and run:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS notes_db;
USE notes_db;

-- Create table (SQLAlchemy will also auto-generate this on backend start, but good to have!)
CREATE TABLE IF NOT EXISTS notes (
    id      INT  AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL
);
```
*(Alternatively, you can just run `source backend/setup.sql;` in your MySQL console)*.

---

### Step 2: Backend Setup

Navigate into the `backend` directory, set up a Python virtual environment, and install the dependencies:

```bash
# Go to backend
cd backend

# Create a virtual environment to keep dependencies isolated
python -m venv venv

# Activate the virtual environment
# On Windows (PowerShell):
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

#### Database Configuration
Open [database.py](backend/database.py) and update the `DATABASE_URL` with your MySQL username and password:
```python
DATABASE_URL = "mysql+pymysql://<YOUR_USER>:<YOUR_PASSWORD>@localhost/notes_db"
```

#### Spin up the Server
Run the FastAPI development server with `uvicorn`:
```bash
uvicorn main:app --reload
```
The API will start running at **http://localhost:8000**.
* **Interactive Docs:** FastAPI automatically generates documentation for you! Go to **http://localhost:8000/docs** to see and test the API in your browser.

---

### Step 3: Frontend Setup

Open a new terminal window, navigate to the `frontend` directory, install packages, and start Vite:

```bash
# Go to frontend
cd frontend

# Install node packages
npm install

# Start the React app in development mode
npm run dev
```
Open **http://localhost:5173** in your web browser. You should see the Notes App interface!

---

## 🔌 API Reference

Here is a quick cheat sheet of the backend endpoints available:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/` | Simple health-check to verify the server is running |
| **GET** | `/notes` | Retrieves all notes in the database (ordered oldest to newest) |
| **POST** | `/notes` | Creates a new note. Request body: `{"message": "string"}` |
| **PUT** | `/notes/{id}` | Updates an existing note by its ID. Request body: `{"message": "string"}` |
| **DELETE**| `/notes/{id}` | Deletes a note by its ID |

### Direct Testing via curl
Want to test the backend API from your terminal? Run this:
```bash
curl -X POST http://localhost:8000/notes \
  -H "Content-Type: application/json" \
  -d '{"message": "Testing the API directly!"}'
```

---

## 💡 Key Architectural Notes

* **CORS (Cross-Origin Resource Sharing):** Because the frontend (`localhost:5173`) and the backend (`localhost:8000`) run on different ports, modern web browsers block requests between them by default. We configure CORS middleware in [main.py](backend/main.py) to explicitly allow incoming traffic from Vite.
* **React State Management:** All major app states (list of notes, input text, current editing note, and API loading states) are centralized in [App.jsx](frontend/src/App.jsx). This makes data flow predictable: parent components handle API calls, and child components consume actions via callbacks.

---

## 🛠️ Troubleshooting Guide

| Problem | Root Cause | Solution |
| :--- | :--- | :--- |
| `Access denied for user 'root'@'localhost'` | Incorrect MySQL credentials | Update the `DATABASE_URL` string in [database.py](backend/database.py) with your actual password. |
| `Unknown database 'notes_db'` | Database doesn't exist | Make sure you've run the `CREATE DATABASE notes_db;` command in your MySQL terminal. |
| React app shows CORS error in Console | Backend is offline or misconfigured | Check if your FastAPI terminal is running on port 8000. |
| `ModuleNotFoundError` in Python | Python packages not installed | Activate the virtual environment (`venv`) and run `pip install -r requirements.txt`. |
| React page is blank / loads forever | node_modules missing | Run `npm install` inside the `frontend` folder, and make sure no JS compilation errors exist. |

---

Have fun coding and extending this project! If you want to add user authentication, tag support, or categories, this codebase is designed to be easily extensible. 🚀
