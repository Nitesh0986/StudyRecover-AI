import { useState } from "react";
import AssessmentResult from "./AssessmentResult";

const questions = [
  {
    id: 1,
    topic: "Normalization",
    domain: "Database Systems",
    question:
      "Which normal form removes partial dependency from a relational database?",
    options: [
      "First Normal Form",
      "Second Normal Form",
      "Third Normal Form",
      "BCNF",
    ],
    answer: 1,
  },
  {
    id: 2,
    topic: "Normalization",
    domain: "Database Systems",
    question:
      "Which normal form removes transitive dependency?",
    options: [
      "First Normal Form",
      "Second Normal Form",
      "Third Normal Form",
      "BCNF",
    ],
    answer: 2,
  },
  {
    id: 3,
    topic: "Transactions",
    domain: "Concurrency & Recovery",
    question:
      "Which property of a transaction ensures that it is treated as an indivisible unit?",
    options: [
      "Consistency",
      "Isolation",
      "Atomicity",
      "Durability",
    ],
    answer: 2,
  },
  {
    id: 4,
    topic: "Transactions",
    domain: "Concurrency & Recovery",
    question:
      "Which property ensures that committed data survives a system failure?",
    options: [
      "Atomicity",
      "Consistency",
      "Isolation",
      "Durability",
    ],
    answer: 3,
  },
  {
    id: 5,
    topic: "Relational Algebra",
    domain: "Relational Theory",
    question:
      "Which relational algebra operation is used to select rows satisfying a condition?",
    options: [
      "Projection",
      "Selection",
      "Join",
      "Union",
    ],
    answer: 1,
  },
  {
    id: 6,
    topic: "Relational Algebra",
    domain: "Relational Theory",
    question:
      "Which operation is used to select specific columns from a relation?",
    options: [
      "Selection",
      "Projection",
      "Union",
      "Difference",
    ],
    answer: 1,
  },
  {
    id: 7,
    topic: "Normalization",
    domain: "Database Systems",
    question:
      "A relation is in 1NF when its attributes contain:",
    options: [
      "Only atomic values",
      "Only foreign keys",
      "No primary key",
      "Only numeric values",
    ],
    answer: 0,
  },
  {
    id: 8,
    topic: "Transactions",
    domain: "Concurrency & Recovery",
    question:
      "Which schedule property prevents two transactions from interfering with each other?",
    options: [
      "Atomicity",
      "Isolation",
      "Durability",
      "Redundancy",
    ],
    answer: 1,
  },
  {
    id: 9,
    topic: "Relational Algebra",
    domain: "Relational Theory",
    question:
      "Which operation combines tuples from two relations based on a condition?",
    options: [
      "Selection",
      "Projection",
      "Join",
      "Rename",
    ],
    answer: 2,
  },
  {
    id: 10,
    topic: "Normalization",
    domain: "Database Systems",
    question:
      "BCNF is stricter than which normal form?",
    options: [
      "1NF",
      "2NF",
      "3NF",
      "None",
    ],
    answer: 2,
  },
];

