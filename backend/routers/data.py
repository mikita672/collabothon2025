from typing import List, Literal, Optional
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
def graph_symbol(
    symbol: str,
    body: PricesPayload,
    points: int = Query(50, ge=1, le=1_000_000),
    df: int = Query(5, ge=1, le=200),
    scale: float = Query(1.0, gt=0),
    trend: Literal["flat", "up", "down", "random"] = Query("flat"),
    drift: float = Query(0.0),
    shock_prob: float = Query(0.0, ge=0.0, le=1.0),
    shock_scale: float = Query(3.0, gt=0.0),
    seed: Optional[int] = Query(None),
    ma_window: int = Query(10, ge=1, le=10_000),
    use_ema: bool = Query(False),
    ema_alpha: float = Query(0.2, gt=0.0, lt=1.0),
):
    res = generate_student_t_graph(
        body.prices,
        points=points,
        df=df,
        scale=scale,
        trend=trend,
        drift=drift,
        shock_prob=shock_prob,
        shock_scale=shock_scale,
        seed=seed,
        ma_window=ma_window,
        use_ema=use_ema,
        ema_alpha=ema_alpha,
    )
    if res["average"] is None:
        raise HTTPException(status_code=400, detail="Empty prices")
    return {
        "symbol": symbol.upper(),
        "average": res["average"],
        "y": res["y"],
        "params": {
            "points": points,
            "df": df,
            "scale": scale,
            "trend": trend,
            "drift": drift,
            "shock_prob": shock_prob,
            "shock_scale": shock_scale,
            "seed": seed,
            "ma_window": ma_window,
            "use_ema": use_ema,
            "ema_alpha": ema_alpha,
        },
    }