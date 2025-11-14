from typing import List
from fastapi import APIRouter, Query
from services.gemini_summarizer.news_fetch import fetch_financial_news

router = APIRouter(tags=["news"])

@router.get("/news")
def news_endpoint(
    tickers: List[str] = Query(["AAPL","MSFT"]),
    days: int = Query(1, ge=1, le=30),
    max_per_ticker: int = Query(10, ge=1, le=100),
    use_model: int = Query(0, ge=0),
):
    data = fetch_financial_news(tickers=tickers, days=days, max_per_ticker=max_per_ticker, use_model=use_model)
    return {"items": data, "count": len(data)}