# StudyRecover-AI
AI-powered personalized learning recovery system that detects learning gaps, identifies recurring mistakes, and creates adaptive study plans for students.
# StudyRecover AI 🎯

### AI-Powered Personalized Learning Recovery System

StudyRecover AI is an AI-powered learning companion designed to help students understand **why they are falling behind**, identify their most critical learning gaps, and receive a personalized recovery plan.

Unlike traditional study planners that simply create schedules, StudyRecover AI analyzes a student's performance, detects weak concepts and recurring mistakes, prioritizes learning gaps, and continuously adapts the study plan based on new performance.

---

## 🚨 Problem

Students often know **what they need to study**, but they don't know:

* Why they are performing poorly in a particular topic
* Which concepts they should prioritize
* Whether their mistakes are recurring
* How much time they should spend on each weak area
* What they should practice next
* Whether their learning is actually improving

Most existing study applications focus on creating schedules or providing generic AI assistance.

**StudyRecover AI focuses on learning recovery — identifying the reason behind poor performance and deciding what the student should do next.**

---

## 💡 Solution

StudyRecover AI creates a continuous learning loop:

```text
Student Performance
        ↓
Learning Gap Detection
        ↓
AI Diagnosis
        ↓
Priority & Risk Analysis
        ↓
Personalized Recovery Plan
        ↓
Adaptive Practice
        ↓
Reassessment
        ↓
Updated Learning Plan
        ↺
```

The system doesn't just tell students **what they got wrong**.

It helps them understand **why they got it wrong and what they should do next**.

---

## ✨ Core Features

### 1. 📊 Learning Gap Detection

Analyze test scores and identify:

* Critical weaknesses
* Moderate weaknesses
* Strong areas
* Recurring problem areas

### 2. 🧠 AI Learning Diagnosis

The AI analyzes performance patterns and provides an understandable explanation of the student's weaknesses.

### 3. ⚠️ Learning Risk Score

Generate a personalized learning-risk score based on factors such as:

* Topic performance
* Topic importance
* Previous performance
* Prerequisite dependencies
* Recent assessment results

### 4. 🎯 Personalized Recovery Plan

Generate a practical study plan based on:

* Weak topics
* Available study time
* Topic priority
* Learning dependencies
* Student performance

### 5. 📝 Adaptive Practice

Generate targeted practice questions based on the student's current weaknesses.

### 6. 🔄 Continuous Reassessment

After completing practice, the system analyzes the new performance and updates the recovery plan.

---

## 🧪 Example

A student performs:

| Topic              | Score |
| ------------------ | ----: |
| SQL                |   82% |
| ER Model           |   75% |
| Relational Algebra |   48% |
| Normalization      |   32% |
| Transactions       |   41% |

StudyRecover AI identifies:

```text
🔴 Critical
Normalization
Transactions

🟡 Needs Improvement
Relational Algebra

🟢 Strong
SQL
ER Model
```

The system then generates a recovery plan focused on the highest-priority concepts instead of asking the student to revise the entire subject.

---

## 🏗️ Planned Architecture

```text
                ┌──────────────────┐
                │   React Frontend │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │   FastAPI API    │
                └────────┬─────────┘
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
        Student Data  Assessment   AI Engine
                         Data         │
                                      ▼
                              ┌──────────────┐
                              │ Gemini / LLM │
                              └──────┬───────┘
                                     │
                                     ▼
                            Recovery Planner
                                     │
                                     ▼
                            Adaptive Practice
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Recharts

### Backend

* Python
* FastAPI

### AI

* Gemini API
* Prompt-based learning analysis
* Adaptive question generation

### Database

* MongoDB

### Other Technologies

* REST API
* PDF/Text Processing
* Git & GitHub

> The technology stack may evolve during development as the MVP is refined.

---

## 📁 Project Structure

```text
StudyRecover-AI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── ai/
│   ├── prompts/
│   └── analysis/
│
├── data/
│
├── README.md
└── .gitignore
```

---

## 🎯 Target Users

StudyRecover AI is designed for students who want to improve their learning efficiency, including:

* School students
* College students
* Competitive-exam aspirants
* University learners
* Self-paced learners

The system is designed to work across different subjects and examinations.

---

## 🔮 Future Scope

Potential future improvements include:

* 📄 Syllabus and PDF understanding
* 📚 Previous-year question analysis
* 🧩 Knowledge graph-based prerequisite detection
* 🎤 Voice-based learning assistance
* 📱 Mobile application
* 📈 Long-term performance analytics
* 👨‍🏫 Teacher/mentor dashboard
* 🔔 Personalized revision reminders
* 🌐 Multi-language learning support

---

## 🏆 Hackathon

**Horizon 2026 — Round 1: Online MVP Challenge**

**Theme:** AI with Education

StudyRecover AI is being developed as an MVP focused on making learning more personalized, measurable, and adaptive.

---

## 👨‍💻 Development Philosophy

StudyRecover AI is being built around one principle:

> **Don't give students another study planner. Help them recover from learning gaps.**

The goal is to build a practical AI system that can identify problems in a student's learning journey and provide actionable next steps.

---

## 📌 Project Status

🚧 **Currently in MVP Development**

The project is being developed incrementally, starting with the core learning-gap detection and personalized recovery workflow.

---

## 📄 License

This project is currently developed as a hackathon project.
