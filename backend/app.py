from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.simulate import router as simulation_router
from routers.news import router as news_router
from routers.news_sum_pred import router as news_sum_pred_router
from routers.admin import router as admin_router
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
app.include_router(simulation_router)
app.include_router(news_router)
app.include_router(news_sum_pred_router)
app.include_router(admin_router)
app.include_router(data_router)