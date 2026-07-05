import os

from dotenv import load_dotenv


load_dotenv()


DEMO_MODE = os.getenv("DEMO_MODE", "true").strip().lower() in {"1", "true", "yes", "on"}
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "groq").strip().lower() or "groq"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "").strip()
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1")
PORT = int(os.getenv("PORT", "5050"))
MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", str(16 * 1024 * 1024)))
ALLOWED_EXTENSIONS = {"pdf", "csv", "txt"}
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "data")
