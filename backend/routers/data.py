from typing import List, Literal, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from services.average_mu import compute_average, simulate_price_series

router = APIRouter(tags=["averages"])

class PricesPayload(BaseModel):
    prices: List[float]

@router.post("/average")
def average_endpoint(body: PricesPayload):
    avg = compute_average(body.prices)
    if avg is None:
        raise HTTPException(status_code=400, detail="Empty prices")
    return {"average": avg}

@router.post("/simulate/{symbol}")
def simulate_symbol(
    symbol: str,
    price: float,
    mu_daily: float = Query(0.0005),
    sigma_daily: float = Query(0.02, gt=0),
    n_steps: int = Query(390, ge=1, le=1_000_000),
    nu: int = Query(5, ge=1, le=200),
    clip_limit: float = Query(0.05, gt=0),
    useStartP0: bool = Query(False),
    startP0: float = Query(100.0, gt=0),
    seed: Optional[int] = Query(None),
    trend: Literal["standard", "up", "down"] = Query("standard"),
):
    try:
        res = simulate_price_series(
            P0=price,
            mu_daily=mu_daily,
            sigma_daily=sigma_daily,
            useStartP0=useStartP0,
            startP0=startP0,
            n_steps=n_steps,
            nu=nu,
            clip_limit=clip_limit,
            seed=seed,
            trend=trend,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {
        "symbol": symbol.upper(),
        "final_price": res["final_price"],
        "change_rate": res["change_rate"],
        "prices": res["prices"],
        "params": {
            "mu_daily": mu_daily,
            "sigma_daily": sigma_daily,
            "n_steps": n_steps,
            "nu": nu,
            "clip_limit": clip_limit,
            "useStartP0": useStartP0,
            "startP0": startP0,
            "seed": seed,
            "trend": trend
        },
    }