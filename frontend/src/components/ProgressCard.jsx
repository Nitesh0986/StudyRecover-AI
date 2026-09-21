function ProgressCard({ results = [] }) {
  // No assessment yet
  if (results.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <p className="text-slate-400 text-sm">
          Assessment Progress
        </p>

        <h2 className="text-xl font-semibold text-white mt-1">
          Your Progress
        </h2>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">
              Assessment
            </span>

            <span className="text-sm text-slate-500">
              Not started
            </span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-700 rounded-full"
              style={{ width: "0%" }}
            />
          </div>

          <p className="text-slate-500 text-sm mt-4">
            Complete your assessment to start tracking your
            learning progress.
          </p>
        </div>
      </div>
    );
  }

  // Calculate performance
  const correctAnswers = results.filter(
    (result) => result.isCorrect
  ).length;

  const totalQuestions = results.length;

  const score = Math.round(
    (correctAnswers / totalQuestions) * 100
  );

  // Determine progress message
  let progressMessage;

  if (score >= 80) {
    progressMessage = "Great start! Keep building on it.";
  } else if (score >= 60) {
    progressMessage = "You're making progress. Keep practicing.";
  } else if (score >= 40) {
    progressMessage = "Keep going. Focus on your weak areas.";
  } else {
    progressMessage = "Let's strengthen the fundamentals first.";
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">
            Assessment Progress
          </p>

          <h2 className="text-xl font-semibold text-white mt-1">
            Your Progress
          </h2>
        </div>

        <span className="text-sm text-blue-400">
          {score}%
        </span>
      </div>

      {/* Score */}
      <div className="mt-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-3xl font-bold text-white">
              {correctAnswers}/{totalQuestions}
            </span>

            <span className="text-slate-500 text-sm ml-2">
              correct
            </span>
          </div>

          <span className="text-slate-400 text-sm">
            {score}% performance
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              score < 50
                ? "bg-red-400"
                : score < 75
                ? "bg-orange-400"
                : "bg-green-400"
            }`}
            style={{
              width: `${score}%`,
            }}
          />
        </div>

        {/* Message */}
        <p className="text-slate-400 text-sm mt-4">
          {progressMessage}
        </p>
      </div>

      {/* Small stats */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="bg-slate-800/70 rounded-xl p-3">
          <p className="text-slate-500 text-xs">
            Questions
          </p>

          <p className="text-white font-semibold mt-1">
            {totalQuestions}
          </p>
        </div>

        <div className="bg-slate-800/70 rounded-xl p-3">
          <p className="text-slate-500 text-xs">
            Correct
          </p>

          <p className="text-green-400 font-semibold mt-1">
            {correctAnswers}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProgressCard;