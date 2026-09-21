function RiskScore({ results = [] }) {
  // No assessment yet
  if (results.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <p className="text-slate-400 text-sm">
          Learning Risk
        </p>

        <h2 className="text-xl font-semibold text-white mt-1">
          Risk Score
        </h2>

        <div className="flex flex-col items-center justify-center mt-8">
          <div className="w-36 h-36 rounded-full border-8 border-slate-800 flex items-center justify-center">
            <span className="text-4xl font-bold text-slate-600">
              --
            </span>
          </div>

          <p className="text-slate-400 text-sm text-center mt-5">
            Complete your assessment to calculate your
            learning risk.
          </p>
        </div>
      </div>
    );
  }

  // Calculate score
  const correctAnswers = results.filter(
    (result) => result.isCorrect
  ).length;

  const totalQuestions = results.length;

  const overallScore = Math.round(
    (correctAnswers / totalQuestions) * 100
  );

  // Risk = 100 - performance
  const riskScore = 100 - overallScore;

  // Risk status
  let status;
  let statusColor;
  let ringColor;

  if (riskScore >= 70) {
    status = "Needs attention";
    statusColor = "text-red-400";
    ringColor = "text-red-400";
  } else if (riskScore >= 40) {
    status = "Some attention needed";
    statusColor = "text-orange-400";
    ringColor = "text-orange-400";
  } else {
    status = "Looking good";
    statusColor = "text-green-400";
    ringColor = "text-green-400";
  }

  // Circle calculation
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const strokeOffset =
    circumference - (riskScore / 100) * circumference;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">
            Learning Risk
          </p>

          <h2 className="text-xl font-semibold text-white mt-1">
            Risk Score
          </h2>
        </div>

        <span className={`text-sm ${statusColor}`}>
          {status}
        </span>
      </div>

      {/* Risk Circle */}
      <div className="flex flex-col items-center justify-center mt-6">
        
        <div className="relative w-36 h-36">
          
          <svg
            className="w-36 h-36 -rotate-90"
            viewBox="0 0 120 120"
          >
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-slate-800"
            />

            {/* Risk progress */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              className={`${ringColor} transition-all duration-700`}
            />
          </svg>

          {/* Number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {riskScore}
            </span>

            <span className="text-xs text-slate-500">
              / 100
            </span>
          </div>

        </div>

        {/* Explanation */}
        <p className="text-slate-400 text-sm text-center mt-5">
          {riskScore >= 70
            ? "Several learning gaps need attention."
            : riskScore >= 40
            ? "A few areas need focused practice."
            : "Your current learning performance looks good."}
        </p>

        {/* Score breakdown */}
        <div className="flex items-center gap-3 mt-4 text-xs">
          <span className="text-slate-500">
            Performance
          </span>

          <span className="text-white font-medium">
            {overallScore}%
          </span>
        </div>

      </div>
    </div>
  );
}

export default RiskScore;