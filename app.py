from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DATABASE = "database.db"

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            note TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route("/notes", methods=["GET"])
def get_notes():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, note FROM notes ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    notes = []
    for row in rows:
        notes.append({
            "id": row["id"],
            "note": row["note"]
        })

    return jsonify(notes), 200

@app.route("/notes", methods=["POST"])
def add_note():
    data = request.get_json()

    if not data or "note" not in data:
        return jsonify({"message": "Note is required"}), 400

    note = data["note"].strip()

    if not note:
        return jsonify({"message": "Note cannot be empty"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO notes (note) VALUES (?)", (note,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Note saved successfully"}), 201

@app.route("/notes/<int:note_id>", methods=["PUT"])
def edit_note(note_id):
    data = request.get_json()

    if not data or "note" not in data:
        return jsonify({"message": "Note is required"}), 400

    note = data["note"].strip()

    if not note:
        return jsonify({"message": "Note cannot be empty"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE notes SET note = ? WHERE id = ?", (note, note_id))
    conn.commit()
    conn.close()

    return jsonify({"message": "Note updated successfully"}), 200

@app.route("/notes/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM notes WHERE id = ?", (note_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Note deleted successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)