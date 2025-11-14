from typing import Dict, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.average_mu import (
    compute_average,
    compute_and_store_average,
    bulk_compute_and_store,
    get_average,
    get_all_averages,
    clear_averages,
)

router = APIRouter(tags=["averages"])

class NumbersPayload(BaseModel):
    numbers: List[float]

class PricesPayload(BaseModel):
    prices: List[float]

class BulkPayload(BaseModel):
    items: Dict[str, List[float]]

@router.post("/average")
def average_endpoint(body: NumbersPayload) -> Dict[str, Optional[float]]:
    return {"average": compute_average(body.numbers)}

@router.post("/averages/{symbol}")
def store_average(symbol: str, body: PricesPayload) -> Dict[str, float]:
    avg = compute_and_store_average(symbol, body.prices)
    if avg is None:
        raise HTTPException(status_code=400, detail="Empty prices")
    return {"symbol": symbol.upper(), "average": avg}

@router.post("/averages/bulk")
def store_bulk(body: BulkPayload) -> Dict[str, float]:
    return bulk_compute_and_store(body.items)

@router.get("/averages/{symbol}")
def read_average(symbol: str) -> Dict[str, float]:
    avg = get_average(symbol)
    if avg is None:
        raise HTTPException(status_code=404, detail="Not found")
    return {"symbol": symbol.upper(), "average": avg}

@router.get("/averages")
def read_all() -> Dict[str, float]:
    return get_all_averages()

@router.delete("/averages")
def clear() -> Dict[str, str]:
    clear_averages()
    return {"status": "cleared"}