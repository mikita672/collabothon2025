import numpy as np
from typing import Sequence, Optional


def compute_average(nums: Sequence[float]) -> Optional[float]:
    if not nums:
        return None
    arr = np.asarray(nums, dtype=np.float64)
    return float(arr.mean())

def generate_student_t_graph(prices: Sequence[float],
                             points: int = 50,
                             df: int = 5,
                             scale: float = 1.0):
    avg = compute_average(prices)
    if avg is None:
        return {"average": None, "e": [], "y": []}
    e = (scale * np.random.standard_t(df, size=points)).tolist()
    y = [abs(avg + val) for val in e]
    return {"average": avg, "e": e, "y": y}