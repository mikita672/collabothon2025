import numpy as np
from typing import Sequence, Dict, Optional
from threading import RLock

_AVG_CACHE: Dict[str, float] = {}
_LOCK = RLock()

def compute_average(nums: Sequence[float]) -> Optional[float]:
    if not nums:
        return None
    arr = np.asarray(nums, dtype=np.float64)
    return float(arr.mean())

def compute_and_store_average(symbol: str, prices: Sequence[float]) -> Optional[float]:
    avg = compute_average(prices)
    if avg is None:
        return None
    key = symbol.upper()
    with _LOCK:
        _AVG_CACHE[key] = avg
    return avg

def bulk_compute_and_store(data: Dict[str, Sequence[float]]) -> Dict[str, float]:
    results: Dict[str, float] = {}
    with _LOCK:
        for sym, prices in data.items():
            avg = compute_average(prices)
            if avg is not None:
                key = sym.upper()
                _AVG_CACHE[key] = avg
                results[key] = avg
    return results

def get_average(symbol: str) -> Optional[float]:
    key = symbol.upper()
    with _LOCK:
        return _AVG_CACHE.get(key)

def get_all_averages() -> Dict[str, float]:
    with _LOCK:
        return dict(_AVG_CACHE)

def get_all_averages_str(decimals: int = 1) -> Dict[str, str]:
    with _LOCK:
        return {k: f"{v:.{decimals}f}" for k, v in _AVG_CACHE.items()}

def clear_averages() -> None:
    with _LOCK:
        _AVG_CACHE.clear()