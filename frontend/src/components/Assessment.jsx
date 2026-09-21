import { useState } from "react";
import AssessmentResult from "./AssessmentResult";

const questions = [
  {
    id: 1,
    topic: "Normalization",
    domain: "Relational Schema Design",
    filename: "schema_normalization.sql",
    language: "SQL",
    question:
      "Which normal form removes partial dependency from a relational database?",
    codeSnippet: `-- StudentCourse (StudentID, CourseID, StudentName, Grade)
-- Dependency: StudentID -> StudentName (Partial Dependency)
-- Non-key attribute depends on part of composite key`,
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
    domain: "Dependency Theory",
    filename: "transitive_dependency.sql",
    language: "SQL",
    question:
      "Which normal form removes transitive dependency?",
    codeSnippet: `-- Orders (OrderID, CustomerID, CustomerCity)
-- OrderID -> CustomerID, CustomerID -> CustomerCity
-- Transitive: OrderID -> CustomerCity via non-key attribute`,
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
    filename: "atomic_transaction.sql",
    language: "SQL",
    question:
      "Which property of a transaction ensures that it is treated as an indivisible unit?",
    codeSnippet: `BEGIN TRANSACTION;
  UPDATE Accounts SET balance = balance - 500 WHERE id = 101;
  UPDATE Accounts SET balance = balance + 500 WHERE id = 202;
COMMIT; -- Either all operations succeed or none take effect`,
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
    domain: "Storage & Persistence",
    filename: "durability_wal.c",
    language: "C / C++",
    question:
      "Which property ensures that committed data survives a system failure?",
    codeSnippet: `int commit_transaction(Transaction* txn) {
    flush_wal_to_disk(txn->log_buffer); // Write-ahead logging
    return sync_fs(txn->data_fd);       // Survives power failure
}`,
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
    domain: "Query Execution",
    filename: "selection_operator.ra",
    language: "Relational Algebra",
    question:
      "Which relational algebra operation is used to select rows satisfying a condition?",
    codeSnippet: `-- Relational algebra expression:
σ (Salary > 60000 AND Department = 'AI') (Employees)
-- Horizontal filtering of tuples matching predicate`,
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
    domain: "Attribute Projection",
    filename: "projection_operator.ra",
    language: "Relational Algebra",
    question:
      "Which operation is used to select specific columns from a relation?",
    codeSnippet: `-- Extract vertical subset of relation:
π (EmployeeID, FullName, JobTitle) (Employees)
-- Eliminates non-specified columns and duplicates`,
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
    domain: "First Normal Form",
    filename: "atomic_values.sql",
    language: "SQL",
    question:
      "A relation is in 1NF when its attributes contain:",
    codeSnippet: `-- Non-1NF: PhoneNumbers = ['555-0199', '555-0144'] (Multi-valued)
-- 1NF Requirement: Every cell holds single, indivisible scalar value
CREATE TABLE Student (ID INT, Name VARCHAR(50), Phone VARCHAR(20));`,
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
    domain: "ACID Isolation",
    filename: "isolation_locks.sql",
    language: "SQL",
    question:
      "Which schedule property prevents two transactions from interfering with each other?",
    codeSnippet: `-- Concurrent Transaction Execution:
-- T1: SELECT * FROM Inventory WHERE ItemID = 42;
-- T2: Concurrent update blocked until T1 releases lock`,
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
    domain: "Binary Operations",
    filename: "theta_join.ra",
    language: "Relational Algebra",
    question:
      "Which operation combines tuples from two relations based on a condition?",
    codeSnippet: `-- Combine matching tuples across relations:
Students ⋈ (Students.DeptID = Departments.DeptID) Departments
-- Produces concatenated relation matching theta predicate`,
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
    domain: "Advanced Normal Forms",
    filename: "bcnf_criteria.sql",
    language: "SQL",
    question:
      "BCNF is stricter than which normal form?",
    codeSnippet: `-- BCNF Condition:
-- For every non-trivial functional dependency X -> Y,
-- X MUST be a superkey of the relation.`,
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
  // MAIN ASSESSMENT VIEW (EXACT STITCH PALETTE)
  // ============================================

  return (
    <div className="max-w-3xl mx-auto space-y-3.5 pb-8 font-sans">
      {/* ========================================
          1. HEADER BAR
      ======================================== */}
      <header className="rounded-2xl bg-[#1c1f2a] border border-[#313540]/80 px-4 sm:px-5 py-3.5 backdrop-blur-xl shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Stitch-Style Pulse Logo Mark */}
            <div className="w-8 h-8 rounded-xl bg-[#4d8eff]/15 border border-[#4d8eff]/30 flex items-center justify-center text-[#4d8eff] shrink-0">
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
                <span className="font-bold text-[#dfe2f1] tracking-tight text-sm sm:text-base truncate">
                  StudyRecover AI
                </span>
                <span className="hidden sm:inline text-[#8c909f] text-xs">/</span>
                <span className="hidden sm:inline text-[#c2c6d6] text-xs truncate font-medium">
                  Diagnostic Assessment
                </span>
              </div>

              {/* AI Engine Status Indicator */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4edea3]">
                  AI Engine Active
                </span>
              </div>
            </div>
          </div>

          {/* Profile Avatar Icon */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#4d8eff]/20 border border-[#4d8eff]/40 text-[#adc6ff] flex items-center justify-center font-semibold text-xs shadow-sm">
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
          2. ASSESSMENT PROGRESS CARD
      ======================================== */}
      <div className="bg-[#1c1f2a] border border-[#313540]/80 rounded-2xl p-4 sm:p-5 shadow-md space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base text-[#4d8eff]">🧠</span>
            <span className="text-[#dfe2f1] font-semibold text-sm tracking-wide">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#262a35] border border-[#313540]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
            <span className="text-xs font-semibold text-[#4edea3] truncate max-w-[150px] sm:max-w-[220px]">
              {question.topic}
            </span>
          </div>
        </div>

        {/* Gradient Progress Bar */}
        <div className="w-full bg-[#313540] rounded-full h-2 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#4d8eff] to-[#4edea3] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-[#c2c6d6]">
          <span>Foundations Diagnostic</span>
          <span className="font-semibold text-[#4d8eff]">{progress}% Complete</span>
        </div>
      </div>

      {/* ========================================
          3. QUESTION CARD + CODE SNIPPET BOX
      ======================================== */}
      <div className="bg-[#1c1f2a] border border-[#313540]/80 rounded-2xl p-4 sm:p-6 shadow-md space-y-3.5">
        <div className="flex items-start gap-3">
          <span className="flex shrink-0 items-center justify-center w-6 h-6 rounded-md bg-[#4d8eff] text-[#00285d] font-bold text-xs mt-0.5 shadow-sm">
            Q{currentQuestion + 1}
          </span>
          <h2 className="text-base sm:text-lg font-semibold text-[#dfe2f1] leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* macOS Style Code Snippet Box */}
        {question.codeSnippet && (
          <div className="bg-[#0a0e18] rounded-xl p-3.5 sm:p-4 border border-[#313540]/50 font-mono text-xs overflow-x-auto shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#313540]/40 text-[#8c909f] text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 font-mono text-[#c2c6d6] text-[11px]">
                  {question.filename || "query.sql"}
                </span>
              </div>
              <span className="text-[11px] text-[#8c909f] uppercase tracking-wider font-semibold">
                {question.language || "SQL"}
              </span>
            </div>
            <pre className="text-[#dfe2f1] leading-relaxed text-xs overflow-x-auto selection:bg-[#4d8eff]/30">
              {question.codeSnippet}
            </pre>
          </div>
        )}
      </div>

      {/* ========================================
          4. ANSWER OPTIONS (A, B, C, D)
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
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150 flex items-center gap-3.5 select-none cursor-pointer ${
                isSelected
                  ? "bg-[#262a35] border-2 border-[#4d8eff] text-white shadow-[0_0_0_2px_rgba(77,142,255,0.25)]"
                  : "bg-[#1c1f2a] border-[#313540]/80 hover:bg-[#262a35] hover:border-[#424754] text-[#dfe2f1]"
              }`}
            >
              {/* Circular Indicator */}
              <div
                className={`w-6 h-6 rounded-full flex shrink-0 items-center justify-center text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-[#4d8eff] text-[#00285d] shadow-sm"
                    : "bg-[#313540] text-[#c2c6d6]"
                }`}
              >
                {isSelected ? (
                  <svg
                    className="w-3.5 h-3.5 stroke-[3]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
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
              <span className="flex-1 font-medium text-sm leading-snug">
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================
          5. TOPIC METADATA BADGES
      ======================================== */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <span className="text-[#8c909f] text-sm">🏷️</span>
        <span className="text-xs text-[#8c909f] font-medium">Topic:</span>

        <span className="px-3 py-1 rounded-full bg-[#1c1f2a] border border-[#313540]/80 text-[#dfe2f1] text-xs font-medium">
          {question.topic}
        </span>

        {question.domain && (
          <span className="px-3 py-1 rounded-full bg-[#1c1f2a] border border-[#313540]/80 text-[#c2c6d6] text-xs font-medium">
            {question.domain}
          </span>
        )}

        <span className="px-3 py-1 rounded-full bg-[#171b26] border border-[#4edea3]/20 text-[#4edea3] text-xs font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
          High Diagnostic Weight
        </span>
      </div>

      {/* ========================================
          6. NAVIGATION BUTTONS
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
                ? "bg-[#1c1f2a]/40 border-[#313540]/30 text-[#8c909f]/40 cursor-not-allowed"
                : "bg-[#1c1f2a] hover:bg-[#262a35] border-[#313540]/80 text-[#dfe2f1] hover:text-white"
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
                ? "bg-[#262a35] text-[#8c909f] border border-[#313540]/50 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-[#4d8eff] to-[#3b82f6] hover:from-[#3b82f6] hover:to-[#2563eb] text-white shadow-[#4d8eff]/20"
            }`}
          >
            <span>
              {isLastQuestion ? "Finish Assessment" : "Submit & Next Question"}
            </span>
            <span>→</span>
          </button>
        </div>

        {/* 7. Auto-save status label */}
        <div className="flex items-center justify-center gap-1.5 text-center text-[#8c909f] text-xs py-1">
          <span className="text-[#4edea3] text-sm">☁✓</span>
          <span>
            Answers auto-saved to session state. {totalQuestions} questions test foundational database domains.
          </span>
        </div>
      </div>
    </div>
  );
}

export default Assessment;