# AWS Route 53 Clone

A fully functional web application which gives you all the AWS Route 53's core functionalities and user interface.

## Tech Stack:

Frontend:

* Next.js (App Router)
* React
* Tailwind CSS v4
* Axios (for API requests)
* Lucide React (AWS style icons)

Backend:

* Python 3
* FastAPI
* SQLAlchemy (ORM)
* Uvicorn (ASGI server)

Database:

* SQLite

## Features:

* Mock Authentication: Secure login flow with session persistence with localStorage. Restricts access to dashboard routes to unauthenticated systems.
* Hosted Zones Management: Adding, finding, viewing, and removing domains as Zones.
* DNS Records Management: Enter into specific zones and create, view, search and delete DNS records (A, AAAA, CNAME, TXT, MX).
* Real time Search and filtering on Hosted Zones and DNS Records.

## Local Setup Instructions:

### 1. Backend Setup
Go to your projects / backend directory and create your python environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
### 2. Frontend Setup
Open a new terminal window, go to your frontend directory, and start the app:
```bash
cd frontend
npm install
npm run dev
```