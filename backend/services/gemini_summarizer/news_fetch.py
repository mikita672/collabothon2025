import re
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

SOURCE_WHITELIST = {
    s.lower(): s for s in [
        "Observer",
        "Biztoc.com",
        "CNA",
        "Thefly.com",
        "BGR",
        "Gizmodo.com",
        "Financial Post",
        "Next Big Future",
        "CNN",
        "MIT Technology Review",
        "GamesRadar+",
        "Liliputing",
        "Slashdot.org",
        "The Straits Times",
        "SiliconANGLE News",
        "TechRadar",
        "International Business Times",
        "Fortune",
        "Barchart.com",
    ]
}

NON_FINANCE_EXCLUDE = [
    "recipe", "recipes", "horoscope", "celebrity", "gossip", "fashion",
    "movie review", "tv", "television", "entertainment", "sports score",
    "sports scores", "traffic", "local news", "weather", "concert",
    "beauty", "lifestyle", "dating", "puzzle", "crossword", "opinion",
    "op-ed", "editorial", "press release", "sponsored", "advertisement",
    "giveaway", "contest", "travel", "recipes", "league "
]

# Позитивні фінансові маркери
FINANCE_KEYWORDS = [
    "stock", "stocks", "share", "shares", "share price",
    "earnings", "results", "q1", "q2", "q3", "q4", "quarter",
    "revenue", "sales", "profit", "net income", "loss",
    "guidance", "forecast", "outlook",
    "dividend", "payout", "yield",
    "buyback", "repurchase",
    "valuation", "market cap", "market capitalization",
    "ipo", "initial public offering",
    "bond", "debt", "credit rating",
    "funding round", "series a", "series b", "series c",
    "merger", "acquisition", "m&a", "takeover", "deal",
    "analyst", "price target", "pt raised", "pt cut",
    "upgrade", "downgrade", "overweight", "underweight",
    "overperform", "underperform", "neutral rating",
    "regulator", "sec filing", "10-k", "10-q", "8-k",
    "guidance raised", "guidance cut",
    "trading", "pre-market", "after-hours",
    "rally", "selloff", "plunge", "surge", "soars", "slumps"
]

# Патерни для грошей/відсотків: $123, 3.5%, 10 billion, 500m тощо
MONEY_OR_PERCENT_PATTERN = re.compile(
    r"(\$[\d.,]+)|(\b\d+(\.\d+)?\s*(%|percent|percentage)\b)|(\b\d+(\.\d+)?\s*(billion|million|bn|m)\b)"
)

def _hash_id(source_url: str) -> str:
    return hashlib.sha256(source_url.encode("utf-8")).hexdigest()[:24]

def _chunks(items: List[str], size: int) -> Iterable[List[str]]:
    for i in range(0, len(items), size):
        yield items[i:i+size]

def _looks_financial(title: str, desc: str, content: str) -> bool:
    """
    Повертає True, якщо текст схожий на фінансову новину:
    1) НЕ містить явно нефінансових ключових слів (NON_FINANCE_EXCLUDE)
    2) МІСТИТЬ хоча б один фінансовий маркер (FINANCE_KEYWORDS або MONEY_OR_PERCENT_PATTERN)
    """
    text = f"{title} {desc} {content}".lower()

    # 1. Явне відсікання нефінансового контенту
    for bad in NON_FINANCE_EXCLUDE:
        if bad in text:
            return False

    # 2. Позитивні фінансові ключові слова
    has_fin_keyword = any(fin_kw in text for fin_kw in FINANCE_KEYWORDS)

    # 3. Патерни грошей/відсотків/великих сум
    has_money_pattern = bool(MONEY_OR_PERCENT_PATTERN.search(text))

    # Новина вважається фінансовою, якщо є хоча б один позитивний маркер
    return bool(has_fin_keyword or has_money_pattern)

def fetch_financial_news(
    tickers: List[str],
    days: int = 1,
    language: str = "en",
    max_per_ticker: int = 1,
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

            # ← тепер це реально відсікає нефінансові новини
            if not _looks_financial(title, desc, content):
                continue

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

            raw_source = art.get("source", {}).get("name") or ""

            if raw_source.lower() not in SOURCE_WHITELIST:
                continue

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
