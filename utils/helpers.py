from config import DEMO_MODE
from utils.llm_providers import call_llm, get_active_provider, get_request_force_demo


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
- Configure at least one LLM provider API key in .env for Live Mode.
- Keep demo mode enabled when sharing with recruiters so the project runs immediately without secrets."""


def ask_ai(prompt, system="You are an expert AI business agent.", force_demo=None, provider=None):
    request_force_demo = get_request_force_demo()
    if force_demo is None:
        force_demo = request_force_demo

    use_demo = DEMO_MODE if force_demo is None else bool(force_demo)
    if use_demo:
        return _demo_response(prompt, system)

    return call_llm(prompt, system=system, provider=provider or get_active_provider())


def ask_gemini(prompt):
    return ask_ai(prompt)
