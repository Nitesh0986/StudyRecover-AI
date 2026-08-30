import { useState } from "react";
import AssessmentResult from "./AssessmentResult";

const questions = [
  {
    id: 1,
    topic: "Normalization",
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

  const progress = Math.round(
    ((currentQuestion + 1) / questions.length) * 100
  );

  // =====================================================
  // HANDLE NEXT QUESTION
  // =====================================================

  const handleNext = () => {
    // User must select an option
    if (selectedAnswer === null) {
      return;
    }

    // Check the selected answer
    const isCorrect =
      selectedAnswer === question.answer;

    // Create result for current question
    const answerResult = {
      questionId: question.id,
      topic: question.topic,
      selectedAnswer: selectedAnswer,
      correctAnswer: question.answer,
      isCorrect: isCorrect,
    };

    // ===================================================
    // LAST QUESTION
    // ===================================================

    if (currentQuestion === questions.length - 1) {
      /*
        IMPORTANT:

        React state updates are asynchronous.

        Therefore, instead of doing:

        setResults(...)
        and then using results,

        we create the final array manually.
      */

      const completedResults = [
        ...results,
        answerResult,
      ];

      // Save results in React state
      setResults(completedResults);

      // Save results for AssessmentResult
      setFinalResults(completedResults);

      // =================================================
      // SAVE ASSESSMENT DATA TO LOCAL STORAGE
      // =================================================

      localStorage.setItem(
        "studyRecoverResults",
        JSON.stringify(completedResults)
      );

      // Save completion status
      localStorage.setItem(
        "studyRecoverAssessmentCompleted",
        "true"
      );

      // Calculate score
      const correctAnswers =
        completedResults.filter(
          (result) => result.isCorrect
        ).length;

      const percentage = Math.round(
        (correctAnswers / questions.length) * 100
      );

      // Save score separately
      localStorage.setItem(
        "studyRecoverScore",
        percentage.toString()
      );

      // Show result screen
      setCompleted(true);

      return;
    }

    // ===================================================
    // NOT LAST QUESTION
    // ===================================================

    setResults((previousResults) => [
      ...previousResults,
      answerResult,
    ]);

    // Move to next question
    setCurrentQuestion(
      (previousQuestion) =>
        previousQuestion + 1
    );

    // Clear previous selection
    setSelectedAnswer(null);
  };

  // =====================================================
  // SHOW RESULT SCREEN
  // =====================================================

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

  // =====================================================
  // ASSESSMENT UI
  // =====================================================

  return (
    <div className="max-w-4xl mx-auto">

      {/* ================= HEADER ================= */}

      <div className="mb-8">

        <p className="text-blue-400 text-sm font-medium mb-2">
          KNOWLEDGE ASSESSMENT
        </p>

        <h1 className="text-3xl font-bold text-white">
          Let's understand your learning gaps
        </h1>

        <p className="text-slate-400 mt-2">
          Answer a short set of questions so
          StudyRecover AI can identify the topics
          that need your attention.
        </p>

      </div>

      {/* ================= QUESTION CARD ================= */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

        {/* Question Header */}

        <div className="flex items-center justify-between mb-4">

          <p className="text-slate-400 text-sm">
            Question {currentQuestion + 1} of{" "}
            {questions.length}
          </p>

          <p className="text-blue-400 text-sm">
            {progress}%
          </p>

        </div>

        {/* ================= PROGRESS BAR ================= */}

        <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">

          <div
            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        {/* ================= TOPIC ================= */}

        <p className="text-blue-400 text-sm font-medium mb-3">
          {question.topic}
        </p>

        {/* ================= QUESTION ================= */}

        <h2 className="text-xl font-semibold text-white leading-relaxed">
          {question.question}
        </h2>

        {/* ================= OPTIONS ================= */}

        <div className="space-y-3 mt-8">

          {question.options.map(
            (option, index) => {

              const isSelected =
                selectedAnswer === index;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setSelectedAnswer(index)
                  }
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600 border-blue-400 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-200 hover:border-blue-500 hover:bg-slate-800/80"
                  }`}
                >

                  <span className="font-medium">
                    {String.fromCharCode(
                      65 + index
                    )}
                    .
                  </span>{" "}

                  {option}

                </button>
              );
            }
          )}

        </div>

        {/* ================= NEXT BUTTON ================= */}

        <div className="flex justify-end mt-8">

          <button
            type="button"
            onClick={handleNext}
            disabled={
              selectedAnswer === null
            }
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              selectedAnswer === null
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >

            {currentQuestion ===
            questions.length - 1
              ? "Finish Assessment"
              : "Next Question"}

          </button>

        </div>

      </div>

    </div>
  );
}

export default Assessment;