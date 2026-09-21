# StudyRecover AI — Technical Architecture

This document describes the end-to-end technical architecture, component structure, data flow, and machine learning integration of **StudyRecover AI**.

---

## 1. High-Level Architecture Overview

StudyRecover AI is structured as a decoupled full-stack architecture combining a reactive client application, a lightweight REST API backend, and an in-memory machine learning classification engine.

```text
┌─────────────────────────────────────────────────────────────┐
│                       React Frontend                        │
│                                                             │
│   ┌──────────────┐   ┌──────────────┐   ┌───────────────┐   │
│   │  Dashboard   │   │  Assessment  │   │ Recovery Plan │   │
│   └──────────────┘   └──────────────┘   └───────┬───────┘   │
│   ┌──────────────┐   ┌──────────────┐           │           │
│   │   Practice   │   │   Progress   │           │           │
│   └──────────────┘   └──────────────┘           │           │
│                            │                    │           │
│               LocalStorage Persistence          │           │
└────────────────────────────┼────────────────────┼───────────┘
                             │                    │
                             │         HTTP POST /api/predict-risk
                             │                    │
                             ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend (Port 8000)              │
│                                                             │
│   - CORS Middleware (localhost / 127.0.0.1 on 5173/5174)   │
│   - Pydantic Request Validation (RiskRequest)               │
│   - Endpoints: GET /, GET /health, POST /api/predict-risk   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Machine Learning Engine                   │
│                                                             │
│   - ai/risk_predictor.py                                    │
│   - Model: RandomForestClassifier (100 estimators)          │
│   - Feature Vector: [Score, PracticeAvg, Attempts, Delta]   │
│   - Output: Risk Classification (Low/Medium/High) + Conf %  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Component Structure & Responsibilities

### Frontend (`frontend/src/`)
- **`App.jsx`**: Root application state manager. Tracks `activePage`, `assessmentResults`, `practiceTopic`, and coordinates mobile drawer visibility.
- **`components/Sidebar.jsx`**: Desktop navigation sidebar with icons and responsive slide-out drawer on mobile viewports.
- **`components/Dashboard.jsx`**: Primary dashboard rendering overall performance snapshot, circular risk indicator, progress card, dynamic weak topic list, ML risk card, and quick start CTAs.
- **`components/Assessment.jsx`**: 10-question diagnostic quiz checking normalization, transactions, and relational algebra. Persists results to `studyRecoverResults`.
- **`components/AssessmentResult.jsx`**: Diagnostic performance breakdown highlighting strongest and weakest topics with tailored feedback.
- **`components/RecoveryPlan.jsx`**: Adaptive study roadmap prioritizing weakest topics first, displaying recommended study minutes, and requesting ML risk classification.
- **`components/Practice.jsx`**: Targeted practice mode with topic selector, instant explanations for correct/incorrect answers, and attempt logging.
- **`components/Progress.jsx`**: Analytics dashboard tracking baseline vs. practice trajectory, cumulative improvement, and session metrics.
- **`components/MLRiskCard.jsx`**: Compact card integrating with the FastAPI `/api/predict-risk` endpoint to display predicted learning risk with model confidence.
- **`components/WeakTopics.jsx`**: Dynamic component computing topic mastery from real assessment data and rendering prioritized learning gaps.
- **`utils/learningGapEngine.js`**: Pure mathematical gap calculation calculating composite topic mastery ($40\%$ assessment, $60\%$ practice) and recommended study time.

---

## 3. Data Flow & LocalStorage Schema

The frontend maintains high reliability through structured client-side storage:

| Storage Key | Format | Description |
| :--- | :--- | :--- |
| `studyRecoverResults` | Array of Objects | `[{ questionId, topic, selectedAnswer, correctAnswer, isCorrect }]` |
| `studyRecoverAssessmentCompleted` | String (`"true"`) | Flag indicating baseline assessment completion |
| `studyRecoverScore` | String (e.g., `"70"`) | Overall diagnostic score percentage |
| `studyRecoverPracticeResults` | Array of Objects | `[{ topic, score, totalQuestions, percentage, completedAt }]` |

All storage operations utilize safe `try / catch` deserialization and validate array structure to prevent malformed data from affecting rendering.

---

## 4. Backend & ML Pipeline

### API Specification
- **Base URL**: `http://127.0.0.1:8000`
- **CORS Allowed Origins**:
  - `http://localhost:5173`
  - `http://localhost:5174`
  - `http://127.0.0.1:5173`
  - `http://127.0.0.1:5174`

### ML Risk Request / Response Schema
```typescript
// Request Payload (POST /api/predict-risk)
interface RiskRequest {
  assessment_score: number;   // 0 - 100
  practice_average: number;   // 0 - 100
  practice_attempts: number;  // integer >= 0
  improvement: number;        // practice_average - assessment_score
}

// Response Payload
interface RiskResponse {
  success: boolean;
  prediction: {
    risk: "Low Risk" | "Medium Risk" | "High Risk";
    confidence: number;       // e.g., 86.0
  };
}
```

### ML Engine (`ai/risk_predictor.py`)
1. **Feature Extraction**: Constructs a 4-dimensional numeric vector `[assessment_score, practice_average, practice_attempts, improvement]`.
2. **Inference**: Invokes `RandomForestClassifier.predict()` and `predict_proba()`.
3. **Confidence Scoring**: Extracts the maximum probability among the class predictions converted to percentage format.
4. **Fallback Mechanism**: The frontend gracefully catches network failures or server unavailability, displaying an informative message without interrupting the deterministic recovery plan.
