# Candidate Management System

A full-stack web application to manage candidate information with Create, Read, Update, and Delete (CRUD) functionalities. Built with **FastAPI**, **React**, and **MySQL database**.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Frontend Usage](#frontend-usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Add new candidates
- View all candidates
- Update candidate details
- Delete candidates
- Fully responsive React frontend
- FastAPI backend with MySQL database
- CORS enabled for frontend-backend communication

---

## Technology Stack

- **Frontend:** React 19, Axios
- **Backend:** Python 3.13, FastAPI
- **Database:** MySQL
- **Other Tools:** Uvicorn (FastAPI server), Pydantic (data validation)

---

## Project Structure

```
Phenom_Project/
│
├── backend/                  # FastAPI backend
│   └── main.py               # FastAPI app with CRUD endpoints
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── api.js            # Axios API requests
│   │   └── ...               # React components
│   └── package.json
│
├── venv/                     # Python virtual environment
├── insert_candidate_data.sql  # Initial DB seed data
├── .gitignore
└── README.md
```

---

## Setup & Installation

### **1. Clone the repository**
```bash
git clone https://github.com/ManishKottakki/candidate-management-system.git
cd candidate-management-system
```

### **2. Backend setup**
1. Create a Python virtual environment:
```bash
python -m venv venv
```
2. Activate the virtual environment:
```bash
venv\Scripts\activate      # Windows
source venv/bin/activate   # Mac/Linux
```
3. Install required Python packages:
```bash
pip install fastapi uvicorn mysql-connector-python pydantic
```

### **3. Frontend setup**
1. Navigate to the frontend folder:
```bash
cd frontend
```
2. Install Node.js dependencies:
```bash
npm install
```

---

## Running the Application

### **1. Start the backend**
```bash
uvicorn backend.main:app --reload
```
- Enter your MySQL password when prompted.
- Backend runs at `http://127.0.0.1:8000`.

### **2. Start the frontend**
```bash
cd frontend
npm start
```
- Frontend runs at `http://localhost:3000`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET    | /api/candidates | Get all candidates |
| POST   | /api/candidates | Add a new candidate |
| PUT    | /api/candidates/{id} | Update candidate by ID |
| DELETE | /api/candidates/{id} | Delete candidate by ID |

---

## Frontend Usage

- Uses **Axios** for API requests.
- `api.js` contains all CRUD functions:
```javascript
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

export const getCandidates = () => axios.get(`${BASE_URL}/candidates`);
export const addCandidate = (candidate) => axios.post(`${BASE_URL}/candidates`, candidate);
export const updateCandidate = (id, candidate) => axios.put(`${BASE_URL}/candidates/${id}`, candidate);
export const deleteCandidate = (id) => axios.delete(`${BASE_URL}/candidates/${id}`);
export const getCandidateById = (id) => axios.get(`${BASE_URL}/candidates/${id}`);
```

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Open a pull request

---

## License

This project is licensed under the MIT License.

