import { useMemo, useState } from "react";

const practiceQuestions = [
  // ============================================
  // NORMALIZATION
  // ============================================

  {
    id: 1,
    topic: "Normalization",
    question:
      "Which normal form requires all attributes to contain atomic values?",
    options: [
      "First Normal Form",
      "Second Normal Form",
      "Third Normal Form",
      "BCNF",
    ],
    answer: 0,
    explanation:
      "1NF requires every attribute to contain atomic, indivisible values. Repeating groups and multi-valued attributes are not allowed.",
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
    explanation:
      "3NF removes transitive dependencies, where a non-key attribute depends on another non-key attribute.",
  },

  {
    id: 3,
    topic: "Normalization",
    question:
      "Which normal form removes partial dependency?",
    options: [
      "1NF",
      "2NF",
      "3NF",
      "BCNF",
    ],
    answer: 1,
    explanation:
      "2NF removes partial dependency. A non-key attribute must depend on the whole candidate key rather than only part of a composite key.",
  },

  {
    id: 4,
    topic: "Normalization",
    question:
      "Which normal form is stricter than 3NF?",
    options: [
      "1NF",
      "2NF",
      "BCNF",
      "None",
    ],
    answer: 2,
    explanation:
      "BCNF is stricter than 3NF because every determinant must be a candidate key.",
  },

  {
    id: 5,
    topic: "Normalization",
    question:
      "What is the main purpose of database normalization?",
    options: [
      "Increase data redundancy",
      "Reduce redundancy and anomalies",
      "Remove all primary keys",
      "Make every table larger",
    ],
    answer: 1,
    explanation:
      "Normalization organizes data to reduce unnecessary redundancy and prevent insertion, deletion, and update anomalies.",
  },

  // ============================================
  // TRANSACTIONS
  // ============================================

  {
    id: 6,
    topic: "Transactions",
    question:
      "Which ACID property ensures that a transaction is completed entirely or not at all?",
    options: [
      "Consistency",
      "Isolation",
      "Atomicity",
      "Durability",
    ],
    answer: 2,
    explanation:
      "Atomicity treats a transaction as one indivisible unit. Either all operations succeed or the transaction has no effect.",
  },

  {
    id: 7,
    topic: "Transactions",
    question:
      "Which ACID property ensures that committed data survives a system failure?",
    options: [
      "Atomicity",
      "Consistency",
      "Isolation",
      "Durability",
    ],
    answer: 3,
    explanation:
      "Durability ensures that once a transaction is committed, its changes remain stored even after a system failure.",
  },

  {
    id: 8,
    topic: "Transactions",
    question:
      "Which ACID property ensures that a database moves from one valid state to another?",
    options: [
      "Atomicity",
      "Consistency",
      "Isolation",
      "Durability",
    ],
    answer: 1,
    explanation:
      "Consistency ensures that a transaction preserves database rules and constraints, moving the database from one valid state to another.",
  },

  {
    id: 9,
    topic: "Transactions",
    question:
      "Which ACID property prevents concurrent transactions from interfering with each other?",
    options: [
      "Atomicity",
      "Consistency",
      "Isolation",
      "Durability",
    ],
    answer: 2,
    explanation:
      "Isolation controls how concurrent transactions interact so that one transaction does not improperly interfere with another.",
  },

  {
    id: 10,
    topic: "Transactions",
    question:
      "A transaction that has successfully completed is usually called:",
    options: [
      "Aborted",
      "Committed",
      "Rolled back",
      "Failed",
    ],
    answer: 1,
    explanation:
      "A committed transaction has successfully completed and its changes are made permanent according to the transaction system.",
  },

  // ============================================
  // RELATIONAL ALGEBRA
  // ============================================

  {
    id: 11,
    topic: "Relational Algebra",
    question:
      "Which relational algebra operation selects rows satisfying a condition?",
    options: [
      "Projection",
      "Selection",
      "Join",
      "Union",
    ],
    answer: 1,
    explanation:
      "Selection filters rows based on a condition and is represented by the sigma (σ) operator.",
  },

  {
    id: 12,
    topic: "Relational Algebra",
    question:
      "Which relational algebra operation selects specific columns?",
    options: [
      "Selection",
      "Projection",
      "Join",
      "Difference",
    ],
    answer: 1,
    explanation:
      "Projection selects specific attributes or columns from a relation and is represented by the pi (π) operator.",
  },

  {
    id: 13,
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
    explanation:
      "Join combines tuples from two relations when they satisfy a specified join condition.",
  },

  {
    id: 14,
    topic: "Relational Algebra",
    question:
      "Which operation combines tuples from two compatible relations?",
    options: [
      "Union",
      "Selection",
      "Projection",
      "Rename",
    ],
    answer: 0,
    explanation:
      "Union combines tuples from two union-compatible relations into a single relation.",
  },

  {
    id: 15,
    topic: "Relational Algebra",
    question:
      "Which relational algebra operation removes tuples found in the second relation from the first?",
    options: [
      "Union",
      "Difference",
      "Projection",
      "Join",
    ],
    answer: 1,
    explanation:
      "Set difference returns tuples that are present in the first relation but not in the second relation.",
  },
];

