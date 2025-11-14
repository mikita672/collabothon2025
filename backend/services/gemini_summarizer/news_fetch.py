import datetime as dt
import hashlib
import requests
from typing import List, Dict, Any, Iterable
from services.gemini_summarizer.config import get_newsapi_key
from services.gemini_summarizer.gemini_summarizer import summarize_text
from services.gemini_summarizer.gemini_predict import news_prediction

# Справочник тикеров
TICKER_COMPANIES: Dict[str, str] = {
    "MSFT": "Microsoft",
    "AAPL": "Apple",
    "KO": "Coca-Cola",
    "WMT": "Walmart",
    "PEP": "PepsiCo",
    "JNJ": "Johnson & Johnson",
    "V": "Visa",
    "JPM": "JPMorgan",
    "UNH": "UnitedHealth",
    "XOM": "Exxon Mobil",
    "AMZN": "Amazon",
    "GOOGL": "Alphabet",
    "META": "Meta Platforms",
    "COST": "Costco",
    "DIS": "Disney",
    "INTC": "Intel",
    "CSCO": "Cisco",
    "BA": "Boeing",
    "GE": "General Electric",
    "NKE": "Nike",
    "TSLA": "Tesla",
    "NVDA": "NVIDIA",
    "AMD": "AMD",
    "PLTR": "Palantir",
    "SHOP": "Shopify",
    "SOFI": "SoFi",
    "HOOD": "Robinhood",
    "RBLX": "Roblox",
    "COIN": "Coinbase",
    "RIOT": "Riot Platforms",
}

# Простая эвристика сентимента (можно заменить LLM)
POS_WORDS = {"growth", "beats", "surge", "record", "upgrade", "positive"}
NEG_WORDS = {"falls", "drop", "plunge", "lawsuit", "downgrade", "negative", "loss"}

def _hash_id(source_url: str) -> str:
    return hashlib.sha256(source_url.encode("utf-8")).hexdigest()[:24]

def _chunks(items: List[str], size: int) -> Iterable[List[str]]:
    for i in range(0, len(items), size):
        yield items[i:i+size]

def fetch_financial_news(
    tickers: List[str],
    days: int = 1,
    language: str = "en",
    max_per_ticker: int = 30,
    dedup: bool = True,
    use_model: int = 0,
) -> List[Dict[str, Any]]:
    api_key = get_newsapi_key()
    end = dt.datetime.now(dt.timezone.utc)
    start = end - dt.timedelta(days=days)
    results: List[Dict[str, Any]] = []
    seen_urls = set()

    norm_tickers = [t.upper() for t in tickers if t.upper() in TICKER_COMPANIES]

    base_url = "https://newsapi.org/v2/everything"
    headers = {"X-Api-Key": api_key}

    for group in _chunks(norm_tickers, 5):
        query_parts = []
        for tk in group:
            comp = TICKER_COMPANIES[tk]
            query_parts.append(f'("{comp}" OR {tk})')
        q = " OR ".join(query_parts)

        params = {
            "q": q,
            "language": language,
            "from": start.isoformat(timespec="seconds") + "Z",
            "to": end.isoformat(timespec="seconds") + "Z",
            "sortBy": "publishedAt",
            "pageSize": min(100, max_per_ticker * len(group)),
        }

        resp = requests.get(base_url, params=params, headers=headers, timeout=15)
        if resp.status_code != 200:
            continue
        data = resp.json()
        articles = data.get("articles", [])
        for art in articles:
            url = art.get("url") or ""
            if dedup and url in seen_urls:
                continue
            seen_urls.add(url)

            title = art.get("title") or ""
            desc = art.get("description") or ""
            content = art.get("content") or ""
            combined = f"{title}. {desc} {content}"

            # Определяем связанные тикеры по вхождению названий
            related = []
            low = combined.lower()
            for tk in norm_tickers:
                comp = TICKER_COMPANIES[tk]
                if tk.lower() in low or comp.lower() in low:
                    related.append(tk)

            if not related:
                continue  # фильтруем нерелевантные

            timestamp = art.get("publishedAt") or end.isoformat() + "Z"
            main_ticker = related[0]
            if use_model > 0:
                try:
                    pred = news_prediction(combined)
                    price_expl = pred.get("priceImpactExplanation", "")
                    price_score = float(pred.get("priceImpactScore", 0.0))
                except Exception:
                    price_expl = "No data"
                    price_score = float(0.0)

                try:
                    summary_val = summarize_text(
                        article_text=combined,
                        )
                except Exception:
                    summary_val = desc or title            
                use_model = use_model - 1
            else:
                price_expl = "No data"
                price_score = float(0.0)  
                summary_val = desc or title
            item = {
                "id": _hash_id(url or title + timestamp),
                "title": title,
                "ticker": main_ticker,
                "company": TICKER_COMPANIES[main_ticker],
                "sourceUrl": url,
                "timestamp": timestamp,
                "summary": summary_val,
                "priceImpact": price_score,
                "educationalNote": price_expl,
                "relatedTickers": related,
                "rawSource": art.get("source", {}).get("name"),
            }
            results.append(item)

    # Ограничение количества на тикер
    if max_per_ticker > 0:
        by_ticker: Dict[str, List[Dict[str, Any]]] = {}
        for r in results:
            by_ticker.setdefault(r["ticker"], []).append(r)
        trimmed: List[Dict[str, Any]] = []
        for tk, lst in by_ticker.items():
            trimmed.extend(lst[:max_per_ticker])
        results = trimmed

    # Сортировка по времени (новые сначала)
    results.sort(key=lambda x: x["timestamp"], reverse=True)
    return results