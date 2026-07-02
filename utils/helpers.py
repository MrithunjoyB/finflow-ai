import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

def ask_ai(prompt, system="You are an expert AI business agent."):
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

# Keep backward compat
def ask_gemini(prompt):
    return ask_ai(prompt)