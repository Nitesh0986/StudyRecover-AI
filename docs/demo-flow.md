# StudyRecover AI — Demo Flow Script (2–3 Minutes)

This document provides the exact script, interaction sequence, and speaking points for demonstrating **StudyRecover AI** to evaluators, judges, or stakeholders.

---

## Preparation (Before Demo)

1. **Start Backend**:
   ```bash
   cd backend
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
3. **Open Browser**:
   Navigate to `http://localhost:5173`.
4. **Reset Storage (Optional for Fresh Demo)**:
   Open Browser DevTools Console and run:
   ```javascript
   localStorage.clear(); location.reload();
   ```

---

## 2–3 Minute Presentation Flow

### 0:00 - 0:30 | Introduction & Fresh Dashboard (The Problem)
- **Visual**: Show the clean Dashboard in its empty state.
- **Narrative**:
  > *"Welcome to StudyRecover AI. Traditional learning apps give students static schedules or generic drills, but when students struggle, they don't know which concepts failed, how much time to dedicate, or how to recover. StudyRecover AI solves this by diagnosing learning gaps, predicting risk using machine learning, and guiding targeted recovery."*
- **Action**: Point out the welcoming prompt, then click **"Take Assessment →"**.

---

### 0:30 - 1:00 | Diagnostic Assessment (Data-Driven Baseline)
- **Visual**: Show the 10-question assessment interface.
- **Narrative**:
  > *"The student takes a 10-question diagnostic check-in across core database concepts. As we answer, note the clean progress bar and focused question view."*
- **Action**: Complete the 10 questions aiming for a realistic mixed performance (~60% - 70%):
  - Answer 6-7 correctly and 3-4 incorrectly (e.g., miss questions on **Normalization** to trigger a clear weak area).
  - Submit the final question.
- **Visual**: **Assessment Result** screen appears immediately with percentage score, strongest topic, and weakest topic highlighted.
- **Action**: Click **"Go to Dashboard →"**.

---

### 1:00 - 1:30 | Dashboard Insights & Recovery Plan (The Diagnosis)
- **Visual**: Dashboard now dynamically displays the student's real metrics.
  - Snapshot score & circular risk gauge.
  - Dynamic **Weak Topics** card showing real percentages and priority tags (e.g., Normalization: Critical).
  - **ML Learning Risk** card showing model output and confidence.
- **Narrative**:
  > *"The dashboard instantly reflects the student's diagnosis. Our circular risk gauge and dynamic weak topics card highlight that Normalization needs critical attention. Notice our ML Risk card: it communicates directly with our FastAPI backend to predict risk level and model confidence."*
- **Action**: Click **"View Recovery Plan →"** (from the top banner or sidebar).

---

### 1:30 - 2:15 | Recovery Plan & Targeted Practice (The Recovery Loop)
- **Visual**: **Recovery Plan** page displaying prioritized topics ordered by highest risk.
- **Narrative**:
  > *"In the Recovery Plan, the student doesn't have to re-study everything. Our learning gap engine assigns recommended study times—like 45 minutes for Normalization—and outlines concrete study steps."*
- **Action**:
  - Click **"Practice Normalization →"**.
  - On question 1, select an option and click **"Check my answer"**.
  - Show the rationale explanation highlighting *why* the answer is correct or incorrect.
  - Complete the 5 practice questions with high accuracy (80% - 100%).
  - Show the **Practice Complete** summary screen with session percentage.
  - Click **"Back to Study Plan"**.
- **Visual**: In Recovery Plan, the mastery score for Normalization has increased, and trend indicates **"Improving"**!

---

### 2:15 - 2:45 | Progress Dashboard (Measurable Growth)
- **Visual**: Navigate to **Progress** via sidebar.
- **Narrative**:
  > *"Finally, we navigate to the Progress dashboard. Here, the student and instructor can see measurable proof of recovery: our initial baseline is compared directly against the practice average, showing positive improvement deltas across sessions."*
- **Visual**: Show:
  - Starting baseline vs. current practice average.
  - Positive improvement indicator (`↑ +X% since assessment`).
  - Total practice sessions completed.
  - Strongest vs. improving topic breakdown.

---

### 2:45 - 3:00 | Wrap Up & Summary
- **Visual**: Toggle mobile responsiveness (inspect element or resize window) to show responsive navigation.
- **Narrative**:
  > *"StudyRecover AI delivers a complete, closed-loop educational companion: from diagnosis to machine learning risk prediction, focused practice, and proven progress tracking. It is lightweight, production-stable, responsive, and ready for deployment."*
