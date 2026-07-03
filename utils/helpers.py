from groq import Groq

from config import DEMO_MODE, GROQ_API_KEY


def _agent_name(system):
    if "Co-Founder" in system:
        return "Co-Founder AI"
    if "Founder" in system:
        return "Founder AI"
    if "CEO" in system:
        return "CEO AI"
    if "CFO" in system:
        return "CFO AI"
    if "CMO" in system:
        return "CMO AI"
    if "CTO" in system:
        return "CTO AI"
    if "COO" in system:
        return "COO AI"
    if "Creative" in system:
        return "Creative Director AI"
    if "HR" in system:
        return "HR Manager AI"
    return "FinFlow Worker Agent"


def _demo_response(prompt, system):
    agent = _agent_name(system)
    preview = " ".join(prompt.split())[:220]
    return f"""DEMO MODE RESPONSE - {agent}

Executive Readout:
- Processed the uploaded financial context through the FinFlow AI Corporation workflow.
- Identified revenue, expense, risk, and operating-signal themes suitable for recruiter demo review.
- Produced a role-specific recommendation without calling the Groq API.

Agent Focus:
- Role: {agent}
- Source context preview: {preview or "No document text was provided."}

Recommended Next Action:
- Run with DEMO_MODE=false and a valid GROQ_API_KEY for live LLaMA 3.3 70B analysis.
- Keep demo mode enabled when sharing with recruiters so the project runs immediately without secrets."""


def ask_ai(prompt, system="You are an expert AI business agent."):
    if DEMO_MODE:
        return _demo_response(prompt, system)

    if not GROQ_API_KEY:
        raise RuntimeError(
            "Missing GROQ_API_KEY. Set DEMO_MODE=true for recruiter demo mode, or add a Groq key when DEMO_MODE=false."
        )

    client = Groq(api_key=GROQ_API_KEY)
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content


def ask_gemini(prompt):
    return ask_ai(prompt)
