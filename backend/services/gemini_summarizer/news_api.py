# news_api.py
import requests
from typing import List, Dict
from config import get_newsapi_key


def fetch_top_headlines(country: str = "us", page_size: int = 3) -> List[Dict]:
    """
    Gets top headlines from NewsAPI.

    :param country: country code (например, 'us')
    :param page_size: number of articles to fetch
    :return: list of articles as dictionaries
    """
    api_key = get_newsapi_key()
    url = "https://newsapi.org/v2/top-headlines"

    params = {
        "country": country,
        "pageSize": page_size,
        "apiKey": api_key,
    }

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()
    articles = data.get("articles", [])
    return articles


def build_article_text(article: Dict) -> str:
    """
    Collects title, description, and content from an article dict
    and combines them into a single text block.
    """
    title = article.get("title") or ""
    description = article.get("description") or ""
    content = article.get("content") or ""

    parts = [title.strip(), description.strip(), content.strip()]
    parts = [p for p in parts if p]

    return "\n\n".join(parts)
