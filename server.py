from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import pdfplumber
from corporation import run_corporation

app = Flask(__name__)
CORS(app)

def extract_text(file_path):
    if file_path.endswith(".pdf"):
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text
    elif file_path.endswith(".csv"):
        df = pd.read_csv(file_path)
        return df.to_string()
    return "No data"

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file'}), 400
    file = request.files['file']
    os.makedirs('data', exist_ok=True)
    path = f"data/{file.filename}"
    file.save(path)
    try:
        raw_data = extract_text(path)
        results = run_corporation(raw_data)
        return jsonify({'success': True, **results})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health():
    return jsonify({'status': 'AI Corporation Online'})

if __name__ == '__main__':
    app.run(debug=True, port=5050)