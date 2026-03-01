import os
import json
import time
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from openai import OpenAI
from sqlalchemy import func

# LOAD ENV
load_dotenv()

app = Flask(__name__)
CORS(app)

# DATABASE CONFIG
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# OPENAI CLIENT
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# DATABASE MODEL
class TaskLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    task_type = db.Column(db.String(50), nullable=False)
    input_parameters = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    error_message = db.Column(db.Text, nullable=True)
    duration = db.Column(db.Float, nullable=True)  # duration in seconds

    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "task_type": self.task_type,
            "input_parameters": json.loads(self.input_parameters),
            "status": self.status,
            "error_message": self.error_message,
            "duration": self.duration
        }

with app.app_context():
    db.create_all()

# HELPER FUNCTION
def log_task(task_type, input_params, status, duration, error_message=None):
    try:
        new_log = TaskLog(
            task_type=task_type,
            input_parameters=json.dumps(input_params),
            status=status,
            duration=duration,
            error_message=error_message
        )
        db.session.add(new_log)
        db.session.commit()
    except Exception as e:
        print(f"Gagal menyimpan log: {e}")

# API ROUTES

# GENERATE
@app.route('/api/generate', methods=['POST'])
def generate_content():
    start_time = time.time()
    data = request.json

    content_type = data.get('content_type', 'NPC dialogue lines')
    genre = data.get('genre', 'Fantasy')
    tone = data.get('tone', 'Neutral')
    count = data.get('count', 3)
    additional_context = data.get('additional_context', '')

    input_params = {
        "content_type": content_type,
        "genre": genre,
        "tone": tone,
        "count": count
    }

    try:
        prompt = f"Generate {count} distinct {content_type} for a {genre} game. The tone should be {tone}. Context: {additional_context}. Return ONLY a JSON object with a key 'results' containing an array of strings."

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a creative assistant for a game studio. Respond in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )

        result_text = response.choices[0].message.content
        result_json = json.loads(result_text)
        items = result_json.get('results', [])

        duration = round(time.time() - start_time, 3)
        log_task('generate', input_params, 'success', duration)

        return jsonify({"success": True, "data": items})

    except Exception as e:
        duration = round(time.time() - start_time, 3)
        log_task('generate', input_params, 'failure', duration, str(e))
        return jsonify({"success": False, "error": str(e)}), 500

# SUMMARIZE
@app.route('/api/summarize', methods=['POST'])
def summarize_document():
    start_time = time.time()
    data = request.json
    text = data.get('text', '')

    input_params = {"text_length": len(text)}

    if not text:
        return jsonify({"success": False, "error": "Text is required"}), 400

    try:
        prompt = "Summarize the following text and return JSON with keys: key_points (array), action_items (array), tldr (string).\n\nText:\n" + text

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Respond in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )

        result_json = json.loads(response.choices[0].message.content)

        duration = round(time.time() - start_time, 3)
        log_task('summarize', input_params, 'success', duration)

        return jsonify({"success": True, "data": result_json})

    except Exception as e:
        duration = round(time.time() - start_time, 3)
        log_task('summarize', input_params, 'failure', duration, str(e))
        return jsonify({"success": False, "error": str(e)}), 500

# GET LOGS
@app.route('/api/logs', methods=['GET'])
def get_logs():
    try:
        logs = TaskLog.query.order_by(TaskLog.timestamp.desc()).all()
        return jsonify({"success": True, "data": [log.to_dict() for log in logs]})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# DASHBOARD STATS 
@app.route('/api/dashboard-stats', methods=['GET'])
def dashboard_stats():
    try:
        total_tasks = TaskLog.query.count()
        generated_count = TaskLog.query.filter_by(task_type='generate').count()
        success_count = TaskLog.query.filter_by(status='success').count()

        success_rate = 0
        if total_tasks > 0:
            success_rate = round((success_count / total_tasks) * 100)

        active_today = TaskLog.query.filter(
            func.date(TaskLog.timestamp) == datetime.utcnow().date()
        ).count()

        avg_duration = db.session.query(func.avg(TaskLog.duration)).scalar()
        avg_duration = round(avg_duration, 3) if avg_duration else 0

        return jsonify({
            "generated": generated_count,
            "success_rate": success_rate,
            "active_tasks": active_today,
            "avg_duration": f"{avg_duration}s"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)