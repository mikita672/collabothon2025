# routers/admin.py
import hashlib
from datetime import datetime, timezone
from typing import Dict, Any, List

from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/admin", tags=["admin"])

# Карта тикер -> название компании
TICKER_COMPANIES: Dict[str, str] = {
    "MSFT": "Microsoft Corporation",
    "AAPL": "Apple Inc.",
    "TSLA": "Tesla, Inc.",
    "GOOGL": "Alphabet Inc.",
}

# Три заготовленных новости:
# 0 — хорошая, 1 — плохая, 2 — очень плохая
NEWS_TEMPLATES: List[Dict[str, Any]] = [
    {
        # GOOD / POSITIVE
        "ticker": "MSFT",
        "title": "Microsoft announces expanded AI partnership with OpenAI",
        "url": "https://example.com/microsoft-openai-partnership",
        "summary": (
            "Microsoft has announced an expanded multi-year partnership with OpenAI, "
            "including additional investment and deeper integration of GPT-based models "
            "into Azure cloud services and productivity tools."
        ),
        "priceImpact": 8.5,
        "educationalNote": (
            "This type of strategic AI partnership is typically viewed as a strong "
            "positive catalyst, as it supports new revenue streams in cloud and "
            "productivity software, and strengthens competitive positioning in enterprise AI."
        ),
        "relatedTickers": ["GOOGL", "AAPL"],
        "rawSource": "DemoFeedPositive",
    },
    {
        # BAD / MODERATE NEGATIVE
        "ticker": "AAPL",
        "title": "Apple faces production delays for next-generation iPhone models",
        "url": "https://example.com/apple-iphone-production-delays",
        "summary": (
            "Apple has reportedly encountered production delays for its next-generation "
            "iPhone models due to supply chain disruptions at key component suppliers."
        ),
        "priceImpact": -3.0,
        "educationalNote": (
            "Production delays can weigh on short-term revenue expectations and may cause "
            "volatility around upcoming product launches, especially when iPhone sales "
            "are a major driver of the company’s earnings."
        ),
        "relatedTickers": ["TSLA", "MSFT"],
        "rawSource": "DemoFeedNegative",
    },
    {
        # VERY BAD / STRONG NEGATIVE
        "ticker": "TSLA",
        "title": "Tesla announces major vehicle recall over critical safety issue",
        "url": "https://example.com/tesla-major-vehicle-recall",
        "summary": (
            "Tesla has announced a major recall affecting hundreds of thousands of vehicles "
            "worldwide due to a critical safety issue related to the braking system. "
            "Regulators are opening a formal investigation."
        ),
        "priceImpact": -9.0,
        "educationalNote": (
            "Large-scale safety recalls combined with regulatory investigations are usually "
            "interpreted as a strong negative catalyst: they can lead to higher costs, "
            "potential fines, damage to brand reputation, and increased uncertainty about "
            "future demand."
        ),
        "relatedTickers": ["AAPL", "GOOGL"],
        "rawSource": "DemoFeedVeryNegative",
    },
]


def _hash_id(seed: str) -> str:
    """
    Делает стабильный короткий id из строки (URL + timestamp и т.п.).
    """
    return hashlib.sha256(seed.encode("utf-8")).hexdigest()[:12]


@router.get("/test-news")
async def get_test_news(
    variant: int = Query(
        0,
        ge=0,
        le=2,
        description="Index of predefined news: 0=good, 1=bad, 2=very bad",
    )
) -> Dict[str, Any]:
    """
    Админ-эндпоинт: возвращает одну тестовую новость из трёх заготовок.

    variant:
      - 0 → хорошая новость (strong positive)
      - 1 → плохая новость (moderate negative)
      - 2 → очень плохая новость (strong negative)

    Используй на презентации: фронт по кнопке дергает этот роут с нужным variant,
    и «прилетает» соответствующая новость.
    """

    template = NEWS_TEMPLATES[variant]

    main_ticker: str = template["ticker"]
    title: str = template["title"]
    url: str = template["url"]
    summary_val: str = template["summary"]
    price_score: float = template["priceImpact"]
    price_expl: str = template["educationalNote"]
    related: List[str] = template["relatedTickers"]
    raw_source: str = template["rawSource"]

    # текущее время как timestamp
    timestamp = datetime.now(timezone.utc).replace(microsecond=0).isoformat()

    # хэш на основе URL/заголовка + времени
    seed = (url or title) + timestamp
    item_id = _hash_id(seed)

    item: Dict[str, Any] = {
        "id": item_id,
        "title": title,
        "ticker": main_ticker,
        "company": TICKER_COMPANIES.get(main_ticker, main_ticker),
        "sourceUrl": url,
        "timestamp": timestamp,
        "summary": summary_val,
        "priceImpact": price_score,
        "educationalNote": price_expl,
        "relatedTickers": related,
        "rawSource": raw_source,
    }

    return item
