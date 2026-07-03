import os
from uuid import uuid4

import pandas as pd
import pdfplumber
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename

from config import (
    ALLOWED_EXTENSIONS,
    DEMO_MODE,
    GROQ_API_KEY,
    MAX_CONTENT_LENGTH,
    PORT,
    UPLOAD_DIR,
)
from corporation import run_corporation
from services.task_router import detect_task_type


app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH
CORS(app)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_text(file_path):
    extension = file_path.rsplit(".", 1)[-1].lower()

    if extension == "pdf":
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text

    if extension == "csv":
        df = pd.read_csv(file_path)
        return df.to_string()

    if extension == "txt":
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()

    return ""


@app.route("/api/health")
@app.route("/health")
def health():
    return jsonify(
        {
            "status": "AI Corporation Online",
            "demo_mode": DEMO_MODE,
            "allowed_extensions": sorted(ALLOWED_EXTENSIONS),
        }
    )


@app.route("/api/analyze", methods=["POST"])
@app.route("/analyze", methods=["POST"])
def analyze():
    if not DEMO_MODE and not GROQ_API_KEY:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Missing GROQ_API_KEY. Set DEMO_MODE=true for recruiter demo mode, or add a Groq key when DEMO_MODE=false.",
                }
            ),
            400,
        )

    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file uploaded."}), 400

    file = request.files["file"]
    filename = secure_filename(file.filename)

    if not filename:
        return jsonify({"success": False, "error": "Invalid filename."}), 400

    if not allowed_file(filename):
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Unsupported file type. Upload a PDF, CSV, or TXT file.",
                }
            ),
            400,
        )

    run_id = uuid4().hex
    run_dir = os.path.join(UPLOAD_DIR, run_id)
    os.makedirs(run_dir, exist_ok=True)
    path = os.path.join(run_dir, filename)
    file.save(path)

    try:
        raw_data = extract_text(path)
        routing = detect_task_type(raw_data)
        full_analysis = _as_bool(request.form.get("full_analysis", "true"))
        results = run_corporation(
            raw_data,
            run_id=run_id,
            full_analysis=full_analysis,
        )
        return jsonify(
            {
                "success": True,
                "run_id": run_id,
                "routing": routing,
                "full_analysis": full_analysis,
                **results,
            }
        )
    except Exception as exc:
        return jsonify({"success": False, "run_id": run_id, "error": str(exc)}), 500


def _as_bool(value):
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


if __name__ == "__main__":
    app.run(debug=True, port=PORT)