function Practice({ topic, onBack }) {
  const availableTopics = [
    {
      name: "Normalization",
      questionsCount: 5,
      description: "1NF, 2NF, 3NF, BCNF & database anomalies",
    },
    {
      name: "Transactions",
      questionsCount: 5,
      description: "ACID properties, states & serializability",
    },
    {
      name: "Relational Algebra",
      questionsCount: 5,
      description: "Selection, projection, joins & set operations",
    },
  ];

  const [activeTopic, setActiveTopic] = useState(topic);

  // Keep activeTopic synced when parent provides topic
  const currentTopic = activeTopic || topic;

  // Pure filtering without impure Math.random during render
  const filteredQuestions = useMemo(() => {
    if (!currentTopic) return [];
    return practiceQuestions.filter((q) => q.topic === currentTopic);
  }, [currentTopic]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [score, setScore] = useState(0);

  const [completed, setCompleted] =
    useState(false);

  const [finalScore, setFinalScore] =
    useState(0);

  const [showExplanation, setShowExplanation] =
    useState(false);

  const handleSelectTopic = (newTopic) => {
    setActiveTopic(newTopic);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinalScore(0);
    setCompleted(false);
    setShowExplanation(false);
  };

  // ============================================
  // NO TOPIC SELECTED (Show topic selector)
  // ============================================

  if (!currentTopic) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-blue-400 text-sm font-medium mb-2">
            TARGETED PRACTICE
          </p>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Select a Topic to Practice
          </h1>
          <p className="text-slate-400 mt-2 max-w-xl leading-relaxed">
            Choose a topic to test your knowledge with immediate explanations and progress tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {availableTopics.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => handleSelectTopic(item.name)}
              className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 text-left transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-3">
                  {item.questionsCount} questions
                </span>
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <span className="mt-6 text-sm font-medium text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Start Practice <span>→</span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-slate-500 hover:text-slate-300 text-sm transition"
          >
            ← Back to Study Plan
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // NO QUESTIONS FOUND
  // ============================================

  if (filteredQuestions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">
          <div className="text-4xl">
            📖
          </div>

          <h2 className="text-xl font-semibold text-white mt-5">
            Questions are coming soon
          </h2>

          <p className="text-slate-400 text-sm mt-3">
            We don't have practice questions for this topic
            yet.
          </p>

          <button
            type="button"
            onClick={() => setActiveTopic(null)}
            className="mt-6 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition"
          >
            Choose Another Topic
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // SAVE RESULT
  // ============================================

  const savePracticeResult = (completedScore) => {
    const savedPracticeResults =
      localStorage.getItem(
        "studyRecoverPracticeResults"
      );

    let practiceResults = [];

    if (savedPracticeResults) {
      try {
        const parsed = JSON.parse(savedPracticeResults);
        practiceResults = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error(
          "Unable to read saved practice results:",
          error
        );
      }
    }

    const percentage = Math.round(
      (completedScore /
        filteredQuestions.length) *
        100
    );

    const practiceResult = {
      topic: currentTopic,
      score: completedScore,
      totalQuestions: filteredQuestions.length,
      percentage,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "studyRecoverPracticeResults",
      JSON.stringify([
        ...practiceResults,
        practiceResult,
      ])
    );
  };

  // ============================================
  // COMPLETED
  // ============================================

  if (completed) {
    const percentage = Math.round(
      (finalScore /
        filteredQuestions.length) *
        100
    );

    let message;

    if (percentage >= 90) {
      message =
        "Excellent work! You look really comfortable with this topic.";
    } else if (percentage >= 75) {
      message =
        "Nice work! You're getting a good handle on this.";
    } else if (percentage >= 50) {
      message =
        "You're making progress. A little more practice should help.";
    } else {
      message =
        "That's okay. Mistakes are part of learning. Let's try again after reviewing the explanations.";
    }

    return (
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <p className="text-blue-400 text-sm font-medium mb-2">
            PRACTICE COMPLETE
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Nice job showing up.
          </h1>

          <p className="text-slate-400 mt-3">
            Here's how your {currentTopic} session went.
          </p>

        </div>

        {/* RESULT */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 text-center">

          <div className="w-32 h-32 mx-auto rounded-full border-8 border-blue-500/20 flex items-center justify-center">

            <div>

              <p className="text-3xl font-bold text-white">
                {percentage}%
              </p>

              <p className="text-xs text-slate-500 mt-1">
                this session
              </p>

            </div>

          </div>

          <h2 className="text-2xl font-semibold text-white mt-7">
            {finalScore} of{" "}
            {filteredQuestions.length} correct
          </h2>

          <p className="text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
            {message}
          </p>

          {/* ACTIONS */}

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">

            <button
              type="button"
              onClick={onBack}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition"
            >
              Back to Study Plan
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswer(null);
                setScore(0);
                setFinalScore(0);
                setCompleted(false);
                setShowExplanation(false);
              }}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-medium transition"
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={() => handleSelectTopic(null)}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl font-medium transition"
            >
              Change Topic
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ============================================
  // CURRENT QUESTION
  // ============================================

  const question =
    filteredQuestions[currentQuestion];

  const answerChecked = showExplanation;

  const isCorrect =
    selectedAnswer !== null &&
    selectedAnswer === question.answer;

  const progress =
    ((currentQuestion + 1) /
      filteredQuestions.length) *
    100;

  // ============================================
  // SELECT ANSWER
  // ============================================

  const handleSelectAnswer = (index) => {
    if (answerChecked) {
      return;
    }

    setSelectedAnswer(index);
  };

  // ============================================
  // CHECK ANSWER
  // ============================================

  const handleAnswer = () => {
    if (selectedAnswer === null) {
      return;
    }

    setShowExplanation(true);
  };

  // ============================================
  // NEXT
  // ============================================

  const handleNext = () => {
    if (selectedAnswer === null) {
      return;
    }

    const answerIsCorrect =
      selectedAnswer === question.answer;

    const updatedScore = answerIsCorrect
      ? score + 1
      : score;

    if (answerIsCorrect) {
      setScore(updatedScore);
    }

    if (
      currentQuestion ===
      filteredQuestions.length - 1
    ) {
      setFinalScore(updatedScore);

      savePracticeResult(updatedScore);

      setCompleted(true);

      return;
    }

    setCurrentQuestion(
      (previousQuestion) =>
        previousQuestion + 1
    );

    setSelectedAnswer(null);

    setShowExplanation(false);
  };

  // ============================================
  // UI
  // ============================================

  return (
    <div className="max-w-4xl mx-auto">

      {/* ========================================
          TOP NAVIGATION
      ======================================== */}

      <div className="mb-8 flex items-center justify-between">

        <button
          type="button"
          onClick={onBack}
          className="text-slate-500 hover:text-white text-sm transition"
        >
          ← Back to study plan
        </button>

        <button
          type="button"
          onClick={() => handleSelectTopic(null)}
          className="text-slate-500 hover:text-blue-400 text-sm transition"
        >
          Change topic
        </button>

      </div>

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="mb-7">

        <div className="flex items-center justify-between gap-4">

          <div>

            <p className="text-blue-400 text-sm font-medium mb-2">
              PRACTICE SESSION
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Let's work on {currentTopic}.
            </h1>

          </div>

          <div className="hidden sm:block text-right">

            <p className="text-slate-500 text-xs">
              QUESTION
            </p>

            <p className="text-white font-semibold mt-1">
              {currentQuestion + 1} /{" "}
              {filteredQuestions.length}
            </p>

          </div>

        </div>

        <p className="text-slate-400 mt-3 leading-relaxed">
          Take your time. The goal isn't just to get the
          answer right — it's to understand why.
        </p>

      </div>

      {/* ========================================
          PROGRESS
      ======================================== */}

      <div className="mb-7">

        <div className="flex items-center justify-between text-xs mb-2">

          <span className="text-slate-500">
            Your progress
          </span>

          <span className="text-slate-400">
            {Math.round(progress)}%
          </span>

        </div>

        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">

          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* ========================================
          QUESTION CARD
      ======================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">

        {/* QUESTION */}

        <div className="mb-7">

          <span className="inline-flex px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs">
            {topic}
          </span>

          <h2 className="text-xl md:text-2xl font-semibold text-white mt-5 leading-relaxed">
            {question.question}
          </h2>

        </div>

        {/* OPTIONS */}

        <div className="space-y-3">

          {question.options.map(
            (option, index) => {

              const selected =
                selectedAnswer === index;

              const correct =
                index === question.answer;

              let optionStyle =
                "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800";

              if (answerChecked) {

                if (correct) {
                  optionStyle =
                    "border-green-500/40 bg-green-500/10";
                } else if (selected) {
                  optionStyle =
                    "border-red-500/40 bg-red-500/10";
                } else {
                  optionStyle =
                    "border-slate-800 bg-slate-800/30 opacity-60";
                }

              } else if (selected) {

                optionStyle =
                  "border-blue-500/60 bg-blue-500/10";

              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={answerChecked}
                  onClick={() =>
                    handleSelectAnswer(index)
                  }
                  className={`w-full text-left p-4 rounded-2xl border transition ${optionStyle}`}
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border shrink-0 text-sm font-medium ${
                        answerChecked &&
                        correct
                          ? "border-green-400 text-green-400"
                          : answerChecked &&
                            selected
                          ? "border-red-400 text-red-400"
                          : selected
                          ? "border-blue-400 text-blue-400"
                          : "border-slate-600 text-slate-400"
                      }`}
                    >
                      {String.fromCharCode(
                        65 + index
                      )}
                    </div>

                    <span className="text-slate-200 text-sm md:text-base">
                      {option}
                    </span>

                    {answerChecked &&
                      correct && (
                        <span className="ml-auto text-green-400 text-lg">
                          ✓
                        </span>
                      )}

                    {answerChecked &&
                      selected &&
                      !correct && (
                        <span className="ml-auto text-red-400 text-lg">
                          ×
                        </span>
                      )}

                  </div>

                </button>
              );
            }
          )}

        </div>

        {/* ======================================
            EXPLANATION
        ====================================== */}

        {showExplanation && (

          <div
            className={`mt-6 rounded-2xl border p-5 ${
              isCorrect
                ? "border-green-500/20 bg-green-500/5"
                : "border-orange-500/20 bg-orange-500/5"
            }`}
          >

            <div className="flex gap-3">

              <div className="text-xl">

                {isCorrect
                  ? "🌱"
                  : "💡"}

              </div>

              <div>

                <h3
                  className={`font-semibold ${
                    isCorrect
                      ? "text-green-400"
                      : "text-orange-400"
                  }`}
                >
                  {isCorrect
                    ? "You got it!"
                    : "Good attempt."}
                </h3>

                {!isCorrect && (

                  <p className="text-slate-300 text-sm mt-2">

                    The answer is{" "}

                    <span className="text-white font-medium">
                      {question.options[
                        question.answer
                      ]}
                    </span>
                    .

                  </p>

                )}

                <div className="mt-3">

                  <p className="text-slate-500 text-xs uppercase tracking-wider">
                    Why?
                  </p>

                  <p className="text-slate-300 text-sm leading-relaxed mt-2">
                    {question.explanation}
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

        {/* ======================================
            ACTION
        ====================================== */}

        <div className="flex justify-end mt-7">

          {!showExplanation ? (

            <button
              type="button"
              onClick={handleAnswer}
              disabled={
                selectedAnswer === null
              }
              className={`px-6 py-3 rounded-xl font-medium transition ${
                selectedAnswer === null
                  ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              Check my answer
            </button>

          ) : (

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition"
            >
              {currentQuestion ===
              filteredQuestions.length - 1
                ? "Finish session"
                : "Next question →"}
            </button>

          )}

        </div>

      </div>

      {/* ========================================
          ENCOURAGEMENT
      ======================================== */}

      <div className="text-center mt-6">

        <p className="text-slate-600 text-xs">
          💙 No pressure. Every mistake gives you
          something useful to learn.
        </p>

      </div>

    </div>
  );
}

export default Practice;