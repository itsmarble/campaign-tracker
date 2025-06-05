from flask import Flask, request, jsonify, send_from_directory
from flask import g
import sqlite3
import json
from datetime import datetime
import os

app = Flask(__name__, static_folder='static')
DATABASE = 'segments.db'

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS segments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            geojson TEXT NOT NULL,
            team TEXT,
            last_visited TEXT
        );
        """
    )
    db.commit()

@app.before_serving
def setup():
    init_db()

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/segments', methods=['GET'])
def list_segments():
    db = get_db()
    cur = db.execute('SELECT * FROM segments')
    rows = cur.fetchall()
    segments = [dict(id=row['id'], geojson=json.loads(row['geojson']), team=row['team'], last_visited=row['last_visited']) for row in rows]
    return jsonify(segments)

@app.route('/api/segments', methods=['POST'])
def save_segment():
    data = request.get_json()
    seg_id = data.get('id')
    geojson = json.dumps(data['geojson'])
    team = data.get('team')
    last_visited = data.get('last_visited')
    db = get_db()
    if seg_id:
        db.execute('UPDATE segments SET geojson=?, team=?, last_visited=? WHERE id=?',
                   (geojson, team, last_visited, seg_id))
    else:
        db.execute('INSERT INTO segments (geojson, team, last_visited) VALUES (?, ?, ?)',
                   (geojson, team, last_visited))
        seg_id = db.execute('SELECT last_insert_rowid()').fetchone()[0]
    db.commit()
    return jsonify({'id': seg_id})

if __name__ == '__main__':
    app.run(debug=True)
