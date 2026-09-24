# StudyRecover AI

<div align="center">

![StudyRecover AI Banner](https://img.shields.io/badge/StudyRecover-AI%20Platform-3b82f6?style=for-the-badge&logo=openai&logoColor=white)

**AI-Powered Learning Gap Detection and Recovery Planning Platform**

[![GitHub Repository](https://img.shields.io/badge/GitHub-Nitesh0986%2FStudyRecover--AI-181717?style=flat-square&logo=github)](https://github.com/Nitesh0986/StudyRecover-AI)
[![React](https://img.shields.io/badge/Frontend-React%2019-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%206-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![scikit-learn](https://img.shields.io/badge/ML-scikit--learn-f7931e?style=flat-square&logo=scikit-learn)](https://scikit-learn.org/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel%20Ready-black?style=flat-square&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#key-features) • [How It Works](#how-it-works) • [Tech Stack](#tech-stack) • [Quick Setup](#quick-start--local-setup) • [Vercel Deployment](#deployment-guide-vercel) • [API Reference](#api-reference)

</div>

---

## 📌 Overview

In traditional study workflows, students often discover their weaknesses only after taking high-stakes examinations. Even when deficiencies are noticed, students struggle to identify which prerequisite concepts failed, how much time to dedicate to recovery, or whether their practice efforts are translating into actual concept mastery.

**StudyRecover AI** addresses this challenge through a closed-loop learning diagnostic and recovery workflow:
1. **Assess**: Diagnostic check-in across core curriculum topics (Normalization, Transactions & Concurrency, Relational Algebra & SQL).
2. **Diagnose**: Rule-based learning gap calculation that computes topic mastery scores and study time recommendations.
3. **Predict**: Machine-learning risk estimation using a Random Forest Classifier evaluating performance indicators and class confidence.
4. **Recover**: Prioritized recovery roadmap targeting the weakest topics first with actionable steps.
5. **Practice**: Immediate feedback drills with explanations for every answer choice and persistent tracking.
6. **Track**: Continuous progress monitoring measuring longitudinal score improvement over time.

---

## 💡 Problem & Solution

| The Problem | How StudyRecover AI Solves It |
| :--- | :--- |
| **Lack of Diagnostic Clarity**: Knowing an overall percentage (e.g. 60%) does not reveal which specific topics caused failure. | **Granular Gap Analysis**: Deconstructs scores into topic-level mastery combining baseline (40%) and practice (60%). |
| **Inefficient Time Allocation**: Students review material they already know or feel overwhelmed re-reading entire textbooks. | **Adaptive Recommendations**: Recommends targeted study times (15 to 45 mins) tailored to the learner's risk level. |
| **Unmeasured Practice Impact**: Standard question banks rarely track whether follow-up practice closed the gap. | **Longitudinal Tracking**: Computes trajectory deltas comparing initial assessment benchmarks with ongoing practice. |
| **No Early Warning System**: Students don't know if they are heading toward academic failure before exams. | **Predictive ML Risk Engine**: Random Forest model classifies risk into *Low*, *Medium*, or *High Risk* with confidence metrics. |

---

## ✨ Key Features

- 🧭 **10-Question Diagnostic Assessment**: Rapid baseline assessment evaluating foundational computer science / database topics with database schema code previews.
- 🎨 **Modern Dark UI (macOS & Stitch Inspired)**: Sleek terminal code preview cards with window control dots, pulsing AI status badge, glowing gradient progress bar, and checkmark option cards.
- 🧠 **Supervised ML Risk Prediction**: FastAPI-backed scikit-learn Random Forest model evaluating multi-feature student activity vectors (`assessment_score`, `practice_average`, `practice_attempts`, `improvement`).
- 🛡️ **Resilient Fallback Mode**: Built-in deterministic risk calculation fallback if the backend API server is offline or unreachable.
- 🎯 **Targeted Recovery Plan**: Prioritizes learning gaps from highest to lowest risk so learners fix critical deficiencies first.
- ✍️ **Focused Topic Practice**: Interactive quizzes with instant rationale explanations for correct and incorrect options.
- 📱 **Fully Responsive Design**: Optimized for all viewports with desktop side navigation and mobile drawer top-bar menu.
- 💾 **Zero-Config Client Persistence**: Browser LocalStorage persistence for answers, practice history, and assessment results.

---

## 🏗️ Architecture & Workflow

```text
┌─────────────────┐
│   Assessment    │  --> 10 diagnostic questions across topics with code preview
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Learning Gap Detection  │  --> Weighted topic mastery, study duration & gap ranking
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   ML Risk Prediction    │  --> FastAPI + Random Forest Classifier (Risk & Confidence)
└────────┬────────────────┘      (Resilient local fallback if backend is offline)
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

## 🤖 AI / Machine Learning Approach

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

### 3. Adaptive Mastery Scoring
The frontend Learning Gap Engine calculates composite topic mastery using a weighted formulation:
$$\text{Mastery Score} = (\text{Assessment Baseline} \times 0.4) + (\text{Practice Average} \times 0.6)$$
$$\text{Learning Risk} = \max(0, 100 - \text{Mastery Score})$$

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — Component-driven reactive UI architecture
- **Vite 6** — Ultra-fast build tool and local dev server
- **Tailwind CSS 4** — Modern utility-first styling with responsive dark theme
- **HTML5 LocalStorage** — Resilient client-side persistence

### Backend & Machine Learning
- **FastAPI** — High-performance asynchronous Python REST API
- **Uvicorn** — ASGI production server
- **Pydantic v2** — Request payload modeling and validation
- **scikit-learn** — Random Forest Classifier implementation
- **NumPy** — Feature matrix processing

---

## 📁 Project Structure

```text
StudyRecover-AI/
├── ai/
│   └── risk_predictor.py         # scikit-learn model training & inference
├── backend/
│   ├── main.py                   # FastAPI REST application & CORS setup
│   ├── requirements.txt          # Python backend dependencies
│   └── .env.example              # Environment variables template
├── docs/
│   ├── architecture.md           # Technical architecture and data flow
│   ├── testing.md                # Verification plan and test checklist
│   └── demo-flow.md              # 2-3 minute presentation walkthrough
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Assessment.jsx        # Diagnostic quiz component (Stitch dark UI)
│   │   │   ├── AssessmentResult.jsx  # Diagnostic summary & topic breakdown
│   │   │   ├── Dashboard.jsx         # Main learning space overview
│   │   │   ├── MLRiskCard.jsx        # FastAPI ML risk card
│   │   │   ├── Practice.jsx          # Topic quiz with rationale feedback
│   │   │   ├── Progress.jsx          # Performance trajectory analytics
│   │   │   ├── ProgressCard.jsx      # Assessment progress summary card
│   │   │   ├── RecoveryPlan.jsx      # Adaptive study roadmap & recommendations
│   │   │   ├── RiskScore.jsx         # Circular risk visualization card
│   │   │   ├── Sidebar.jsx           # Responsive desktop & mobile navigation
│   │   │   └── WeakTopics.jsx        # Dynamic prioritized learning gaps
│   │   ├── utils/
│   │   │   ├── learningGapEngine.js  # Rule-based mastery & study time engine
│   │   │   └── topicRiskEngine.js    # Topic risk helper
│   │   ├── App.jsx                   # Root application state & router
│   │   ├── main.jsx                  # React DOM entrypoint
│   │   └── index.css                 # Tailwind CSS styles
│   ├── vercel.json               # Frontend SPA rewrites configuration
│   ├── package.json              # Dependencies & build scripts
│   └── vite.config.js            # Vite build configuration
├── vercel.json                   # Root deployment configuration
├── .gitignore                    # Git ignore rules
└── README.md                     # Project documentation
```

---

## 🚀 Quick Start / Local Setup

### Prerequisites
- **Node.js**: v18+ (tested on Node v20/v24)
- **Python**: v3.10+ (tested on Python 3.14)
- **npm**: v9+

### 1. Clone the Repository
```bash
git clone https://github.com/Nitesh0986/StudyRecover-AI.git
cd StudyRecover-AI
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at **`http://localhost:5173`**.

### 3. Backend Setup
In a new terminal:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`

---

## ☁️ Deployment Guide (Vercel)

This repository is pre-configured with root and frontend `vercel.json` files for automatic 1-click deployment on **Vercel**.

### Step 1: Import Repository
1. Log in to [Vercel](https://vercel.com).
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Under **Import Git Repository**, select **`StudyRecover-AI`** (or paste `https://github.com/Nitesh0986/StudyRecover-AI`).
4. Click **Import**.

### Step 2: Configure & Deploy
- **Project Name**: `studyrecover-ai` (lowercase letters and hyphens only).
- **Framework Preset**: `Vite` (automatically detected).
- **Root Directory**: Leave as default (`./`), or set to `frontend` if importing just the frontend directory.
- Click **Deploy**.

> The root `vercel.json` automatically runs `cd frontend && npm install && npm run build` and serves the production bundle from `frontend/dist` with client-side SPA routing rewrites.

---

## 📡 API Reference

### `GET /`
Service health check and introductory message.
```json
{
  "message": "StudyRecover AI Backend is running",
  "status": "success"
}
```

### `GET /health`
Liveness probe.
```json
{
  "status": "healthy",
  "service": "StudyRecover AI"
}
```

### `POST /api/predict-risk`
Calculates student learning risk using the trained Random Forest classifier.

**Request Payload:**
```json
{
  "assessment_score": 50.0,
  "practice_average": 45.0,
  "practice_attempts": 2,
  "improvement": -5.0
}
```

**Response Payload:**
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

## 🧪 Testing & Verification

Run these commands to verify code quality and production builds:

```bash
# Verify frontend linting
cd frontend
npm run lint

# Verify frontend production build
npm run build

# Verify backend tests (if pytest installed)
cd ../backend
python -m pytest
```

---

## 🔮 Future Roadmap

- 📚 **Multi-Subject Expansion**: Operating Systems, Computer Networks, and System Design.
- 📄 **Syllabus & PDF Ingestion**: Automatic learning gap diagnosis from course syllabus uploads.
- 📈 **Time-Series Forecasting**: Longitudinal retention analysis across entire semesters.
- 🔔 **Spaced Repetition Scheduler**: Automated retention notifications before concepts decay.
- 👥 **Mentor & Instructor Portal**: Class-level risk heatmaps for educators.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
