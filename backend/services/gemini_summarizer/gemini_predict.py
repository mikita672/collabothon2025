# gemini_summarizer.py
import time
import json
import re
from typing import Dict, Any
from services.gemini_summarizer.config import get_gemini_client

_client = get_gemini_client()


def _parse_price_impact(raw: str) -> Dict[str, Any]:
    """
    Разбирает сырое текстовое сообщение от модели и пытается достать:
    - priceImpactExplanation: str
    - priceImpactScore: float

    Обрабатывает случаи:
    - чистый JSON
    - JSON внутри ```json ... ```
    - JSON как подстрока внутри ответа
    - если JSON нет — берёт всё как explanation и последнее число как score
    """
    text = raw.strip()

    # 1) Снимаем markdown-кодблоки ```...``` / ```json ... ```
    if text.startswith("```"):
        lines = text.splitlines()
        # убрать первую линию с ``` или ```json
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        # убрать последнюю линию с ```
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()

    # 2) Пытаемся распарсить как чистый JSON
    try:
        data = json.loads(text)
        if isinstance(data, dict) and (
            "priceImpactExplanation" in data or "priceImpactScore" in data
        ):
            return data
    except json.JSONDecodeError:
        pass

    # 3) Пробуем вытащить первый JSON-объект как подстроку {...}
    m = re.search(r"\{[\s\S]*\}", text)
    if m:
        json_chunk = m.group(0)
        try:
            data = json.loads(json_chunk)
            if isinstance(data, dict):
                return data
        except json.JSONDecodeError:
            pass

    # 4) Фолбэк: возвращаем весь текст как explanation,
    #    а score берём как ПОСЛЕДНЕЕ число в тексте
    matches = list(re.finditer(r"-?\d+(\.\d+)?", text))
    if matches:
        try:
            score = float(matches[-1].group())  # последнее число, а не первое
        except ValueError:
            score = 0.0
    else:
        score = 0.0

    return {
        "priceImpactExplanation": text,
        "priceImpactScore": score,
    }


def news_prediction(
    article_text: str,
    max_retries: int = 3,
    initial_delay: float = 1.0,
) -> Dict[str, Any]:
    """
    Анализирует новость с помощью Gemini и возвращает dict:

    {
      "priceImpactExplanation": <str>,
      "priceImpactScore": <float>
    }

    Обрабатывает 503/overloaded/unavailable с повторными попытками.
    """

    default_response: Dict[str, Any] = {
        "priceImpactExplanation": "No text provided for prediction.",
        "priceImpactScore": 0.0,
    }

    if not article_text or not article_text.strip():
        return default_response

    prompt = (
        "You are an experienced equity market analyst.\n"
        "You will be given a full news article about a publicly traded company.\n"
        "Your task is to:\n"
        "1) give your expert opinion on how this news is likely to affect the company’s stock price,\n"
        "2) provide a single numeric impact score from -10 to 10, where:\n"
        "   -10 = extremely strong negative impact on the stock price,\n"
        "    -5 = clearly negative impact,\n"
        "     0 = no meaningful impact or unclear impact,\n"
        "    +5 = clearly positive impact,\n"
        "   +10 = extremely strong positive impact.\n"
        "\n"
        "Very important:\n"
        "- Focus on short-term price impact (from a few hours up to several days).\n"
        "- Base your reasoning ONLY on the information in the article and general market logic.\n"
        "- Do NOT give trading advice like \"buy\", \"sell\" or \"hold\".\n"
        "- Answer STRICTLY in valid JSON with double quotes and no extra text before or after the JSON.\n"
        "\n"
        "Use the following JSON format exactly:\n"
        "\n"
        "{\n"
        "  \"priceImpactExplanation\": \"Why this news is likely to move the stock price and in which direction.\",\n"
        "  \"priceImpactScore\": 0\n"
        "}\n"
        "\n"
        "Where:\n"
        "- \"priceImpactScore\" is a NUMBER between -10 and 10 (can be fractional, e.g. -3.5 or 7.0).\n"
        "\n"
        "Now read and analyze the following news article:\n"
        "\n"
        f"{article_text}"
    )

    last_error: Exception | None = None

    for attempt in range(max_retries):
        try:
            response = _client.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=prompt,
            )

            raw = getattr(response, "text", "").strip()
            if not raw:
                return {
                    "priceImpactExplanation": "Model did not return any explanation.",
                    "priceImpactScore": 0.0,
                }

            # КЛЮЧЕВОЕ: аккуратно парсим, учитывая ```json``` и вложенный JSON
            data = _parse_price_impact(raw)

            opinion = str(data.get("priceImpactExplanation", "")).strip()
            score_value = data.get("priceImpactScore", 0.0)

            # приводим score к float
            try:
                score = float(score_value)
            except (TypeError, ValueError):
                score = 0.0

            # нормализуем в диапазон [-10, 10]
            if score < -10:
                score = -10.0
            elif score > 10:
                score = 10.0

            if not opinion:
                opinion = "No explanation provided by the model."

            return {
                "priceImpactExplanation": opinion,
                "priceImpactScore": float(score),
            }

        except Exception as e:
            last_error = e
            error_str = str(e)

            if (
                "503" in error_str
                or "overloaded" in error_str.lower()
                or "unavailable" in error_str.lower()
            ) and attempt < max_retries - 1:
                delay = initial_delay * (2 ** attempt)
                print(
                    f"[Attempt {attempt + 1}/{max_retries}] Service unavailable. "
                    f"Retrying in {delay}s..."
                )
                time.sleep(delay)
                continue

            return {
                "priceImpactExplanation": f"Error while calling model: {error_str}",
                "priceImpactScore": 0.0,
            }

    return {
        "priceImpactExplanation": f"Failed to get prediction after {max_retries} attempts: {last_error}",
        "priceImpactScore": 0.0,
    }