function Assessment({ onAssessmentComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [results, setResults] = useState([]);
  const [finalResults, setFinalResults] = useState([]);
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const progress = Math.round(
    ((currentQuestion + 1) / totalQuestions) * 100
  );

  // ============================================
  // PREVIOUS QUESTION
  // ============================================

  const handlePrevious = () => {
    if (currentQuestion === 0) return;

    // Save current selection if made
    if (selectedAnswer !== null) {
      const updatedResults = [...results];
      updatedResults[currentQuestion] = {
        questionId: question.id,
        topic: question.topic,
        selectedAnswer,
        correctAnswer: question.answer,
        isCorrect: selectedAnswer === question.answer,
      };
      setResults(updatedResults);
    }

    const prevIndex = currentQuestion - 1;
    setCurrentQuestion(prevIndex);
    setSelectedAnswer(results[prevIndex]?.selectedAnswer ?? null);
  };

  // ============================================
  // NEXT QUESTION / SUBMIT
  // ============================================

  const handleNext = () => {
    if (selectedAnswer === null) {
      return;
    }

    const isCorrect = selectedAnswer === question.answer;

    const answerResult = {
      questionId: question.id,
      topic: question.topic,
      selectedAnswer,
      correctAnswer: question.answer,
      isCorrect,
    };

    const updatedResults = [...results];
    updatedResults[currentQuestion] = answerResult;
    setResults(updatedResults);

    // ============================================
    // LAST QUESTION - FINISH
    // ============================================

    if (isLastQuestion) {
      setFinalResults(updatedResults);

      localStorage.setItem(
        "studyRecoverResults",
        JSON.stringify(updatedResults)
      );

      localStorage.setItem(
        "studyRecoverAssessmentCompleted",
        "true"
      );

      const correctAnswers = updatedResults.filter(
        (result) => result.isCorrect
      ).length;

      const percentage = Math.round(
        (correctAnswers / totalQuestions) * 100
      );

      localStorage.setItem(
        "studyRecoverScore",
        percentage.toString()
      );

      setCompleted(true);
      return;
    }

    // ============================================
    // ADVANCE TO NEXT QUESTION
    // ============================================

    const nextIndex = currentQuestion + 1;
    setCurrentQuestion(nextIndex);
    setSelectedAnswer(updatedResults[nextIndex]?.selectedAnswer ?? null);
  };

  // ============================================
  // RENDER COMPLETED RESULT SCREEN
  // ============================================

  if (completed) {
    return (
      <AssessmentResult
        results={finalResults}
        onBackToDashboard={() => {
          if (onAssessmentComplete) {
            onAssessmentComplete(finalResults);
          }
        }}
      />
    );
  }

  // ============================================
  // MAIN ASSESSMENT VIEW (STITCH-INSPIRED UI)
  // ============================================

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-8">
      {/* ========================================
          1. HEADER BAR
      ======================================== */}
      <header className="rounded-2xl bg-slate-900/80 border border-slate-800/80 px-5 py-3.5 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo Mark */}
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-sm sm:text-base truncate">
                  StudyRecover AI
                </span>
                <span className="hidden sm:inline text-slate-600 text-xs">/</span>
                <span className="hidden sm:inline text-slate-400 text-xs truncate">
                  Diagnostic Assessment
                </span>
              </div>

              {/* AI Engine Status */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  AI Engine Active
                </span>
              </div>
            </div>
          </div>

          {/* Profile Avatar Icon */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center font-semibold text-xs shadow-inner">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================
          2. PROGRESS CARD
      ======================================== */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-base">🧠</span>
            <span className="text-white font-semibold text-sm tracking-wide">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-slate-300 truncate max-w-[140px] sm:max-w-[200px]">
              {question.topic}
            </span>
          </div>
        </div>

        {/* Gradient Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
          <span>Foundations Diagnostic</span>
          <span className="text-blue-400 font-semibold">{progress}% Complete</span>
        </div>
      </div>

      {/* ========================================
          3. QUESTION CARD
      ======================================== */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex items-start gap-3.5">
          <span className="flex shrink-0 items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs mt-0.5 shadow-sm">
            Q{currentQuestion + 1}
          </span>
          <h2 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
            {question.question}
          </h2>
        </div>
      </div>

      {/* ========================================
          4. INTERACTIVE ANSWER OPTIONS (A, B, C, D)
      ======================================== */}
      <div className="space-y-2.5" role="radiogroup" aria-label="Answer options">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const letter = String.fromCharCode(65 + index);

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedAnswer(index)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-center gap-4 select-none cursor-pointer ${
                isSelected
                  ? "bg-slate-800/90 border-blue-500 text-white shadow-[0_0_0_1px_rgba(59,130,246,0.6)]"
                  : "bg-slate-900/90 border-slate-800/90 hover:bg-slate-800/50 hover:border-slate-700 text-slate-300"
              }`}
            >
              {/* Radio / Option Indicator */}
              <div
                className={`w-6 h-6 rounded-full flex shrink-0 items-center justify-center text-xs font-bold transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {isSelected ? (
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>{letter}</span>
                )}
              </div>

              {/* Option Text */}
              <span className="flex-1 font-medium text-sm sm:text-base leading-snug">
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================
          5. TOPIC METADATA BADGES
      ======================================== */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-slate-500 text-sm">🏷️</span>
        <span className="text-xs text-slate-400 font-medium">Topic:</span>

        <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium">
          {question.topic}
        </span>

        {question.domain && (
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
            {question.domain}
          </span>
        )}

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          High Diagnostic Weight
        </span>
      </div>

      {/* ========================================
          6. NAVIGATION ACTION BUTTONS
      ======================================== */}
      <div className="pt-2 space-y-3">
        <div className="grid grid-cols-12 gap-3">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`col-span-4 h-12 flex items-center justify-center gap-2 px-3 rounded-xl border text-sm font-medium transition-all ${
              currentQuestion === 0
                ? "bg-slate-900/40 border-slate-800/40 text-slate-600 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <span>←</span>
            <span>Previous</span>
          </button>

          {/* Submit & Next Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`col-span-8 h-12 flex items-center justify-center gap-2 px-6 rounded-xl font-semibold text-sm transition-all shadow-md ${
              selectedAnswer === null
                ? "bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/20"
            }`}
          >
            <span>
              {isLastQuestion ? "Finish Assessment" : "Submit & Next Question"}
            </span>
            <span>→</span>
          </button>
        </div>

        {/* 7. Auto-save status label */}
        <div className="flex items-center justify-center gap-1.5 text-center text-slate-500 text-xs py-1">
          <span className="text-emerald-400">☁✓</span>
          <span>
            Answers auto-saved to session state. {totalQuestions} questions test foundational database domains.
          </span>
        </div>
      </div>
    </div>
  );
}

export default Assessment;