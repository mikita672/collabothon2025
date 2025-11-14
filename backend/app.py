from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.data import router as data_router

app = FastAPI(title="Backend")

# Dev CORS (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return {"status": "ok", "docs": "/docs"}
# Mount routers
app.include_router(data_router)