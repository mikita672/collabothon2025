# confidence_updater.py
import json
from pathlib import Path
from typing import Dict


DEFAULT_CONFIDENCE_FILE = "company_confidences.json"


def load_confidences(path: str = DEFAULT_CONFIDENCE_FILE) -> Dict[str, float]:
    """
    Загружает словарь {ticker: confidence} из JSON-файла.
    Если файл отсутствует или повреждён — возвращает пустой dict.
    """
    file_path = Path(path)
    if not file_path.exists():
        return {}

    try:
        with file_path.open("r", encoding="utf-8") as f:
            data = json.load(f)
    except (json.JSONDecodeError, OSError):
        return {}

    result: Dict[str, float] = {}
    for ticker, value in data.items():
        try:
            result[str(ticker)] = float(value)
        except (TypeError, ValueError):
            continue

    return result


def save_confidences(confidences: Dict[str, float], path: str = DEFAULT_CONFIDENCE_FILE) -> None:
    """
    Сохраняет словарь {ticker: confidence} в JSON-файл.
    """
    file_path = Path(path)
    file_path.parent.mkdir(parents=True, exist_ok=True)

    serializable = {ticker: round(float(conf), 4) for ticker, conf in confidences.items()}

    with file_path.open("w", encoding="utf-8") as f:
        json.dump(serializable, f, ensure_ascii=False, indent=2)


def apply_news_impact(
    impact_ratings: Dict[str, float],
    path: str = DEFAULT_CONFIDENCE_FILE,
    base_default: float = 0.5,
    mix_base_weight: float = 0.6,
    mix_impact_weight: float = 0.4,
) -> Dict[str, float]:
    """
    Обновляет рейтинг уверенности в компаниях на основе impact последней новости.

    Параметры:
        impact_ratings: {ticker: impact_score}, где impact_score в диапазоне [-10, 10].
                        Это то, что вернула твоя модель news_prediction.
        path: путь к JSON-файлу с confidences.
        base_default: стартовое значение уверенности, если тикер встречается впервые.
        mix_base_weight: вес старой уверенности.
        mix_impact_weight: вес влияния новости.

    Формула:
        impact_norm = (impact_score + 10) / 20  → [-10..10] → [0..1]
        new_conf = mix_base_weight * old_conf + mix_impact_weight * impact_norm

    Возвращает:
        обновлённый словарь {ticker: confidence}, который уже сохранён в JSON.
    """
    confidences = load_confidences(path)

    for ticker, impact_score in impact_ratings.items():
        old_conf = float(confidences.get(ticker, base_default))

        impact_clamped = max(-10.0, min(10.0, float(impact_score)))
        impact_norm = (impact_clamped + 10.0) / 20.0  # -10..10 -> 0..1

        new_conf = mix_base_weight * old_conf + mix_impact_weight * impact_norm
        new_conf = max(0.0, min(1.0, new_conf))

        confidences[ticker] = new_conf

    save_confidences(confidences, path)
    return confidences

