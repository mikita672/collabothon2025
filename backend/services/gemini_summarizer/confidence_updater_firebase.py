# confidence_updater_firebase.py
from typing import Dict

from services.gemini_summarizer.firebase_config import get_firestore_client

COLLECTION_NAME = "comp"


def get_all_confidences() -> Dict[str, float]:
    """
    Читает все документы из коллекции 'comp' и возвращает
    словарь {ticker: confidence}.
    """
    db = get_firestore_client()
    docs = db.collection(COLLECTION_NAME).stream()

    result: Dict[str, float] = {}
    for doc in docs:
        data = doc.to_dict() or {}
        conf = data.get("confidence")
        if conf is None:
            continue
        try:
            result[doc.id] = float(conf)
        except (TypeError, ValueError):
            continue
    return result


def apply_news_impact_firebase(
    impact_ratings: Dict[str, float],
    base_default: float = 0.5,
    mix_base_weight: float = 0.6,
    mix_impact_weight: float = 0.4,
) -> Dict[str, float]:
    """
    Обновляет рейтинг уверенности в компаниях на основе impact последней новости
    и записывает обновлённые значения в Firestore (коллекция 'comp').

    impact_ratings: {ticker: impact_score}, где impact_score в [-10, 10].

    Формула:
        impact_norm = (impact_score + 10) / 20  → [-10..10] -> [0..1]
        new_conf = mix_base_weight * old_conf + mix_impact_weight * impact_norm
    """
    db = get_firestore_client()
    coll_ref = db.collection(COLLECTION_NAME)

    # Текущие значения confidence из Firestore
    existing = get_all_confidences()

    updated: Dict[str, float] = {}
    batch = db.batch()

    for ticker, impact_score in impact_ratings.items():
        # Старое значение (если тикер впервые встречается – base_default)
        old_conf = float(existing.get(ticker, base_default))

        # Нормализуем impact
        impact_clamped = max(-10.0, min(10.0, float(impact_score)))
        impact_norm = (impact_clamped + 10.0) / 20.0  # -10..10 -> 0..1

        # Смешиваем старую уверенность и влияние новости
        new_conf = mix_base_weight * old_conf + mix_impact_weight * impact_norm
        new_conf = max(0.0, min(1.0, new_conf))

        updated[ticker] = new_conf

        doc_ref = coll_ref.document(ticker)
        batch.set(doc_ref, {"confidence": new_conf}, merge=True)

    batch.commit()
    return updated
