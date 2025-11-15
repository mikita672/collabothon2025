# routers/gemini.py
from typing import List, Literal
import re
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from services.gemini_summarizer.gemini_summarizer import summarize_text
from services.gemini_summarizer.news_api import fetch_top_headlines, build_article_text
from services.gemini_summarizer.config import get_gemini_client


router = APIRouter(prefix="/api/gemini", tags=["gemini"])

_gemini_client = get_gemini_client()

class SummarizeRequest(BaseModel):
    text: str
    language: str = "en"
    summary_size: Literal["short", "medium", "long"] = "medium"

class SummarizeResponse(BaseModel):
    summary: str

class NewsInsight(BaseModel):
    id: str
    title: str
    ticker: str
    sentiment: Literal["positive", "negative", "neutral"]
    priceImpact: float
    timestamp: str
    company: str
    summary: str
    sourceUrl: str
    educationalNote: str

def _extract_ticker_from_title(title: str) -> str:
    """
    Примитивная попытка вытащить тикер из заголовка.
    Например: 'Apple (AAPL) announces...' -> 'AAPL'.
    Если не получилось — возвращаем пустую строку.
    """
    if not title:
        return ""

    # Ищем что-то в скобках, типа (AAPL)
    match = re.search(r"\(([A-Z]{1,5})\)", title)
    if match:
        return match.group(1)

    # Альтернатива: можно добавить свои эвристики здесь
    return ""

def _extract_company_from_title(title: str) -> str:
    """
    Временный способ получить название компании — первые 1–3 слова заголовка.
    Потом можно заменить на что-то умнее.
    """
    if not title:
        return ""
    words = title.split()
    return " ".join(words[:3])

def _estimate_price_impact(article_text: str) -> float:
    """
    Спрашиваем у Gemini, какой возможный процентный эффект на цену.
    Просим вернуть число в процентах, вытаскиваем первое число из ответа.
    """
    if not article_text.strip():
        return 0.0

    prompt = (
        "You are a financial analyst. Based on the following news article, "
        "estimate the short-term price impact on the company's stock. "
        "Return a single number in percent (can be negative), without any text. "
        "Example: 2.5 or -1.3\n\n"
        f"{article_text}"
    )

    response = _gemini_client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
    )
    raw = getattr(response, "text", "").strip()

    # Ищем первое число в ответе
    match = re.search(r"-?\d+(\.\d+)?", raw)
    if not match:
        return 0.0
    try:
        return float(match.group())
    except ValueError:
        return 0.0


def _generate_educational_note() -> str:
    """
    Заглушка для будущего educationalNote.
    Пока возвращаем пустую строку.
    """
    return ""

@router.post("/summarize", response_model=SummarizeResponse)
async def summarize(request: SummarizeRequest) -> SummarizeResponse:
    """
    Простая суммаризация произвольного текста.
    Фронт отправляет { text, language, summary_size }.
    """
    summary = summarize_text(
        article_text=request.text,
        language=request.language,
        summary_size=request.summary_size,
    )
    return SummarizeResponse(summary=summary)

@router.get("/summarize/test", response_model=SummarizeResponse)
async def test_summarize() -> SummarizeResponse:
    """
    Тестовый эндпоинт: дергаем summarize_text на фиксированной новости.
    Удобно проверить, что Gemini работает.
    """
    sample_article = (
        "Apple has announced a new AI chip designed specifically for the next "
        "generation of iPhones, promising significant improvements in on-device "
        "machine learning performance and power efficiency. Analysts say this "
        "could strengthen Apple's competitive position in mobile AI."
    )

    summary = summarize_text(
        article_text=sample_article,
        language="en",
        summary_size="medium",
    )
    return SummarizeResponse(summary=summary)

@router.get("/top-news", response_model=List[NewsInsight])
async def get_top_news(
    country: str = Query("us", description="Two-letter country code, e.g. 'us'"),
    limit: int = Query(5, ge=1, le=20, description="How many news items to fetch"),
    summary_size: Literal["short", "medium", "long"] = Query(
        "medium", description="Size of generated summary"
    ),
) -> List[NewsInsight]:
    """
    Получаем топ-новости из NewsAPI, для каждой новости:
    - собираем title, url, publishedAt
    - строим полный текст (title + description + content)
    - генерируем короткий summary через Gemini
    - оцениваем priceImpact через отдельный prompt к Gemini
    - формируем JSON в формате, удобном фронту
    """
    articles = fetch_top_headlines(country=country, page_size=limit)
    results: List[NewsInsight] = []

    for idx, article in enumerate(articles, start=1):
        title = article.get("title") or ""
        source_url = article.get("url") or ""
        timestamp = article.get("publishedAt") or ""

        ticker = _extract_ticker_from_title(title)
        company = _extract_company_from_title(title)

        # Полный текст для анализа
        article_text = build_article_text(article)

        # Краткое резюме
        summary = summarize_text(
            article_text=article_text,
            language="en",
            summary_size=summary_size,
        )

        # Временно считаем все новости нейтральными
        sentiment: Literal["positive", "negative", "neutral"] = "neutral"

        # Оценка влияния на цену
        price_impact = _estimate_price_impact(article_text)

        educational_note = _generate_educational_note()

        insight = NewsInsight(
            id=str(idx),
            title=title,
            ticker=ticker,
            sentiment=sentiment,
            priceImpact=price_impact,
            timestamp=timestamp,
            company=company,
            summary=summary,
            sourceUrl=source_url,
            educationalNote=educational_note,
        )
        results.append(insight)

    return results