from typing import List
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from services.average_mu import compute_average, generate_student_t_graph

router = APIRouter(tags=["averages"])

class PricesPayload(BaseModel):
    prices: List[float]

@router.post("/average")
def average_endpoint(body: PricesPayload):
    avg = compute_average(body.prices)
    if avg is None:
        raise HTTPException(status_code=400, detail="Empty prices")
    return {"average": avg}

@router.post("/graph/{symbol}")
def graph_symbol(symbol: str,
                 body: PricesPayload,
                 points: int = Query(50, ge=1, le=1000),
                 df: int = Query(5, ge=1, le=100),
                 scale: float = Query(1.0, gt=0)):
    result = generate_student_t_graph(body.prices, points=points, df=df, scale=scale)
    if result["average"] is None:
        raise HTTPException(status_code=400, detail="Empty prices")
    return {
        "symbol": symbol.upper(),
        "average": result["average"],
        "e": result["e"],
        "y": result["y"],
        "params": {"points": points, "df": df, "scale": scale}
    }