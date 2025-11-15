# trading_engine.py
from dataclasses import dataclass
from typing import Dict, List, Any


@dataclass
class Company:
    ticker: str
    name: str
    price: float  # текущая цена одной акции


def generate_trades(
    wallet_amount: float,
    holdings: Dict[str, int],
    companies: List[Company],
    confidences: Dict[str, float],
    max_company_share: float = 0.25,
    min_buy_confidence: float = 0.5,
    max_sell_confidence: float = 0.3,
) -> Dict[str, Any]:
    """
    Чистая функция "покупка/продажа" по рейтингу уверенности (confidences).

    НИЧЕГО не знает о Firebase, JSON и т.д.
    """
    current_wallet = float(wallet_amount)
    current_holdings: Dict[str, int] = dict(holdings or {})

    company_map: Dict[str, Company] = {c.ticker: c for c in companies}
    orders: List[Dict[str, Any]] = []

    # Сначала продажи
    for ticker, shares in list(current_holdings.items()):
        if shares <= 0:
            continue

        conf = float(confidences.get(ticker, 0.0))
        company = company_map.get(ticker)
        if company is None or company.price <= 0:
            continue

        if conf < max_sell_confidence:
            trade_value = shares * company.price
            current_wallet += trade_value
            current_holdings[ticker] = 0

            orders.append(
                {
                    "ticker": ticker,
                    "company": company.name,
                    "side": "sell",
                    "sharesDelta": -shares,
                    "tradeValue": round(trade_value, 2),
                    "price": company.price,
                    "confidence": conf,
                }
            )

    # Потом покупки
    buy_candidates: List[Company] = []
    for c in companies:
        conf = float(confidences.get(c.ticker, 0.0))
        if conf >= min_buy_confidence and c.price > 0:
            buy_candidates.append(c)

    if current_wallet > 0 and buy_candidates:
        total_weight = sum(confidences.get(c.ticker, 0.0) for c in buy_candidates)

        if total_weight > 0:
            for c in buy_candidates:
                conf = float(confidences.get(c.ticker, 0.0))
                weight = conf / total_weight

                target_amount = current_wallet * weight
                company_cap = wallet_amount * max_company_share
                target_amount = min(target_amount, company_cap, current_wallet)

                if target_amount <= 0 or c.price <= 0:
                    continue

                shares_to_buy = int(target_amount // c.price)
                if shares_to_buy <= 0:
                    continue

                trade_value = shares_to_buy * c.price
                if trade_value > current_wallet:
                    continue

                current_wallet -= trade_value
                current_holdings[c.ticker] = current_holdings.get(c.ticker, 0) + shares_to_buy

                orders.append(
                    {
                        "ticker": c.ticker,
                        "company": c.name,
                        "side": "buy",
                        "sharesDelta": shares_to_buy,
                        "tradeValue": round(trade_value, 2),
                        "price": c.price,
                        "confidence": conf,
                    }
                )

    # HOLD для остальных
    for c in companies:
        if any(o["ticker"] == c.ticker for o in orders):
            continue
        conf = float(confidences.get(c.ticker, 0.0))
        orders.append(
            {
                "ticker": c.ticker,
                "company": c.name,
                "side": "hold",
                "sharesDelta": 0,
                "tradeValue": 0.0,
                "price": c.price,
                "confidence": conf,
            }
        )

    return {
        "initialWallet": float(wallet_amount),
        "finalWallet": round(current_wallet, 2),
        "initialHoldings": dict(holdings or {}),
        "finalHoldings": current_holdings,
        "orders": orders,
        "notes": (
            "Heuristic simulation based on per-ticker confidence. "
            "Not financial advice."
        ),
    }
