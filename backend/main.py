# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv

# Candidate Schema (Pydantic)
class Candidate(BaseModel):
    name: str
    email: str
    phone_number: Optional[str]
    current_status: Optional[str]
    resume_link: Optional[str]

# Initialize app
app = FastAPI()

# Allow front-end (React) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to ["http://localhost:3000"] for React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PASSWORD = os.getenv("DB_PASSWORD", "your_default_password")

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password=DB_PASSWORD,
        database="basic_candidate_management_system",
        port=3306
    )

# -------------------------------
# CRUD Endpoints
# -------------------------------

# Read (GET all candidates)
@app.get("/api/candidates")
def get_candidates():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM candidates")
    candidates = cursor.fetchall()
    cursor.close()
    conn.close()
    return candidates

# Create (POST a new candidate)
@app.post("/api/candidates")
def add_candidate(candidate: Candidate):
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = """
        INSERT INTO candidates (name, email, phone_number, current_status, resume_link)
        VALUES (%s, %s, %s, %s, %s)
    """
    values = (candidate.name, candidate.email, candidate.phone_number,
              candidate.current_status, candidate.resume_link)
    cursor.execute(sql, values)
    conn.commit()
    candidate_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"message": "Candidate added successfully", "id": candidate_id}

# Update (PUT a candidate by ID)
@app.put("/api/candidates/{id}")
def update_candidate(id: int, candidate: Candidate):
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = """
        UPDATE candidates
        SET name=%s, email=%s, phone_number=%s, current_status=%s, resume_link=%s
        WHERE id=%s
    """
    values = (candidate.name, candidate.email, candidate.phone_number,
              candidate.current_status, candidate.resume_link, id)
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": f"Candidate {id} updated successfully"}

# Delete (DELETE a candidate by ID)
@app.delete("/api/candidates/{id}")
def delete_candidate(id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "DELETE FROM candidates WHERE id=%s"
    cursor.execute(sql, (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": f"Candidate {id} deleted successfully"}