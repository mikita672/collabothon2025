from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_summarizer.gemini_summarizer import summarize_text


router = APIRouter(prefix="/summarize", tags=["gemini"])


class SummarizeRequest(BaseModel):
    text: str
    language: str = "en"


class SummarizeResponse(BaseModel):
    summary: str


@router.post("", response_model=SummarizeResponse)
async def summarize(request: SummarizeRequest) -> SummarizeResponse:
    """
    Summarize text using Gemini API.
    
    - **text**: The article text to summarize
    - **language**: Language for response ('en' or 'ru', default 'en')
    """
    summary = summarize_text(request.text, language=request.language)
    return SummarizeResponse(summary=summary)


@router.get("/test", response_model=SummarizeResponse)
async def test_summarize() -> SummarizeResponse:
    """
    Test endpoint with a sample article.
    """
    sample_article = (
        "Artificial intelligence is rapidly transforming many industries, "
        "from healthcare and finance to transportation and education. "
        "Companies are investing billions of dollars into AI research and "
        "development, hoping to gain a competitive edge and create new products. "
        "At the same time, governments and experts are discussing how to regulate "
        "AI systems to ensure they are safe, transparent, and fair."
    )
    summary = summarize_text(sample_article, language="en")
    return SummarizeResponse(summary=summary)
