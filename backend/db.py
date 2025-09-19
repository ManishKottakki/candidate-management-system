import mysql.connector
import os

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD", "Manish1@1999"),  # use env in prod
        database=os.getenv("MYSQL_DB", "basic_candidate_management_system"),
        port=int(os.getenv("MYSQL_PORT", 3306)),
    )