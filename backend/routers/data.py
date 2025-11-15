from typing import List
from fastapi import APIRouter, HTTPException, Query
from services.csv_data.csv_import import load_fund_data, load_latest_value

router = APIRouter(tags=["fund-data"])

@router.get("/fund/{ticker}")
def fund_single(ticker: str):
    """
    Возвращает данные одного тикера из FundData_{TICKER}.csv
    """
    try:
        data = load_fund_data(ticker)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return data

@router.get("/fund")
def fund_multi(tickers: List[str] = Query(..., description="Список тикеров")):
    """
    Возвращает данные нескольких тикеров.
    """
    results = []
    errors = []
    for t in tickers:
        try:
            results.append(load_fund_data(t))
        except FileNotFoundError:
            errors.append(t.upper())
    return {
        "items": results,
        "found": len(results),
        "missing": errors,
    }

@router.get("/fund/{ticker}/latest")
def fund_latest(ticker: str):
    """
    Возвращает последнее числовое значение из FundData_{TICKER}.csv
    """
    try:
        val = load_latest_value(ticker)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    if val is None:
        raise HTTPException(status_code=404, detail="No numeric data found")
    return {"ticker": ticker.upper(), "latest": val}