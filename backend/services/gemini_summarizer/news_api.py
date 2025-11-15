import requests
from typing import List, Dict, Optional
from .config import get_gemini_client
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv(Path(__file__).parent.parent.parent / ".env")

BASE_URL = "https://newsapi.org/v2"


def get_newsapi_key() -> str:
    """
    Получает NEWS_API_KEY из переменных окружения.
    """
    api_key = os.getenv("NEWS_API_KEY")
    if not api_key:
        raise RuntimeError(
            "Переменная окружения NEWS_API_KEY не задана. "
            "Установи её перед запуском программы."
        )
    return api_key


def fetch_top_headlines(
    country: str = "us",
    page_size: int = 3,
    category: Optional[str] = None,
    q: Optional[str] = None,
) -> List[Dict]:
    """
    Получает топ-новости из NewsAPI для указанной страны.

    :param country: двухбуквенный код страны (например 'us', 'gb', 'de').
    :param page_size: сколько новостей забрать (максимум 100).
    :param category: категория новостей ('business', 'technology', ...), опционально.
    :param q: строка поиска (доп. фильтр по ключевым словам), опционально.
    :return: список словарей со статьями (как приходит из NewsAPI).
    """
    api_key = get_newsapi_key()
    url = f"{BASE_URL}/top-headlines"

    params = {
        "country": country,
        "pageSize": page_size,
        "apiKey": api_key,
    }
    if category:
        params["category"] = category
    if q:
        params["q"] = q

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()
    articles = data.get("articles") or []
    if not isinstance(articles, list):
        return []

    return articles


def build_article_text(article: Dict) -> str:
    """
    Собирает текст новости из полей title, description и content.
    NewsAPI не всегда отдаёт полный текст, поэтому комбинируем то, что есть.
    """
    title = (article.get("title") or "").strip()
    description = (article.get("description") or "").strip()
    content = (article.get("content") or "").strip()

    parts = [p for p in (title, description, content) if p]
    return "\n\n".join(parts)