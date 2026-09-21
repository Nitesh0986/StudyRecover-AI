# StudyRecover AI

> **AI-Powered Personalized Learning Gap Detection and Recovery Planning Platform**

StudyRecover AI is an educational platform designed to diagnose learning gaps, predict academic risk, and provide targeted recovery plans. Rather than generic test drills or static calendars, StudyRecover AI identifies specific conceptual deficiencies, estimates learning risk using machine learning, and guides learners through deliberate practice and progress tracking.

---

## Overview

In traditional study workflows, students often discover their weaknesses only after high-stakes examinations. Even when deficiencies are noticed, students struggle to identify which prerequisite concepts failed, how much time to spend on recovery, or whether their practice efforts are translating into actual concept mastery.

**StudyRecover AI** addresses this challenge through a closed-loop learning diagnostic and recovery workflow:
1. **Assess**: Diagnostic check-in across core curriculum topics.
2. **Diagnose**: Rule-based learning gap calculation that computes topic mastery scores and study time recommendations.
3. **Predict**: Machine-learning risk estimation assessing the probability of conceptual failure based on performance indicators.
4. **Recover**: Prioritized recovery roadmap targeting the weakest topics first.
5. **Practice**: Immediate feedback drills with explanations for every answer choice.
6. **Track**: Continuous progress monitoring measuring score improvement over time.

---

## Problem Statement

Learners encounter three primary obstacles during independent study:
- **Lack of Diagnostic Clarity**: Knowing an overall score (e.g., 60%) does not tell the learner which specific topics or sub-topics caused the failure.
- **Inefficient Time Allocation**: Students often review material they already understand or become overwhelmed trying to re-read entire textbooks.
- **Unmeasured Practice Impact**: Standard question banks rarely track whether follow-up practice successfully closed the original learning gap.

---

## Solution

StudyRecover AI delivers a human-friendly, data-driven solution:
- **Granular Learning Gap Analysis**: Computes weighted topic mastery combining assessment baseline performance (40%) and practice history (60%).
- **Predictive Risk Assessment**: A trained Random Forest Classifier predicts whether a student is at High, Medium, or Low learning risk with an associated model confidence score.
- **Adaptive Recovery Guidance**: Recommends targeted study times (15 to 45 minutes) and actionable study steps tailored to each student's current proficiency.
- **Interactive Practice Loop**: Topic-specific question sets featuring instantaneous feedback and explanations that persist progress in browser storage.

---

## Key Features

- 🧭 **10-Question Diagnostic Assessment**: Rapid baseline assessment evaluating foundational computer science / database topics (Normalization, Transactions, Relational Algebra).
- 📊 **Dynamic Learning Gap Engine**: Real-time calculation of mastery scores, risk levels, recommended study durations, and improvement trends.
- 🧠 **Machine Learning Risk Prediction**: FastAPI-backed scikit-learn classifier evaluating multi-feature learning profiles (assessment score, practice average, attempts, improvement delta).
- 🎯 **Targeted Recovery Plan**: Topic prioritization ordering gaps by highest risk so learners address critical deficiencies first.
- ✍️ **Focused Topic Practice**: Interactive quizzes with instant rationale explanations and multi-attempt performance tracking.
- 📈 **Progress Dashboard**: Longitudinal overview comparing initial assessment benchmarks against cumulative practice scores.
- 🌙 **Modern Human-Friendly UI**: Responsive dark theme built with Tailwind CSS, optimized for desktop, tablet, and mobile displays.

---

## How It Works

```text
┌─────────────────┐
│   Assessment    │  --> 10 diagnostic questions across topics
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Learning Gap Detection  │  --> Weighted mastery, study time & gap ranking
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   ML Risk Prediction    │  --> FastAPI + Random Forest Classifier (Risk & Confidence)
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│      Recovery Plan      │  --> Prioritized study roadmap with recommended minutes
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   Targeted Practice     │  --> Interactive drills with step-by-step explanations
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│    Progress Dashboard   │  --> Baseline vs. practice trajectory & mastery trends
└─────────────────────────┘
```

---

## AI/ML Approach

StudyRecover AI pairs a deterministic rule-based gap analysis engine with a supervised machine-learning classifier.

### 1. Feature Set
The ML model evaluates four core student activity metrics:
- **`assessment_score`**: Baseline score percentage from the initial diagnostic check-in.
- **`practice_average`**: Mean percentage score across all completed practice sessions.
- **`practice_attempts`**: Cumulative number of practice sessions completed by the learner.
- **`improvement`**: The delta between practice performance and the initial baseline (`practice_average - assessment_score`).

### 2. Model Architecture
- **Algorithm**: `RandomForestClassifier` (`n_estimators=100`, `random_state=42`).
- **Target Classes**:
  - `0`: Low Risk (High mastery, stable or positive trajectory)
  - `1`: Medium Risk (Moderate mastery, requires targeted practice)
  - `2`: High Risk (Critical gaps, persistent negative delta or low baseline)
- **Output**: Predicted risk label alongside the model's highest class probability (`confidence` percentage).

> [!NOTE]
> The current model is trained on development benchmark datasets designed to reflect representative student mastery patterns. Accuracy claims apply to the curated validation distribution and provide directional risk classification for formative recovery planning.

### 3. Adaptive Mastery Scoring
The frontend Learning Gap Engine calculates composite topic mastery using a weighted formulation:
$$\text{Mastery Score} = (\text{Assessment Baseline} \times 0.4) + (\text{Practice Average} \times 0.6)$$
$$\text{Learning Risk} = \max(0, 100 - \text{Mastery Score})$$

