from typing import List, Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel
from services.gemini_summarizer.gemini_summarizer import summarize_text
from services.gemini_summarizer.gemini_predict import news_prediction

router = APIRouter(tags=["gemini"])


# ============ Pydantic Models ============
class SummarizeRequest(BaseModel):
    text: str
    summary_size: Optional[str] = "medium"


class SummarizeResponse(BaseModel):
    summary: str


class PredictionRequest(BaseModel):
    text: str


class PredictionResponse(BaseModel):
    priceImpactExplanation: str
    priceImpactScore: float


# ============ Summarize Endpoints ============
@router.post("/summarize", response_model=SummarizeResponse)
def summarize_endpoint(request: SummarizeRequest):
    """
    Summarize a news article or any text.
    
    - **text**: The article text to summarize
    - **summary_size**: 'short' (1-2 sentences), 'medium' (2-3 sentences), or 'long' (4-6 sentences)
    """
    result = summarize_text(
        article_text=request.text,
        summary_size=request.summary_size
    )
    return result


@router.get("/summarize/test", response_model=SummarizeResponse)
def summarize_test_endpoint(
    summary_size: str = Query("medium", regex="^(short|medium|long)$")
):
    """
    Test endpoint for summarization with a sample article.
    
    Returns a summary of a hardcoded sample news article.
    """
    sample_text = (
        "Apple Inc. announced record quarterly profits today, driven by strong iPhone 15 sales "
        "and growing services revenue. The company also unveiled its new M3 chip, which shows "
        "40% performance improvement over the previous generation. CEO Tim Cook said the company "
        "remains committed to sustainability and carbon neutrality by 2030. Apple stock rose 3.5% "
        "on the news."
    )
    result = summarize_text(article_text=sample_text, summary_size=summary_size)
    return result


# ============ Prediction Endpoints ============
@router.post("/predict", response_model=PredictionResponse)
def predict_endpoint(request: PredictionRequest):
    """
    Predict stock price impact based on a news article.
    
    - **text**: The article text to analyze
    
    Returns:
    - **priceImpactExplanation**: Detailed reasoning for the prediction
    - **priceImpactScore**: A score from -10 (strong negative) to +10 (strong positive)
    """
    result = news_prediction(article_text=request.text)
    return result


@router.get("/predict/test", response_model=PredictionResponse)
def predict_test_endpoint():
    """
    Test endpoint for price impact prediction with a sample article.
    
    Returns a prediction for a hardcoded sample news article.
    """
    sample_text = (
        "Microsoft announces a major partnership with OpenAI, committing $10 billion in investment. "
        "The deal includes integration of GPT models into Microsoft's cloud services and Office suite. "
        "Analysts expect this will significantly boost Azure revenue and market share. "
        "The announcement comes as AI competition intensifies in the tech sector."
    )
    result = news_prediction(article_text=sample_text)
    return result


# ============ Batch Endpoints ============
@router.post("/summarize-batch")
def summarize_batch_endpoint(
    texts: List[str] = Query(..., description="List of texts to summarize"),
    summary_size: str = Query("medium", regex="^(short|medium|long)$")
):
    """
    Summarize multiple texts in batch.
    
    Returns a list of summaries for each input text.
    """
    results = []
    for text in texts:
        result = summarize_text(article_text=text, summary_size=summary_size)
        results.append(result)
    return {"summaries": results, "count": len(results)}


@router.post("/predict-batch")
def predict_batch_endpoint(texts: List[str] = Query(..., description="List of texts to predict")):
    """
    Predict stock price impact for multiple articles in batch.
    
    Returns a list of predictions for each input text.
    """
    results = []
    for text in texts:
        result = news_prediction(article_text=text)
        results.append(result)
    return {"predictions": results, "count": len(results)}