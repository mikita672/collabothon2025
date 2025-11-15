# portfolio_api_firebase.py
from typing import Dict, Any, List

from fastapi import FastAPI
from pydantic import BaseModel

from services.gemini_summarizer.firebase_config import get_firestore_client
from services.gemini_summarizer.confidence_updater_firebase import (
    apply_news_impact_firebase,
    get_all_confidences,
)
from services.gemini_summarizer.trade import Company, generate_trades


app = FastAPI(title="Firebase Portfolio API")

SAMPLE_COMPANIES: List[Company] = [
    Company("MSFT", "Microsoft", 420.0),
    Company("AAPL", "Apple", 200.0),
    Company("TSLA", "Tesla", 250.0),
    Company("NVDA", "NVIDIA", 900.0),
]


class ImpactRequest(BaseModel):
    impacts: Dict[str, float]


class TradeRequest(BaseModel):
    wallet: float
    holdings: Dict[str, int]


@app.get("/health")
async def health() -> Dict[str, str]:
    db = get_firestore_client()
    _ = db.collections()  # просто ping
    return {"status": "ok"}


@app.get("/confidences")
async def get_confidences_api() -> Dict[str, float]:
    return get_all_confidences()


@app.post("/apply-impact")
async def apply_impact_api(body: ImpactRequest) -> Dict[str, float]:
    updated = apply_news_impact_firebase(body.impacts)
    return updated


@app.post("/trade")
async def trade_api(body: TradeRequest) -> Dict[str, Any]:
    confidences = get_all_confidences()
    result = generate_trades(
        wallet_amount=body.wallet,
        holdings=body.holdings,
        companies=SAMPLE_COMPANIES,
        confidences=confidences,
    )
    return result
