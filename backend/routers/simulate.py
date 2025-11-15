from typing import List, Literal, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from services.average_mu import simulate_price_series, simulate_portfolio, set_last_price, get_last_price
router = APIRouter(tags=["averages"])

class PricesPayload(BaseModel):
    prices: List[float]

class PortfolioSimItem(BaseModel):
    symbol: Optional[str] = None
    price: float = 100
    mu_daily: float = 0.0005
    sigma_daily: float = 0.02
    useStartP0: bool = False
    startP0: float = 100.0
    n_steps: int = 390
    nu: int = 5
    clip_limit: float = 0.05
    seed: Optional[int] = None
    trend: Literal["standard", "up", "down"] = "standard"

class PortfolioPayload(BaseModel):
    portfolio_start: float
    count: int
    configs: List[PortfolioSimItem]
    shares: List[float]

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
    set_last_price(symbol.upper(), res["final_price"])
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
@router.get("/simulate/last/{symbol}")
def get_last_symbol_price(symbol: str):
    data = get_last_price(symbol)
    if not data:
        raise HTTPException(status_code=404, detail="No last price for symbol")
    return data

@router.post("/simulate_portfolio")
def simulate_portfolio_endpoint(body: PortfolioPayload):
    if body.count != len(body.configs) or body.count != len(body.shares):
        raise HTTPException(status_code=400, detail="count mismatch with configs/shares")
    try:
        portfolio_res = simulate_portfolio(
            portfolio_start=body.portfolio_start,
            configs=[cfg.model_dump() for cfg in body.configs],
            shares=body.shares,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return portfolio_res