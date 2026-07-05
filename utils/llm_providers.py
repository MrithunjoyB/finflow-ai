import contextlib
from contextvars import ContextVar
from typing import Optional

import requests

from config import (
    ANTHROPIC_API_KEY,
    GEMINI_API_KEY,
    GROQ_API_KEY,
    LLM_PROVIDER,
    OLLAMA_BASE_URL,
    OLLAMA_MODEL,
    OPENAI_API_KEY,
    OPENROUTER_API_KEY,
)


SUPPORTED_PROVIDERS = ["groq", "openai", "anthropic", "gemini", "openrouter", "ollama"]
REQUEST_FORCE_DEMO = ContextVar("finflow_force_demo", default=None)
PLACEHOLDER_VALUES = {
    "none",
    "null",
    "undefined",
    "placeholder",
    "your_groq_api_key_here",
    "your_groq_key_here",
    "your_openai_key_here",
    "your_anthropic_key_here",
    "your_gemini_key_here",
    "your_openrouter_key_here",
}


def is_valid_secret(value):
    if value is None:
        return False

    secret = str(value).strip()
    if not secret:
        return False

    normalized = secret.lower()
    if normalized in PLACEHOLDER_VALUES:
        return False
    if normalized.startswith("your_"):
        return False
    if "api_key_here" in normalized:
        return False
    if "your_" in normalized and "_key" in normalized:
        return False

    return True


def get_available_providers():
    available = []
    if is_valid_secret(GROQ_API_KEY):
        available.append("groq")
    if is_valid_secret(OPENAI_API_KEY):
        available.append("openai")
    if is_valid_secret(ANTHROPIC_API_KEY):
        available.append("anthropic")
    if is_valid_secret(GEMINI_API_KEY):
        available.append("gemini")
    if is_valid_secret(OPENROUTER_API_KEY):
        available.append("openrouter")
    if str(OLLAMA_BASE_URL or "").strip():
        available.append("ollama")
    return available


def get_active_provider():
    configured = (LLM_PROVIDER or "groq").strip().lower()
    available = get_available_providers()
    if configured in available:
        return configured
    return None


def is_live_available():
    return get_active_provider() is not None


@contextlib.contextmanager
def request_force_demo(force_demo):
    token = REQUEST_FORCE_DEMO.set(force_demo)
    try:
        yield
    finally:
        REQUEST_FORCE_DEMO.reset(token)


def get_request_force_demo():
    return REQUEST_FORCE_DEMO.get()


def call_llm(prompt: str, system: str = "You are an expert AI business agent.", provider: Optional[str] = None):
    active_provider = provider or get_active_provider()
    if not active_provider:
        raise RuntimeError("Live LLM Mode is not available. Configure a valid LLM provider API key or switch to Demo Mode.")

    active = active_provider.strip().lower()
    if active not in SUPPORTED_PROVIDERS:
        raise RuntimeError(
            f"Unsupported LLM provider '{active}'. Supported providers: {', '.join(SUPPORTED_PROVIDERS)}."
        )

    if active == "groq":
        return _call_groq(prompt, system)
    if active == "openai":
        return _call_openai(prompt, system)
    if active == "anthropic":
        return _call_anthropic(prompt, system)
    if active == "gemini":
        return _call_gemini(prompt, system)
    if active == "openrouter":
        return _call_openrouter(prompt, system)
    if active == "ollama":
        return _call_ollama(prompt, system)

    raise RuntimeError(f"Provider {active} is not implemented.")


def _call_groq(prompt, system):
    if not is_valid_secret(GROQ_API_KEY):
        raise RuntimeError("Provider groq is selected but GROQ_API_KEY is missing.")
    try:
        from groq import Groq
    except ImportError as exc:
        raise RuntimeError("Provider groq is configured but required package 'groq' is not installed.") from exc

    client = Groq(api_key=GROQ_API_KEY)
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content


def _call_openai(prompt, system):
    if not is_valid_secret(OPENAI_API_KEY):
        raise RuntimeError("Provider openai is selected but OPENAI_API_KEY is missing.")
    try:
        from openai import OpenAI
    except ImportError as exc:
        raise RuntimeError("Provider openai is configured but required package 'openai' is not installed.") from exc

    client = OpenAI(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content


def _call_anthropic(prompt, system):
    if not is_valid_secret(ANTHROPIC_API_KEY):
        raise RuntimeError("Provider anthropic is selected but ANTHROPIC_API_KEY is missing.")
    try:
        from anthropic import Anthropic
    except ImportError as exc:
        raise RuntimeError("Provider anthropic is configured but required package 'anthropic' is not installed.") from exc

    client = Anthropic(api_key=ANTHROPIC_API_KEY)
    response = client.messages.create(
        model="claude-3-5-haiku-latest",
        max_tokens=1200,
        system=system,
        messages=[{"role": "user", "content": prompt}],
    )
    return "".join(block.text for block in response.content if getattr(block, "type", "") == "text")


def _call_gemini(prompt, system):
    if not is_valid_secret(GEMINI_API_KEY):
        raise RuntimeError("Provider gemini is selected but GEMINI_API_KEY is missing.")
    try:
        import google.generativeai as genai
    except ImportError as exc:
        raise RuntimeError("Provider gemini is configured but required package 'google-generativeai' is not installed.") from exc

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=system)
    response = model.generate_content(prompt)
    return response.text


def _call_openrouter(prompt, system):
    if not is_valid_secret(OPENROUTER_API_KEY):
        raise RuntimeError("Provider openrouter is selected but OPENROUTER_API_KEY is missing.")
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "FinFlow AI Corporation",
        },
        json={
            "model": "openai/gpt-4o-mini",
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
        },
        timeout=60,
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


def _call_ollama(prompt, system):
    if not OLLAMA_BASE_URL:
        raise RuntimeError("Provider ollama is selected but OLLAMA_BASE_URL is missing.")
    response = requests.post(
        f"{OLLAMA_BASE_URL.rstrip('/')}/api/chat",
        json={
            "model": OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
            "stream": False,
        },
        timeout=120,
    )
    response.raise_for_status()
    return response.json()["message"]["content"]
