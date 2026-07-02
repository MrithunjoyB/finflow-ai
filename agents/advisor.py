from utils.helpers import ask_gemini

def generate_advice(analysis_text):
    prompt = f"""
    You are a smart financial advisor AI.
    Based on this financial data, do the following:

    1. Flag any anomalies or unusual transactions
    2. Identify late payment risks
    3. Flag if burn rate is too high
    4. Give 3 specific actionable recommendations
    5. Rate overall financial health: Poor / Fair / Good / Excellent

    Financial Data:
    {analysis_text}

    Be specific, direct, and practical. No generic advice.
    """
    return ask_gemini(prompt)