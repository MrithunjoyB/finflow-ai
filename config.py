import os

from dotenv import load_dotenv


load_dotenv()


GROQ_API_KEY = os.getenv("GROQ_API_KEY")
DEMO_MODE = os.getenv("DEMO_MODE", "true").strip().lower() in {"1", "true", "yes", "on"}
PORT = int(os.getenv("PORT", "5050"))
MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", str(16 * 1024 * 1024)))
ALLOWED_EXTENSIONS = {"pdf", "csv", "txt"}
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "data")
