# test_api.py
from fastapi import FastAPI

app = FastAPI(title="Test API")


@app.get("/")
def root():
    return {"status": "ok", "message": "FastAPI is working"}
