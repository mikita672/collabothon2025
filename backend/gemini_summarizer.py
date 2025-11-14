# gemini_summarizer.py
from config import get_gemini_client


_client = get_gemini_client()


def summarize_text(article_text: str, language: str = "en") -> str:
    """
    Отправляет текст новости в модель Gemini и возвращает краткое резюме.

    :param article_text: исходный текст новости
    :param language: язык ответа ('ru' или 'en' и т.д.)
    """
    if not article_text.strip():
        return "No text provided for summarization."

    if language == "en":
        prompt = (
            "Create a brief summary of the following news article"
            "(2-3 sentences, neutral tone, no personal judgment):\n\n"
            f"{article_text}"
        )
    else:
        prompt = (
            "Summarize the following news article in 2–3 sentences, neutral tone:\n\n"
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
