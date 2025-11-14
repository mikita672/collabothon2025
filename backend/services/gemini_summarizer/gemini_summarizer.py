# gemini_summarizer.py
from services.gemini_summarizer.config import get_gemini_client

_client = get_gemini_client()


def summarize_text(
    article_text: str,
    language: str = "en",
    summary_size: str = "medium",
) -> str:
    """
    Отправляет текст новости в модель Gemini и возвращает краткое резюме.

    :param article_text: исходный текст новости
    :param language: язык ответа ('en', 'ru' и т.д.), по умолчанию 'en'
    :param summary_size: 'short' | 'medium' | 'long' – желаемая длина резюме
    """

    if not article_text or not article_text.strip():
        return "No text provided for summarization."

    # Нормализуем размер резюме
    size = (summary_size or "medium").lower()
    if size not in {"short", "medium", "long"}:
        size = "medium"

    # Описание длины в человеко-понятном виде
    if size == "short":
        length_hint = "1–2 sentences"
    elif size == "long":
        length_hint = "4–6 sentences"
    else:  # medium
        length_hint = "2–3 sentences"

    if language == "ru":
        prompt = (
            f"Сделай краткое резюме следующей новости на русском языке. "
            f"Используй {length_hint}, нейтральный тон, без личных оценок:\n\n"
            f"{article_text}"
        )
    else:
        # По умолчанию – английский
        prompt = (
            f"Write a concise summary of the following news article in English. "
            f"Use {length_hint}, neutral tone, and avoid personal opinions:\n\n"
            f"{article_text}"
        )

    response = _client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    summary = getattr(response, "text", "").strip()
    if not summary:
        summary = "Model did not return a summary."

    return summary
