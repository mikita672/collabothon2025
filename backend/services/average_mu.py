import numpy as np
from typing import Sequence, Optional, Literal

def compute_average(nums: Sequence[float]) -> Optional[float]:
    if not nums:
        return None
    arr = np.asarray(nums, dtype=np.float64)
    return float(arr.mean())

def generate_student_t_graph(
    prices: Sequence[float],
    points: int = 50,
    df: int = 5,
    scale: float = 1.0,
    trend: Literal["flat", "up", "down", "random"] = "flat",
    drift: float = 0.0,
    shock_prob: float = 0.0,
    shock_scale: float = 3.0,
    seed: Optional[int] = None,
    ma_window: int = 10,
    use_ema: bool = False,
    ema_alpha: float = 0.2,
):
    start_avg = compute_average(prices)
    if start_avg is None:
        return {"average": None, "e": [], "y": [], "avg_series": []}

    rng = np.random.default_rng(seed)

    if trend == "up":
        sign = 1.0
    elif trend == "down":
        sign = -1.0
    elif trend == "random":
        sign = float(rng.choice([-1, 1]))
    else:
        sign = 0.0

    e_list: list[float] = []
    y_list: list[float] = []
    avg_series: list[float] = [float(start_avg)]

    per_step_drift = sign * float(drift)
    current_avg = float(start_avg)
    ema_value = current_avg

    for _ in range(points):
        # e = float(scale) * float(rng.standard_t(df))
        e = float(scale) * float(rng.normal(loc=0.0, scale=1.0))
        if shock_prob > 0 and rng.random() < shock_prob:
            e *= float(shock_scale)

        raw_y = current_avg + per_step_drift + e
        y = abs(raw_y)
        y_list.append(float(y))
        e_list.append(float(e))

        if use_ema:
            ema_value = ema_alpha * y + (1 - ema_alpha) * ema_value
            current_avg = float(ema_value)
        else:
            window_slice = y_list[-ma_window:]
            current_avg = float(sum(window_slice)) / len(window_slice)

        avg_series.append(float(current_avg))

    return {
        "average": float(current_avg),
        "e": e_list,
        "y": y_list,
        "avg_series": avg_series,
        "trend_used": trend,
        "drift": per_step_drift,
        "ma_window": ma_window,
        "ema_used": use_ema,
    }