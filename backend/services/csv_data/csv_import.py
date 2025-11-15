import csv
from pathlib import Path
from typing import Dict, Optional

def load_fund_data(ticker: str, data_dir: Optional[Path] = None) -> Dict[str, any]:
    t_clean = ticker.upper().strip()
    if data_dir is None:
        data_dir = Path(__file__).parent.parent.parent / "data"
    file_path = data_dir / f"FundData_{t_clean}.csv"
    if not file_path.exists():
        raise FileNotFoundError(f"CSV not found: {file_path}")

    with file_path.open("r", encoding="utf-8-sig") as f:
        sample = f.read(2048)
        f.seek(0)
        try:
            dialect = csv.Sniffer().sniff(sample)
        except Exception:
            dialect = csv.excel
        reader = csv.reader(f, dialect)

        rows = list(reader)
    if not rows:
        return {"ticker": t_clean, "data": {}, "count": 0}

    header = [h.strip() for h in rows[0]]
    data_rows = rows[1:]

    date_idx = None
    for i, name in enumerate(header):
        if "dates" in name.lower():
            date_idx = i
            break
    if date_idx is None:
        date_idx = 0

    value_idx = None
    for i, name in enumerate(header):
        if i == date_idx:
            continue
        numeric_found = False
        for r in data_rows[:5]:
            if i < len(r):
                try:
                    float(r[i].replace(",", ""))
                    numeric_found = True
                    break
                except Exception:
                    pass
        if numeric_found:
            value_idx = i
            break
    if value_idx is None:
        value_idx = 1 if len(header) > 1 else date_idx

    data_map: Dict[str, float] = {}
    for r in data_rows:
        if len(r) <= max(date_idx, value_idx):
            continue
        date_raw = r[date_idx].strip()
        val_raw = r[value_idx].strip()
        if not date_raw or not val_raw:
            continue
        try:
            val = float(val_raw.replace(",", ""))
        except Exception:
            continue
        data_map[date_raw] = val

    def _date_key(d: str):
        return d
    try:
        if all(len(k) >= 8 and k[4] == "-" for k in data_map.keys()):
            data_map = dict(sorted(data_map.items(), key=lambda kv: kv[0]))
    except Exception:
        pass

    return {
        "ticker": t_clean,
        "data": data_map,
        "count": len(data_map),
        "source_file": str(file_path),
    }

def load_latest_value(ticker: str, data_dir: Optional[Path] = None) -> Optional[float]:
    t_clean = ticker.upper().strip()
    if data_dir is None:
        data_dir = Path(__file__).parent.parent.parent / "data"
    file_path = data_dir / f"FundData_{t_clean}.csv"
    if not file_path.exists():
        raise FileNotFoundError(f"CSV not found: {file_path}")

    with file_path.open("r", encoding="utf-8-sig") as f:
        sample = f.read(2048)
        f.seek(0)
        try:
            dialect = csv.Sniffer().sniff(sample)
        except Exception:
            dialect = csv.excel
        reader = csv.reader(f, dialect)
        rows = list(reader)

    if not rows:
        return None

    header = [h.strip() for h in rows[0]]
    data_rows = rows[1:]

    date_idx = None
    for i, name in enumerate(header):
        if "date" in name.lower():
            date_idx = i
            break
    if date_idx is None:
        date_idx = 0

    value_idx = None
    for i, name in enumerate(header):
        if i == date_idx:
            continue
        for r in data_rows[:5]:
            if i < len(r):
                try:
                    float((r[i] or "").replace(",", ""))
                    value_idx = i
                    break
                except Exception:
                    pass
        if value_idx is not None:
            break
    if value_idx is None:
        value_idx = 1 if len(header) > 1 else date_idx

    last_value: Optional[float] = None
    for r in data_rows:
        if len(r) <= value_idx:
            continue
        raw = (r[value_idx] or "").strip()
        if not raw:
            continue
        try:
            val = float(raw.replace(",", ""))
        except Exception:
            continue
        last_value = val
        
    return last_value