# gemini_summarizer.py
import time
from typing import Dict, Any
from services.gemini_summarizer.config import get_gemini_client

_client = get_gemini_client()


def summarize_text(
    article_text: str,
    summary_size: str = "medium",
    max_retries: int = 3,
    initial_delay: float = 1.0,
) -> Dict[str, Any]:
    """
    Отправляет текст новости в модель Gemini и возвращает краткое резюме
    в JSON-совместимом виде:

    {
        "summary": "<текст резюме>"
    }

    При 503 / overloaded / unavailable делает несколько повторных попыток
    с экспоненциальной задержкой.

    :param article_text: исходный текст новости
    :param summary_size: 'short' | 'medium' | 'long' – желаемая длина резюме
    :param max_retries: максимальное количество попыток (по умолчанию 3)
    :param initial_delay: начальная задержка перед повтором в секундах (по умолчанию 1.0)
    """

    # дефолтный ответ, чтобы формат всегда был предсказуем
    default_response: Dict[str, Any] = {
        "summary": "No text provided for summarization."
    }

    if not article_text or not article_text.strip():
        return default_response

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

    prompt = (
        "Write a concise summary of the following news article in English. "
        f"Use {length_hint}, neutral tone, and avoid personal opinions. "
        "Return only the summary text, without any JSON or additional comments.\n\n"
        f"{article_text}"
    )

    last_error: Exception | None = None

    for attempt in range(max_retries):
        try:
            response = _client.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=prompt,
            )

            summary_text = getattr(response, "text", "").strip()
            if not summary_text:
                summary_text = "Model did not return a summary."

            return {"summary": summary_text}

        except Exception as e:
            last_error = e
            error_str = str(e)

            # Если это 503 / overloaded / unavailable — пробуем ещё раз
            if (
                "503" in error_str
                or "overloaded" in error_str.lower()
                or "unavailable" in error_str.lower()
            ) and attempt < max_retries - 1:
                delay = initial_delay * (2 ** attempt)  # 1s, 2s, 4s...
                print(
                    f"[Attempt {attempt + 1}/{max_retries}] Service unavailable. "
                    f"Retrying in {delay}s..."
                )
                time.sleep(delay)
                continue

            # Другие ошибки или попытки кончились — возвращаем JSON с текстом ошибки
            return {
                "summary": f"Error while summarizing: {error_str}"
            }

    # если вдруг цикл завершился без return
    return {
        "summary": f"Failed to generate summary after {max_retries} attempts: {last_error}"
    }
