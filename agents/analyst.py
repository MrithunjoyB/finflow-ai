import pdfplumber
import pandas as pd
from utils.helpers import ask_gemini

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def extract_text_from_csv(file_path):
    df = pd.read_csv(file_path)
    return df.to_string()

def analyze_document(file_path):
    if file_path.endswith(".pdf"):
        raw_text = extract_text_from_pdf(file_path)
    elif file_path.endswith(".csv"):
        raw_text = extract_text_from_csv(file_path)
    else:
        return "Unsupported file type"

    prompt = f"""
    You are a financial analyst. Extract the following from this document:
    - All transactions (date, description, amount)
    - Total income
    - Total expenses
    - Net balance

    Document:
    {raw_text}

    Return it in clean structured format.
    """
    return ask_gemini(prompt)