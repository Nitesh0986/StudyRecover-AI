import { useEffect, useState } from "react";

import { calculateLearningGaps } from "../utils/learningGapEngine";

function RecoveryPlan({ results = [], onPracticeTopic }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [practiceResults] = useState(() => {
    const savedPracticeResults = localStorage.getItem(
      "studyRecoverPracticeResults"
    );

    if (!savedPracticeResults) {
      return [];
    }

    try {
      const parsed = JSON.parse(savedPracticeResults);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(
        "Unable to load practice results:",
        error
      );
      return [];
    }
  });

  // ============================================
  // ML STATE
  // ============================================

  const [mlPrediction, setMlPrediction] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState("");

  // ============================================
  // ML RISK PREDICTION
  // ============================================

  useEffect(() => {
    if (!results || results.length === 0) {
      return;
    }

    let isMounted = true;

    const predictRisk = async () => {
      setMlLoading(true);
      setMlError("");

      try {
        // ----------------------------------------
        // Assessment score
        // ----------------------------------------

        const correctAnswers = results.filter(
          (result) => result.isCorrect
        ).length;

        const assessmentScore =
          results.length > 0
            ? Math.round(
                (correctAnswers / results.length) * 100
              )
            : 0;

        // ----------------------------------------
        // Practice average
        // ----------------------------------------

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

        // ----------------------------------------
        // Practice attempts
        // ----------------------------------------

        const practiceAttempts =
          practiceResults.length;

        // ----------------------------------------
        // Improvement
        // ----------------------------------------

        const improvement =
          practiceAverage - assessmentScore;

        // ----------------------------------------
        // Send data to FastAPI
        // ----------------------------------------

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
              practice_attempts: practiceAttempts,
              improvement: improvement,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "ML prediction request failed."
          );
        }

        const data = await response.json();

        if (!isMounted) return;

        if (
          data.success &&
          data.prediction
        ) {
          setMlPrediction(data.prediction);
        } else {
          throw new Error(
            "Invalid ML prediction response."
          );
        }
      } catch (error) {
        if (!isMounted) return;

        console.error(
          "ML prediction error:",
          error
        );

        setMlError(
          "ML prediction is currently unavailable."
        );

        setMlPrediction(null);
      } finally {
        if (isMounted) {
          setMlLoading(false);
        }
      }
    };

    predictRisk();

    return () => {
      isMounted = false;
    };
  }, [results, practiceResults]);

  // ============================================
  // EMPTY STATE
  // ============================================

  if (results.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">

        <div className="mb-10">

          <p className="text-blue-400 text-sm font-medium mb-2">
            YOUR STUDY PLAN
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Let's find your next step.
          </h1>

          <p className="text-slate-400 mt-3 max-w-2xl leading-relaxed">
            Complete a short assessment first. We'll use
            your answers to suggest what you should focus
            on next.
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 text-center">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl">
            🧭
          </div>

          <h2 className="text-xl font-semibold text-white mt-6">
            Your plan starts with understanding where you are
          </h2>

          <p className="text-slate-400 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
            Don't worry about getting everything right.
            The assessment simply helps us understand where
            you might need a little extra support.
          </p>

        </div>

      </div>
    );
  }

  // ============================================
  // LEARNING GAP ENGINE
  // ============================================

  const learningGaps = calculateLearningGaps(
    results,
    practiceResults
  );

  if (learningGaps.length === 0) {
    return null;
  }

  // ============================================
  // SUMMARY
  // ============================================

  const weakestTopic = learningGaps[0];

  const attentionTopics = learningGaps.filter(
    (topic) => topic.masteryScore < 75
  ).length;

  const recoveredTopics = learningGaps.filter(
    (topic) => topic.masteryScore >= 90
  ).length;

  const improvingTopics = learningGaps.filter(
    (topic) => topic.trend === "Improving"
  ).length;

  // ============================================
  // PRACTICE
  // ============================================

  const handlePractice = (topic) => {
    setSelectedTopic(topic);

    if (onPracticeTopic) {
      onPracticeTopic(topic);
    }
  };

  // ============================================
  // SCORE COLORS
  // ============================================

  const getScoreColor = (score) => {
    if (score < 50) {
      return "text-red-400";
    }

    if (score < 75) {
      return "text-orange-400";
    }

    if (score < 90) {
      return "text-blue-400";
    }

    return "text-green-400";
  };

  const getBarColor = (score) => {
    if (score < 50) {
      return "bg-red-400";
    }

    if (score < 75) {
      return "bg-orange-400";
    }

    if (score < 90) {
      return "bg-blue-400";
    }

    return "bg-green-400";
  };

  // ============================================
  // ML RISK STYLE
  // ============================================

  const getRiskStyle = (risk) => {
    if (risk === "High Risk") {
      return {
        text: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
      };
    }

    if (risk === "Medium Risk") {
      return {
        text: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
      };
    }

    return {
      text: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    };
  };

  // ============================================
  // HUMAN-FRIENDLY STATUS
  // ============================================

  const getFriendlyStatus = (topic) => {
    if (topic.masteryScore < 50) {
      return "Could use some attention";
    }

    if (topic.masteryScore < 75) {
      return "A little more practice";
    }

    if (topic.masteryScore < 90) {
      return "You're getting there";
    }

    return "Looking strong";
  };

  // ============================================
  // HUMAN-FRIENDLY MESSAGE
  // ============================================

  const getFriendlyMessage = (topic) => {
    if (topic.practiceAverage === null) {
      if (topic.masteryScore < 50) {
        return `This looks like the area where you could benefit most from a little extra time.`;
      }

      if (topic.masteryScore < 75) {
        return `You have the basics, but a few more questions should help make this feel easier.`;
      }

      return `You already have a good foundation here. A little practice will help keep it fresh.`;
    }

    if (topic.trend === "Improving") {
      return `You're making progress here. Keep practicing and build on what you already know.`;
    }

    if (topic.trend === "Declining") {
      return `Your recent practice was a little lower. Let's revisit the basics and try again.`;
    }

    if (topic.masteryScore < 75) {
      return `You're on the way, but this topic could still use some focused practice.`;
    }

    return `You're doing well here. Keep this topic fresh with occasional practice.`;
  };

  // ============================================
  // TODAY'S MESSAGE
  // ============================================

  const getTodayMessage = () => {
    if (weakestTopic.masteryScore < 50) {
      return `Let's spend a little time rebuilding your foundation in ${weakestTopic.topic}.`;
    }

    if (weakestTopic.masteryScore < 75) {
      return `A focused practice session on ${weakestTopic.topic} would be a good next step.`;
    }

    if (weakestTopic.masteryScore < 90) {
      return `You're close. A little more practice with ${weakestTopic.topic} should help.`;
    }

    return "You're in a good place. Keep your strongest topics fresh and explore something new.";
  };

  // ============================================
  // UI
  // ============================================

  return (
    <div className="max-w-5xl mx-auto">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="mb-10">

        <p className="text-blue-400 text-sm font-medium mb-2">
          YOUR STUDY PLAN
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Here's what I'd focus on next.
        </h1>

        <p className="text-slate-400 mt-3 max-w-2xl leading-relaxed">
          You don't need to work on everything at once.
          Start with the areas that need a little more
          attention and build from there.
        </p>

      </div>

      {/* ========================================
          ML RISK PREDICTION
      ======================================== */}

      <div className="mb-8">

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-7">

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                LEARNING RISK
              </p>

              <h2 className="text-xl font-semibold text-white mt-2">
                What needs your attention?
              </h2>

              <p className="text-slate-500 text-sm mt-2">
                Our ML model looks at your assessment and
                practice activity.
              </p>

            </div>

            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 flex items-center justify-center text-xl">
              🧠
            </div>

          </div>

          {mlLoading && (
            <div className="mt-6 bg-slate-800/60 rounded-2xl p-5">

              <p className="text-slate-400 text-sm">
                Looking at your learning pattern...
              </p>

            </div>
          )}

          {mlError && (
            <div className="mt-6 bg-orange-500/5 border border-orange-500/15 rounded-2xl p-5">

              <p className="text-orange-400 text-sm">
                {mlError}
              </p>

              <p className="text-slate-500 text-xs mt-2">
                Your regular recovery plan is still available.
              </p>

            </div>
          )}

          {mlPrediction && !mlLoading && (
            <div
              className={`mt-6 rounded-2xl border p-5 ${
                getRiskStyle(mlPrediction.risk).bg
              } ${
                getRiskStyle(mlPrediction.risk).border
              }`}
            >

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                <div>

                  <p className="text-slate-500 text-xs uppercase tracking-wider">
                    CURRENT RISK
                  </p>

                  <p
                    className={`text-2xl font-bold mt-1 ${
                      getRiskStyle(
                        mlPrediction.risk
                      ).text
                    }`}
                  >
                    {mlPrediction.risk}
                  </p>

                </div>

                <div className="sm:text-right">

                  <p className="text-slate-500 text-xs">
                    Model confidence
                  </p>

                  <p className="text-white text-xl font-semibold mt-1">
                    {mlPrediction.confidence}%
                  </p>

                </div>

              </div>

              <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                This prediction is generated from your current
                learning activity. As you practice more, the
                information available to the model can change.
              </p>

            </div>
          )}

        </div>

      </div>

      {/* ========================================
          TODAY'S FOCUS
      ======================================== */}

      <div className="bg-blue-500/5 border border-blue-500/15 rounded-3xl p-6 md:p-7 mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div className="flex gap-4">

            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 flex items-center justify-center text-xl shrink-0">
              🎯
            </div>

            <div>

              <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">
                TODAY'S FOCUS
              </p>

              <h2 className="text-xl font-semibold text-white mt-2">
                {weakestTopic.topic}
              </h2>

              <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
                {getTodayMessage()}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              handlePractice(weakestTopic.topic)
            }
            className="shrink-0 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition"
          >
            Practice {weakestTopic.topic} →
          </button>

        </div>

      </div>

      {/* ========================================
          SIMPLE SUMMARY
      ======================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <p className="text-slate-500 text-xs uppercase tracking-wider">
            Needs a little work
          </p>

          <p className="text-3xl font-bold text-white mt-3">
            {attentionTopics}
          </p>

          <p className="text-slate-500 text-sm mt-1">
            {attentionTopics === 1
              ? "topic"
              : "topics"}{" "}
            below 75%
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <p className="text-slate-500 text-xs uppercase tracking-wider">
            You're improving
          </p>

          <p className="text-3xl font-bold text-white mt-3">
            {improvingTopics}
          </p>

          <p className="text-slate-500 text-sm mt-1">
            {improvingTopics === 1
              ? "topic is"
              : "topics are"}{" "}
            moving forward
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <p className="text-slate-500 text-xs uppercase tracking-wider">
            Feeling confident
          </p>

          <p className="text-3xl font-bold text-white mt-3">
            {recoveredTopics}
          </p>

          <p className="text-slate-500 text-sm mt-1">
            {recoveredTopics === 1
              ? "topic"
              : "topics"}{" "}
            at 90%+
          </p>

        </div>

      </div>

      {/* ========================================
          TOPIC LIST
      ======================================== */}

      <div>

        <div className="mb-5">

          <p className="text-slate-500 text-xs uppercase tracking-wider">
            YOUR TOPICS
          </p>

          <h2 className="text-xl font-semibold text-white mt-1">
            How you're doing
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Start at the top and work your way down.
          </p>

        </div>

        <div className="space-y-4">

          {learningGaps.map((topic, index) => (

            <div
              key={topic.topic}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >

              <div className="flex flex-col md:flex-row md:items-start gap-5">

                {/* NUMBER */}

                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">

                  <span className="text-slate-300 text-sm font-medium">
                    {index + 1}
                  </span>

                </div>

                {/* CONTENT */}

                <div className="flex-1">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <h3 className="text-lg font-semibold text-white">
                        {topic.topic}
                      </h3>

                      <p
                        className={`text-sm mt-1 ${getScoreColor(
                          topic.masteryScore
                        )}`}
                      >
                        {getFriendlyStatus(topic)}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-2xl font-bold text-white">
                        {topic.masteryScore}%
                      </p>

                      <p className="text-slate-500 text-xs">
                        current score
                      </p>

                    </div>

                  </div>

                  {/* MASTERY BAR */}

                  <div className="mt-5">

                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className={`h-full rounded-full transition-all ${getBarColor(
                          topic.masteryScore
                        )}`}
                        style={{
                          width: `${topic.masteryScore}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* MESSAGE */}

                  <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                    {getFriendlyMessage(topic)}
                  </p>

                  {/* SCORE DETAILS */}

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5">

                    <div>

                      <p className="text-slate-500 text-xs">
                        Assessment
                      </p>

                      <p className="text-slate-300 text-sm font-medium mt-1">
                        {topic.assessmentScore}%
                      </p>

                    </div>

                    {topic.practiceAverage !== null && (
                      <div>

                        <p className="text-slate-500 text-xs">
                          Practice average
                        </p>

                        <p className="text-slate-300 text-sm font-medium mt-1">
                          {topic.practiceAverage}%
                        </p>

                      </div>
                    )}

                    {topic.practiceAverage !== null && (
                      <div>

                        <p className="text-slate-500 text-xs">
                          Change
                        </p>

                        <p
                          className={`text-sm font-medium mt-1 ${
                            topic.improvement > 0
                              ? "text-green-400"
                              : topic.improvement < 0
                              ? "text-red-400"
                              : "text-slate-400"
                          }`}
                        >
                          {topic.improvement > 0
                            ? `+${topic.improvement}%`
                            : `${topic.improvement}%`}
                        </p>

                      </div>
                    )}

                    <div>

                      <p className="text-slate-500 text-xs">
                        Practice sessions
                      </p>

                      <p className="text-slate-300 text-sm font-medium mt-1">
                        {topic.practiceCount}
                      </p>

                    </div>

                  </div>

                </div>

                {/* ACTION */}

                <div className="md:w-36 shrink-0 md:text-right">

                  <p className="text-slate-500 text-xs">
                    Suggested time
                  </p>

                  <p className="text-white font-semibold mt-1">
                    {topic.recommendedMinutes} min
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handlePractice(topic.topic)
                    }
                    className="w-full mt-4 px-4 py-2.5 bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 text-white text-sm font-medium rounded-xl transition"
                  >
                    Practice →
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ========================================
          FRIENDLY EXPLANATION
      ======================================== */}

      <div className="mt-8 bg-slate-900/70 border border-slate-800 rounded-3xl p-6">

        <div className="flex gap-4">

          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg shrink-0">
            💡
          </div>

          <div>

            <p className="text-white font-medium">
              Why are you seeing this plan?
            </p>

            <p className="text-slate-400 text-sm mt-2 leading-relaxed max-w-3xl">
              Your plan looks at how you performed in the
              assessment and how you've been doing during
              practice. The ML model also estimates your
              current learning risk. As you improve, your
              recommendations can change too. You don't have
              to finish everything today.
            </p>

          </div>

        </div>

      </div>

      {/* ========================================
          SELECTED TOPIC
      ======================================== */}

      {selectedTopic && (

        <div className="mt-6 bg-blue-500/5 border border-blue-500/15 rounded-2xl p-5">

          <p className="text-blue-400 text-sm font-medium">
            Starting with
          </p>

          <p className="text-white font-semibold mt-1">
            {selectedTopic}
          </p>

        </div>

      )}

    </div>
  );
}

export default RecoveryPlan;