---

## Tech Stack

### Frontend
- **React 19** — Component-driven reactive UI architecture
- **Vite 8** — Fast bundler and development server
- **Tailwind CSS 4** — Utility-first modern dark UI styling
- **HTML5 LocalStorage** — Resilient client-side persistence

### Backend
- **FastAPI** — High-performance asynchronous Python REST API
- **Uvicorn** — ASGI production server
- **Pydantic v2** — Request payload modeling and validation
- **CORS Middleware** — Secure multi-origin client support

### Machine Learning
- **Python 3.14**
- **scikit-learn** — Random Forest Classifier implementation
- **NumPy** — Matrix and array feature processing

---

## Project Structure

```text
StudyRecover-AI/
├── ai/
│   └── risk_predictor.py         # scikit-learn model training & inference
├── backend/
│   ├── main.py                   # FastAPI REST application & CORS setup
│   ├── requirements.txt          # Python backend dependencies
│   └── .env.example              # Environment variables template
├── data/                         # Dataset assets
├── docs/
│   ├── architecture.md           # Technical architecture and data flow
│   ├── testing.md                # Verification plan and test checklist
│   └── demo-flow.md              # 2-3 minute presentation walkthrough
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Assessment.jsx        # Diagnostic quiz component
│   │   │   ├── AssessmentResult.jsx  # Diagnostic summary & topic breakdown
│   │   │   ├── Dashboard.jsx         # Main learning space overview
│   │   │   ├── MLRiskCard.jsx        # FastAPI ML risk card
│   │   │   ├── Practice.jsx          # Topic quiz with rationale feedback
│   │   │   ├── Progress.jsx          # Performance trajectory analytics
│   │   │   ├── ProgressCard.jsx      # Assessment progress summary card
│   │   │   ├── RecoveryPlan.jsx      # Adaptive study roadmap & recommendations
│   │   │   ├── RiskScore.jsx         # Circular risk visualization card
│   │   │   ├── Sidebar.jsx           # Responsive desktop/mobile navigation
│   │   │   └── WeakTopics.jsx        # Dynamic prioritized learning gaps
│   │   ├── utils/
│   │   │   ├── learningGapEngine.js  # Rule-based mastery & study time engine
│   │   │   └── topicRiskEngine.js    # Topic risk helper
│   │   ├── App.jsx                   # Root application state & router
│   │   ├── main.jsx                  # React DOM entrypoint
│   │   └── index.css                 # Tailwind CSS styles
│   ├── package.json
│   └── vite.config.js
├── .gitignore                    # Root repository ignore rules
└── README.md
```

---

## Installation & Setup

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Python**: v3.10+ (tested on Python 3.14)
- **npm**: v9+

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend application will start at `http://localhost:5173` (or `http://localhost:5174`).

### 2. Backend Setup

In a separate terminal:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at `http://127.0.0.1:8000`. Interactive OpenAPI documentation can be viewed at `http://127.0.0.1:8000/docs`.

---

## API Reference

### `GET /`
Returns service status.
- **Response**:
  ```json
  {
    "message": "StudyRecover AI Backend is running",
    "status": "success"
  }
  ```

### `GET /health`
Liveness probe.
- **Response**:
  ```json
  {
    "status": "healthy",
    "service": "StudyRecover AI"
  }
  ```

### `POST /api/predict-risk`
Calculates student learning risk using the trained Random Forest model.
- **Request Body**:
  ```json
  {
    "assessment_score": 50.0,
    "practice_average": 45.0,
    "practice_attempts": 2,
    "improvement": -5.0
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "prediction": {
      "risk": "High Risk",
      "confidence": 86.0
    }
  }
  ```

---

## Usage Guide

1. **Dashboard Check-In**: Open the application. On first launch, the dashboard displays an empty state welcoming the user to begin their diagnostic check-in.
2. **Take Assessment**: Click **"Take Assessment"** and answer the 10 questions.
3. **Review Results**: View the summary breakdown highlighting your strongest topic and weakest topic. Click **"Go to Dashboard"**.
4. **Inspect Recovery Plan**: From the dashboard banner or sidebar, navigate to **Recovery Plan**. View your ML-estimated risk score and suggested study duration for each topic.
5. **Practice Weak Topics**: Click **"Practice [Topic] →"** to answer focused questions with real-time feedback and detailed explanations.
6. **Monitor Progress**: Visit the **Progress** page to view your growth trajectory and updated mastery metrics.

---

## Screenshots

> *Screenshots demonstrating the desktop and mobile interface:*

| Dashboard Overview | Recovery Plan & ML Risk |
| :---: | :---: |
| *(Add Dashboard Screenshot)* | *(Add Recovery Plan Screenshot)* |

| Practice Session | Progress Trajectory |
| :---: | :---: |
| *(Add Practice Screenshot)* | *(Add Progress Screenshot)* |

---

## Future Scope

- 📚 Multi-subject curriculum support (Operating Systems, Algorithms, Computer Networks).
- 📄 Syllabus PDF upload with automatic topic extraction and question generation.
- 📈 Time-series mastery trend forecasting across academic semesters.
- 🔔 Spaced repetition schedule notifications for retention reinforcement.
- 👥 Multi-user authentication and teacher/mentor review dashboards.

---

## Team

- **StudyRecover AI Team** — Finalized for Horizon 2026 Submission.

---

## License

Developed as an educational submission project. All rights reserved.
