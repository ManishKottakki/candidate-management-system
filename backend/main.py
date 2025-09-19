from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
import mysql.connector
from pydantic import BaseModel
import getpass
from typing import Optional, List
from datetime import datetime, timedelta
from .auth import (authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash, require_roles, get_user_from_token, )

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

# --- Job & Application Models ---
class JobIn(BaseModel):
    title: str
    description: Optional[str] = None
    required_skills: Optional[str] = None
    recruiter_id: Optional[int] = None

class JobOut(JobIn):
    id: int
    created_at: Optional[datetime] = None

class ApplicationIn(BaseModel):
    candidate_id: int

class ApplicantOut(BaseModel):
    id: int
    name: str
    email: str
    phone_number: Optional[str] = None
    current_status: Optional[str] = None
    resume_link: Optional[str] = None
    applied_at: Optional[datetime] = None

# Candidate Registration Model
class CandidateRegister(BaseModel):
    name: str
    email: str
    phone_number: str
    resume_link: str

# ------------------ Routes ------------------

# AUTH ROUTES
@app.post("/api/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # OAuth2PasswordRequestForm expects 'username' and 'password' fields (form-encoded)
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"user_id": user["id"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    return {"access_token": token, "token_type": "bearer", "role": user["role"], "user_id": user["id"]}

# Get candidates (listing with role-based access)
@app.get("/api/candidates")
def get_candidates(user=Depends(get_user_from_token)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if user["role"] in ["admin", "recruiter"]:
        cursor.execute("SELECT * FROM candidates")
    elif user["role"] == "manager":
        sql = """
        SELECT c.*
        FROM candidates c
        JOIN applications a ON c.id = a.candidate_id
        JOIN jobs j ON a.job_id = j.id
        WHERE j.manager_id = %s
        """
        cursor.execute(sql, (user["id"],))
    else:
        raise HTTPException(status_code=403, detail="Not allowed")

    candidates = cursor.fetchall()
    cursor.close()
    conn.close()
    return candidates

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
def delete_candidate(candidate_id: int, user=Depends(require_roles("admin"))):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM candidates WHERE id=%s", (candidate_id,))
    conn.commit()
    conn.close()
    return {"message": "Candidate deleted successfully"}

# --- JOB CRUD ---

# GET all jobs
@app.get("/api/jobs", response_model=List[JobOut])
def get_jobs():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, title, description, required_skills, recruiter_id, created_at FROM jobs ORDER BY created_at DESC")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

# GET job by id
@app.get("/api/jobs/{job_id}", response_model=JobOut)
def get_job(job_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, title, description, required_skills, recruiter_id, created_at FROM jobs WHERE id=%s", (job_id,))
    job = cursor.fetchone()
    cursor.close()
    conn.close()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

# POST create job
@app.post("/api/jobs", response_model=JobOut)
def create_job(job: JobIn, user=Depends(require_roles("admin", "recruiter"))):
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "INSERT INTO jobs (title, description, required_skills, recruiter_id) VALUES (%s, %s, %s, %s)"
    cursor.execute(sql, (job.title, job.description, job.required_skills, job.recruiter_id))
    conn.commit()
    job_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {**job.dict(), "id": job_id}

# PUT update job
@app.put("/api/jobs/{job_id}", response_model=JobOut)
def update_job(job_id: int, job: JobIn):
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "UPDATE jobs SET title=%s, description=%s, required_skills=%s, recruiter_id=%s WHERE id=%s"
    cursor.execute(sql, (job.title, job.description, job.required_skills, job.recruiter_id, job_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {**job.dict(), "id": job_id}

# DELETE job
@app.delete("/api/jobs/{job_id}")
def delete_job(job_id: int, user=Depends(require_roles("admin"))):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM jobs WHERE id=%s", (job_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": f"Job {job_id} deleted"}

# --- APPLICATIONS (apply + list applicants) ---

# Candidate applies to a job
@app.post("/api/jobs/{job_id}/apply")
def apply_to_job(job_id: int, application: ApplicationIn):
    candidate_id = application.candidate_id
    conn = get_db_connection()
    cursor = conn.cursor()
    # Optional: check job exists
    cursor.execute("SELECT id FROM jobs WHERE id=%s", (job_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Job not found")
    # Optional: check candidate exists
    cursor.execute("SELECT id FROM candidates WHERE id=%s", (candidate_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Candidate not found")
    try:
        cursor.execute("INSERT INTO applications (candidate_id, job_id) VALUES (%s, %s)", (candidate_id, job_id))
        conn.commit()
    except Exception as e:
        # likely unique constraint violation (already applied)
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))
    cursor.close()
    conn.close()
    return {"message": "Applied successfully", "candidate_id": candidate_id, "job_id": job_id}

# Get all candidates who applied for a job (JOIN)
@app.get("/api/jobs/{job_id}/applicants")
def get_applicants(job_id: int, user=Depends(get_user_from_token)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if user["role"] in ["admin", "recruiter"]:
        sql = """
        SELECT c.*, a.applied_at
        FROM candidates c
        JOIN applications a ON c.id = a.candidate_id
        WHERE a.job_id = %s
        """
        cursor.execute(sql, (job_id,))
    elif user["role"] == "manager":
        sql = """
        SELECT c.*, a.applied_at
        FROM candidates c
        JOIN applications a ON c.id = a.candidate_id
        JOIN jobs j ON a.job_id = j.id
        WHERE a.job_id = %s AND j.manager_id = %s
        """
        cursor.execute(sql, (job_id, user["id"]))
    elif user["role"] == "candidate":
        cursor.execute("SELECT COUNT(*) as total FROM applications WHERE job_id=%s", (job_id,))
        total = cursor.fetchone()
        cursor.close()
        conn.close()
        return {"total_applicants": total["total"]}
    else:
        raise HTTPException(status_code=403, detail="Not allowed")

    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

# Candidate Registration
@app.post("/api/register")
def register_candidate(candidate: CandidateRegister):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "INSERT INTO candidates (name, email, phone_number, current_status, resume_link) VALUES (%s, %s, %s, %s, %s)",
        (candidate.name, candidate.email, candidate.phone_number, "Registered", candidate.resume_link)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"id": new_id, "message": "Candidate registered successfully"}