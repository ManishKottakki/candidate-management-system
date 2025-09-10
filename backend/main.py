from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from pydantic import BaseModel
import getpass

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PASSWORD = getpass.getpass("Enter MySQL password: ")

# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password=DB_PASSWORD,
        database="basic_candidate_management_system",
        port=3306
    )

# Candidate model
class Candidate(BaseModel):
    name: str
    email: str
    phone_number: int
    current_status: str
    resume_link: str

# ------------------ Routes ------------------

# Get all candidates
@app.get("/api/candidates")
def get_candidates():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM candidates")
    rows = cursor.fetchall()
    conn.close()
    return rows

# Add new candidate
@app.post("/api/candidates")
def add_candidate(candidate: Candidate):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO candidates (name, email, phone_number, current_status, resume_link) VALUES (%s, %s, %s, %s, %s)",
        (candidate.name, candidate.email, candidate.phone_number, candidate.current_status, candidate.resume_link),
    )
    conn.commit()
    conn.close()
    return {"message": "Candidate added successfully"}

# Update candidate
@app.put("/api/candidates/{candidate_id}")
def update_candidate(candidate_id: int, candidate: Candidate):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE candidates SET name=%s, email=%s, phone_number=%s, current_status=%s, resume_link=%s WHERE id=%s",
        (candidate.name, candidate.email, candidate.phone_number, candidate.current_status, candidate.resume_link, candidate_id),
    )
    conn.commit()
    conn.close()
    return {"message": "Candidate updated successfully"}

# Delete candidate
@app.delete("/api/candidates/{candidate_id}")
def delete_candidate(candidate_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM candidates WHERE id=%s", (candidate_id,))
    conn.commit()
    conn.close()
    return {"message": "Candidate deleted successfully"}