from utils.helpers import ask_gemini

def generate_report(analysis_text):
    prompt = f"""
    You are a financial reporting expert.
    Based on this financial analysis, generate a clean professional report with:
    
    1. Executive Summary (2-3 lines)
    2. Income vs Expenses Breakdown
    3. Cash Flow Status (Positive/Negative/Neutral)
    4. Top 3 Spending Categories
    5. Month-over-month trend (if data available)

    Analysis Data:
    {analysis_text}

    Format it cleanly with clear sections and bullet points.
    """
    return ask_gemini(prompt)