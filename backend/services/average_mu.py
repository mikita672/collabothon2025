import numpy as np
from typing import Sequence, Optional, Literal
import math

def compute_average(nums: Sequence[float]) -> Optional[float]:
    if not nums:
        return None
    arr = np.asarray(nums, dtype=np.float64)
    return float(arr.mean())

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