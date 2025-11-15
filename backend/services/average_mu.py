import numpy as np
from typing import Sequence, Optional, Literal, Union, List, Dict, Any
import math

_last_prices: Dict[str, float] = {} 

def set_last_price(symbol: str, price: float) -> None:
    _last_prices[symbol.upper()] = float(price)

def get_last_price(symbol: str) -> Optional[float]:
    return _last_prices.get(symbol.upper())

def get_all_last_prices() -> Dict[str, float]:
    return dict(_last_prices)

def clear_last_prices() -> None:
    _last_prices.clear()

def simulate_price_series(
    P0: float,
    mu_daily: float,
    sigma_daily: float,
    useStartP0: bool = False,
    startP0 : float = 100, # значение на старт торгов
    n_steps: int = 390,
    nu: int = 5,
    clip_limit: float = 0.05,
    seed: Optional[int] = None,
    trend: Literal["standard", "up", "down"] = "standard",
) -> np.ndarray:

    
    rng = np.random.default_rng(seed)

    mu_step = mu_daily / n_steps
    sigma_step = sigma_daily / np.sqrt(n_steps)

    trend_log_step = math.log(1.0 + 0.0025)
    if trend == "up":
        mu_step += trend_log_step
    elif trend == "down":
        mu_step -= trend_log_step

    # draw all noises at once (heavy-tailed), clip extremes
    eps = rng.standard_t(df=nu, size=n_steps) * sigma_step
    eps = np.clip(eps, -clip_limit, clip_limit)

    price = np.empty(n_steps, dtype=float)
    price[0] = P0 * np.exp(mu_step + eps[0])

    for t in range(1, n_steps):
        price[t] = price[t - 1] * np.exp(mu_step + eps[t])
    if useStartP0:
        change_rate = (price[-1] - startP0) / startP0
    else:
        change_rate = (price[-1] - P0) / P0

    prices = price.tolist()
    return {
        "prices": prices,
        "final_price": price[-1],
        "change_rate": change_rate
    }
def simulate_portfolio(
    portfolio_start: float,
    configs: List[Dict[str, Any]],
    shares: List[Union[int, float]],
) -> Dict[str, Any]:
    """
    configs: список словарей с параметрами для simulate_price_series:
      {
        "price": float (P0) ИЛИ "prices": [..] (возьмём среднее),
        "mu_daily": float,
        "sigma_daily": float,
        "useStartP0": bool,
        "startP0": float,
        "n_steps": int,
        "nu": int,
        "clip_limit": float,
        "seed": int|None,
        "trend": "standard"|"up"|"down",
        "symbol": "STRING" (опционально)
      }
    shares: количество купленных акций для каждого конфига.
    """
    if len(configs) != len(shares):
        raise ValueError("configs length != shares length")
    if not configs:
        raise ValueError("empty configs")

    simulations: List[Dict[str, Any]] = []
    n_steps_ref: Optional[int] = None

    for idx, cfg in enumerate(configs):
        price_field = cfg.get("price")
        prices_arr = cfg.get("prices")
        if prices_arr is not None and isinstance(prices_arr, (list, tuple)):
            if len(prices_arr) == 0:
                raise ValueError("empty prices array in config index {}".format(idx))
            P0 = float(np.asarray(prices_arr, dtype=np.float64).mean())
        elif price_field is not None:
            P0 = float(price_field)
        else:
            raise ValueError("config index {} must have 'price' or 'prices'".format(idx))

        sim = simulate_price_series(
            P0=P0,
            mu_daily=float(cfg.get("mu_daily", 0.0005)),
            sigma_daily=float(cfg.get("sigma_daily", 0.02)),
            useStartP0=bool(cfg.get("useStartP0", False)),
            startP0=float(cfg.get("startP0", 100.0)),
            n_steps=int(cfg.get("n_steps", 390)),
            nu=int(cfg.get("nu", 5)),
            clip_limit=float(cfg.get("clip_limit", 0.05)),
            seed=cfg.get("seed"),
            trend=cfg.get("trend", "standard"),
        )
        sim["symbol"] = cfg.get("symbol", f"ASSET_{idx+1}")
        sim["shares"] = float(shares[idx])
        simulations.append(sim)

        steps_now = len(sim["prices"])
        if n_steps_ref is None:
            n_steps_ref = steps_now
        elif n_steps_ref != steps_now:
            raise ValueError("all simulations must have same n_steps")

    # Расчёт портфельного временного ряда: сумма(price_t_i * shares_i)
    portfolio_series: List[float] = []
    for t in range(n_steps_ref):
        total = 0.0
        for sim in simulations:
            total += sim["prices"][t] * sim["shares"]
        portfolio_series.append(total)

    final_value = portfolio_series[-1]
    change_rate = (final_value - portfolio_start) / portfolio_start if portfolio_start > 0 else 0.0

    return {
        "portfolio_start": float(portfolio_start),
        "portfolio_final_value": float(final_value),
        "portfolio_change_rate": float(change_rate),
        "portfolio_series": portfolio_series,
        "components": simulations,
    }