from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Allow front-end to connect

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",       # change if needed
        user="root",            # your DB username
        password="Manish1@1999",# your DB password
        database="basic_candidate_management_system",   # the DB where candidates table exists
        port=3306
    )

#CRUD Endpoints
#Read
@app.route('/api/candidates', methods=['GET'])
def get_candidates():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM candidates")
    candidates = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(candidates)

#Create
@app.route('/api/candidates', methods=['POST'])
def add_candidate():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = """
        INSERT INTO candidates (name, email, phone_number, current_status, resume_link)
        VALUES (%s, %s, %s, %s, %s)
    """
    values = (data['name'], data['email'], data['phone_number'], data['current_status'], data['resume_link'])
    cursor.execute(sql, values)
    conn.commit()
    candidate_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return jsonify({"message": "Candidate added successfully", "id": candidate_id}), 201

#Update
@app.route('/api/candidates/<int:id>', methods=['PUT'])
def update_candidate(id):
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = """
        UPDATE candidates
        SET name=%s, email=%s, phone_number=%s, current_status=%s, resume_link=%s
        WHERE id=%s
    """
    values = (data['name'], data['email'], data['phone_number'], data['current_status'], data['resume_link'], id)
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": f"Candidate {id} updated successfully"})

#Delete
@app.route('/api/candidates/<int:id>', methods=['DELETE'])
def delete_candidate(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "DELETE FROM candidates WHERE id=%s"
    cursor.execute(sql, (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": f"Candidate {id} deleted successfully"})

#Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5000)