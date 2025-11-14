# config.py
import os
from pathlib import Path
from google import genai
from dotenv import load_dotenv

# Load .env from backend root (up two levels from this file)
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(env_path)


def get_gemini_client() -> genai.Client:
    """
    Создаёт и возвращает клиента Gemini.
    Использует ключ из переменной окружения GOOGLE_API_KEY.
    """
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError(
            "Переменная окружения GOOGLE_API_KEY не задана. "
            "Установи её перед запуском программы."
        )

    client = genai.Client(api_key=api_key)
    return client


def get_newsapi_key() -> str:
    """
    Возвращает ключ NewsAPI из переменной окружения NEWS_API_KEY.
    """
    api_key = os.environ.get("NEWS_API_KEY")
    if not api_key:
        raise RuntimeError(
            "Переменная окружения NEWS_API_KEY не задана. "
            "Установи её перед запуском программы."
        )
    return api_key
    