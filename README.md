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
* DNS Records Management: Enter into specific zones and create, view, search and delete DNS records (A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, CAA).
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

## Architecture Overview

For this project, I used a simple, separate design as I wanted everything to be completely decoupled – the front and back end independent and maintainable.

* **Frontend:** A Next.js app (with the App Router) running on Vercel. It is styled in a way to closely mimic the actual AWS Route 53 dashboard, using Tailwind CSS. On the client side, state and routing have been managed, and the client communicates with the server using Axios.
* **Backend:** Built with Python and FastAPI, deployed to Render. Inside it, you will find a neatly wrapped and clean encapsulation of all routing logic, a strict application of all incoming data validation following Pydantic's rules, and safe management of all operations going into the database.
* **Database:** I used an SQLite database, which I was able to connect to the backend via the SQLAlchemy ORM.

## Database Schema

It is a straightforward database, having two primary tables connected via a one-to-many relationship.

**1. Hosted Zones (`zones`)**
* `id`: Integer, Primary Key.
* `name`: String, the actual domain name.
* `description`: String, Optional.
* `type`: String, either public or private.

**2. DNS Records (`records`)**
* `id`: Integer, Primary Key.
* `zone_id`: Integer, Foreign Key (references `zones.id`).
* `name`: String, the subdomain or apex you are creating the DNS record for.
* `record_type`: String (A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, or CAA).
* `value`: String (Target IP or Domain).
* `ttl`: Integer (Time to live in seconds).

## Mocked Sections
The following sections are implemented as placeholders for the Route53 user experience:
* Dashboard
* Traffic Policies
* Health Checks
* Resolver
* Profiles

## API Overview

On the backend, there is a full REST API. It was implemented with FastAPI, which generates interactive API documentation (Swagger UI); hence, you can try the hosted APIs just like you would do on the live server.

**Live API Docs:** 
https://route53-clone-z4m4.onrender.com/docs

Note: The backend is hosted on the Render free tier, so the first API request may experience a "cold start" delay of up to 30 seconds.

Below are the main endpoints included in this project:
* `POST /api/v1/auth/login` - Handles the mock authentication step.
* `GET /api/v1/zones/` - Retrieves a list of all hosted zones.
* `POST /api/v1/zones/` - Creates a brand new hosted zone.
* `DELETE /api/v1/zones/{zone_id}` - Deletes a particular hosted zone.
* `GET /api/v1/zones/{zone_id}/records/` - Lists all DNS records in a given zone.
* `POST /api/v1/zones/{zone_id}/records/` - Creates a new DNS record.
* `DELETE /api/v1/records/{record_id}` - Removes a specific DNS record.