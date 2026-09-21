from pathlib import Path
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ============================================
# CONNECT AI FOLDER
# ============================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent
AI_FOLDER = PROJECT_ROOT / "ai"

sys.path.append(str(AI_FOLDER))

from risk_predictor import predict_learning_risk


# ============================================
# FASTAPI APP
# ============================================

app = FastAPI(
    title="StudyRecover AI API",
    description="Backend API for learning gap and risk prediction",
    version="1.0.0",
)


# ============================================
# CORS
# ============================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# REQUEST MODEL
# ============================================

class RiskRequest(BaseModel):
    assessment_score: float
    practice_average: float
    practice_attempts: int
    improvement: float


# ============================================
# ROOT ROUTE
# ============================================

@app.get("/")
def root():
    return {
        "message": "StudyRecover AI Backend is running",
        "status": "success",
    }


# ============================================
# HEALTH CHECK
# ============================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "StudyRecover AI",
    }


# ============================================
# ML RISK PREDICTION
# ============================================

@app.post("/api/predict-risk")
def predict_risk(request: RiskRequest):

    result = predict_learning_risk(
        assessment_score=request.assessment_score,
        practice_average=request.practice_average,
        practice_attempts=request.practice_attempts,
        improvement=request.improvement,
    )

    return {
        "success": True,
        "prediction": result,
    }