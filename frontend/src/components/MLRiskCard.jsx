import { useEffect, useState } from "react";

function MLRiskCard({ assessmentResults = [] }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!assessmentResults || assessmentResults.length === 0) {
      return;
    }

    let isMounted = true;

    const predictRisk = async () => {
      setLoading(true);
      setError("");

      try {
        const correctAnswers =
          assessmentResults.filter(
            (result) => result.isCorrect
          ).length;

        const assessmentScore = Math.round(
          (correctAnswers /
            assessmentResults.length) *
            100
        );

        // Load practice history
        const savedPracticeResults =
          localStorage.getItem(
            "studyRecoverPracticeResults"
          );

        let practiceResults = [];

        if (savedPracticeResults) {
          try {
            const parsed = JSON.parse(savedPracticeResults);
            practiceResults = Array.isArray(parsed) ? parsed : [];
          } catch {
            practiceResults = [];
          }
        }

        const practiceAverage =
          practiceResults.length > 0
            ? Math.round(
                practiceResults.reduce(
                  (total, result) =>
                    total + result.percentage,
                  0
                ) / practiceResults.length
              )
            : assessmentScore;

        const practiceAttempts =
          practiceResults.length;

        const improvement =
          practiceAverage - assessmentScore;

        const response = await fetch(
          "http://127.0.0.1:8000/api/predict-risk",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              assessment_score: assessmentScore,
              practice_average: practiceAverage,
              practice_attempts:
                practiceAttempts,
              improvement,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to get ML prediction"
          );
        }

        const data = await response.json();

        if (isMounted) {
          setPrediction(data.prediction);
        }
      } catch (err) {
        if (!isMounted) return;

        console.error(
          "ML prediction error:",
          err
        );

        setError(
          "ML prediction is currently unavailable."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    predictRisk();

    return () => {
      isMounted = false;
    };
  }, [assessmentResults]);

  if (assessmentResults.length === 0) {
    return null;
  }

  const getRiskStyle = (risk) => {
    if (risk === "High Risk") {
      return {
        text: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/15",
      };
    }

    if (risk === "Medium Risk") {
      return {
        text: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/15",
      };
    }

    return {
      text: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/15",
    };
  };

  const style = prediction
    ? getRiskStyle(prediction.risk)
    : null;

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-7">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
            LEARNING RISK
          </p>

          <h2 className="text-xl font-semibold text-white mt-2">
            What needs your attention?
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Based on your assessment and practice activity.
          </p>
        </div>

        <div className="text-2xl">
          🧠
        </div>

      </div>

      {loading && (
        <div className="mt-6">
          <p className="text-slate-400 text-sm">
            Looking at your learning pattern...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6">
          <p className="text-orange-400 text-sm">
            {error}
          </p>
        </div>
      )}

      {prediction && !loading && (
        <div
          className={`mt-6 rounded-2xl border p-5 ${style.bg} ${style.border}`}
        >
          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="text-slate-500 text-xs">
                CURRENT RISK
              </p>

              <p
                className={`text-2xl font-bold mt-1 ${style.text}`}
              >
                {prediction.risk}
              </p>
            </div>

            <div className="text-right">
              <p className="text-slate-500 text-xs">
                Confidence
              </p>

              <p className="text-white font-semibold mt-1">
                {prediction.confidence}%
              </p>
            </div>

          </div>

          <p className="text-slate-400 text-sm mt-4 leading-relaxed">
            This prediction is generated by the StudyRecover
            ML model using your current learning data.
          </p>
        </div>
      )}

    </section>
  );
}

export default MLRiskCard;