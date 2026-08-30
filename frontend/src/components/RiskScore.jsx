import { useEffect, useState } from "react";

function RiskScore() {
  const [riskScore, setRiskScore] = useState(null);

  useEffect(() => {
    const savedResults = localStorage.getItem("studyRecoverResults");

    if (!savedResults) {
      setRiskScore(null);
      return;
    }

    try {
      const results = JSON.parse(savedResults);

      if (!results.length) {
        setRiskScore(null);
        return;
      }

      const correctAnswers = results.filter(
        (result) => result.isCorrect
      ).length;

      const percentage = Math.round(
        (correctAnswers / results.length) * 100
      );

      // Higher score = lower learning risk
      const calculatedRisk = 100 - percentage;

      setRiskScore(calculatedRisk);
    } catch (error) {
      console.error("Unable to read assessment results:", error);
      setRiskScore(null);
    }
  }, []);

  if (riskScore === null) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[190px]">
        <p className="text-slate-400 text-sm">
          LEARNING HEALTH
        </p>

        <h2 className="text-3xl font-bold text-white mt-5">
          --
        </h2>

        <p className="text-slate-400 text-sm mt-2">
          Take your first assessment
        </p>
      </div>
    );
  }

  const getRiskStatus = () => {
    if (riskScore >= 70) {
      return {
        text: "Needs attention",
        color: "text-red-400",
      };
    }

    if (riskScore >= 40) {
      return {
        text: "Some attention needed",
        color: "text-orange-400",
      };
    }

    return {
      text: "Looking good",
      color: "text-green-400",
    };
  };

  const status = getRiskStatus();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[190px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm">
            LEARNING HEALTH
          </p>

          <div className="flex items-end gap-2 mt-5">
            <h2 className="text-3xl font-bold text-white">
              {riskScore}
            </h2>

            <span className="text-slate-500 text-sm mb-1">
              / 100
            </span>
          </div>

          <p className={`${status.color} text-sm mt-2 font-medium`}>
            {status.text}
          </p>
        </div>

        {/* Circular score */}
        <div className="relative w-16 h-16">
          <svg
            className="w-16 h-16 -rotate-90"
            viewBox="0 0 64 64"
          >
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              className="text-slate-800"
            />

            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              className="text-orange-400"
              strokeDasharray={`${(riskScore / 100) * 163} 163`}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {riskScore}%
            </span>
          </div>
        </div>
      </div>

      <p className="text-slate-400 text-sm mt-4">
        Based on your latest assessment performance.
      </p>
    </div>
  );
}

export default RiskScore;