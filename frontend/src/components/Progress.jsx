import { useState } from "react";

function Progress({ assessmentResults = [] }) {
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
  // EMPTY STATE
  // ============================================

  if (assessmentResults.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">

        <div className="mb-10">

          <p className="text-blue-400 text-sm font-medium mb-2">
            YOUR PROGRESS
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Your journey starts here.
          </h1>

          <p className="text-slate-400 mt-3 max-w-2xl leading-relaxed">
            Once you complete an assessment and start
            practicing, you'll be able to see how your
            understanding changes over time.
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 text-center">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl">
            🌱
          </div>

          <h2 className="text-xl font-semibold text-white mt-6">
            Nothing to compare yet
          </h2>

          <p className="text-slate-400 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
            Take your first assessment, practice a few
            questions, and come back here to see your
            progress.
          </p>

        </div>

      </div>
    );
  }

  // ============================================
  // ASSESSMENT SCORE
  // ============================================

  const assessmentCorrect =
    assessmentResults.filter(
      (result) => result.isCorrect
    ).length;

  const assessmentTotal =
    assessmentResults.length;

  const assessmentScore = Math.round(
    (assessmentCorrect / assessmentTotal) * 100
  );

  // ============================================
  // TOPIC DATA
  // ============================================

  const topicData = {};

  assessmentResults.forEach((result) => {
    if (!topicData[result.topic]) {
      topicData[result.topic] = {
        correct: 0,
        total: 0,
      };
    }

    topicData[result.topic].total += 1;

    if (result.isCorrect) {
      topicData[result.topic].correct += 1;
    }
  });

  // ============================================
  // TOPIC PROGRESS
  // ============================================

  const topics = Object.entries(topicData)
    .map(([name, data]) => {

      const topicAssessmentScore = Math.round(
        (data.correct / data.total) * 100
      );

      const topicPracticeResults =
        practiceResults.filter(
          (practice) =>
            practice.topic === name
        );

      const practiceAverage =
        topicPracticeResults.length > 0
          ? Math.round(
              topicPracticeResults.reduce(
                (sum, practice) =>
                  sum + practice.percentage,
                0
              ) /
                topicPracticeResults.length
            )
          : null;

      const latestPractice =
        topicPracticeResults.length > 0
          ? topicPracticeResults[
              topicPracticeResults.length - 1
            ]
          : null;

      const latestPracticeScore =
        latestPractice
          ? latestPractice.percentage
          : null;

      const improvement =
        practiceAverage !== null
          ? practiceAverage -
            topicAssessmentScore
          : null;

      return {
        name,
        assessmentScore:
          topicAssessmentScore,
        practiceAverage,
        latestPracticeScore,
        improvement,
        practiceCount:
          topicPracticeResults.length,
      };
    });

  // ============================================
  // OVERALL PRACTICE DATA
  // ============================================

  const completedPractice =
    practiceResults.length;

  const overallPracticeAverage =
    completedPractice > 0
      ? Math.round(
          practiceResults.reduce(
            (sum, result) =>
              sum + result.percentage,
            0
          ) / completedPractice
        )
      : null;

  const overallImprovement =
    overallPracticeAverage !== null
      ? overallPracticeAverage -
        assessmentScore
      : null;

  // ============================================
  // HUMAN MESSAGES
  // ============================================

  const getProgressMessage = () => {
    if (overallPracticeAverage === null) {
      return "You've taken the first step. Now try a few practice questions and see what changes.";
    }

    if (overallImprovement > 15) {
      return "That's a big step forward. Your practice is making a real difference.";
    }

    if (overallImprovement > 0) {
      return "You're moving in the right direction. Keep going — small improvements add up.";
    }

    if (overallImprovement === 0) {
      return "You're holding steady. A little more focused practice could help unlock the next step.";
    }

    return "Your recent practice has been a little tougher. That's okay — use the explanations and try again.";
  };

  const getTopicMessage = (topic) => {
    if (topic.practiceAverage === null) {
      return "Not practiced yet";
    }

    if (topic.improvement >= 20) {
      return "Great improvement";
    }

    if (topic.improvement > 0) {
      return "Getting stronger";
    }

    if (topic.improvement === 0) {
      return "Holding steady";
    }

    return "Worth another look";
  };

  const getTopicMessageColor = (topic) => {
    if (topic.practiceAverage === null) {
      return "text-slate-500";
    }

    if (topic.improvement > 0) {
      return "text-green-400";
    }

    if (topic.improvement === 0) {
      return "text-blue-400";
    }

    return "text-orange-400";
  };

  // ============================================
  // SCORE COLOR
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
  // STRONGEST / WEAKEST
  // ============================================

  const strongestTopic = [...topics].sort(
    (a, b) =>
      (b.practiceAverage ?? b.assessmentScore) -
      (a.practiceAverage ?? a.assessmentScore)
  )[0];

  const weakestTopic = [...topics].sort(
    (a, b) =>
      (a.practiceAverage ?? a.assessmentScore) -
      (b.practiceAverage ?? b.assessmentScore)
  )[0];

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
          YOUR PROGRESS
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-white">
          You're making progress.
        </h1>

        <p className="text-slate-400 mt-3 max-w-2xl leading-relaxed">
          {getProgressMessage()}
        </p>

      </div>

      {/* ========================================
          MAIN SNAPSHOT
      ======================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-7">

          <div>

            <p className="text-slate-500 text-xs uppercase tracking-wider">
              WHERE YOU STARTED
            </p>

            <div className="flex items-end gap-3 mt-3">

              <p className="text-5xl font-bold text-white">
                {assessmentScore}%
              </p>

              <p className="text-slate-500 text-sm mb-2">
                assessment
              </p>

            </div>

          </div>

          {overallPracticeAverage !== null && (

            <div className="hidden md:block text-slate-600 text-3xl">
              →
            </div>

          )}

          {overallPracticeAverage !== null && (

            <div>

              <p className="text-slate-500 text-xs uppercase tracking-wider">
                WHERE YOU ARE NOW
              </p>

              <div className="flex items-end gap-3 mt-3">

                <p
                  className={`text-5xl font-bold ${getScoreColor(
                    overallPracticeAverage
                  )}`}
                >
                  {overallPracticeAverage}%
                </p>

                <p className="text-slate-500 text-sm mb-2">
                  practice average
                </p>

              </div>

            </div>

          )}

        </div>

        {overallImprovement !== null && (

          <div className="mt-7 pt-6 border-t border-slate-800">

            <p
              className={`text-sm font-medium ${
                overallImprovement > 0
                  ? "text-green-400"
                  : overallImprovement < 0
                  ? "text-orange-400"
                  : "text-slate-400"
              }`}
            >

              {overallImprovement > 0
                ? `↑ ${overallImprovement}% since your assessment`
                : overallImprovement < 0
                ? `↓ ${Math.abs(
                    overallImprovement
                  )}% compared with your assessment`
                : "Your average is currently unchanged"}

            </p>

          </div>

        )}

      </div>

      {/* ========================================
          QUICK STATS
      ======================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <p className="text-slate-500 text-xs uppercase tracking-wider">
            Practice sessions
          </p>

          <p className="text-3xl font-bold text-white mt-3">
            {completedPractice}
          </p>

          <p className="text-slate-500 text-sm mt-1">
            {completedPractice === 1
              ? "session completed"
              : "sessions completed"}
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <p className="text-slate-500 text-xs uppercase tracking-wider">
            Strongest right now
          </p>

          <p className="text-lg font-semibold text-white mt-3">
            {strongestTopic?.name || "—"}
          </p>

          <p className="text-slate-500 text-sm mt-1">
            {strongestTopic
              ? `${
                  strongestTopic.practiceAverage ??
                  strongestTopic.assessmentScore
                }%`
              : "No data yet"}
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <p className="text-slate-500 text-xs uppercase tracking-wider">
            Worth another look
          </p>

          <p className="text-lg font-semibold text-white mt-3">
            {weakestTopic?.name || "—"}
          </p>

          <p className="text-slate-500 text-sm mt-1">
            {weakestTopic
              ? `${
                  weakestTopic.practiceAverage ??
                  weakestTopic.assessmentScore
                }%`
              : "No data yet"}
          </p>

        </div>

      </div>

      {/* ========================================
          TOPIC PROGRESS
      ======================================== */}

      <div>

        <div className="mb-5">

          <p className="text-slate-500 text-xs uppercase tracking-wider">
            YOUR TOPICS
          </p>

          <h2 className="text-xl font-semibold text-white mt-1">
            See what's changing
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Your practice results are compared with where
            you started.
          </p>

        </div>

        <div className="space-y-4">

          {topics.map((topic) => {

            const currentScore =
              topic.practiceAverage ??
              topic.assessmentScore;

            return (
              <div
                key={topic.name}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
              >

                {/* HEADER */}

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <h3 className="text-lg font-semibold text-white">
                      {topic.name}
                    </h3>

                    <p
                      className={`text-sm mt-1 ${getTopicMessageColor(
                        topic
                      )}`}
                    >
                      {getTopicMessage(topic)}
                    </p>

                  </div>

                  <div className="text-right">

                    <p
                      className={`text-2xl font-bold ${getScoreColor(
                        currentScore
                      )}`}
                    >
                      {currentScore}%
                    </p>

                    <p className="text-slate-500 text-xs">
                      current
                    </p>

                  </div>

                </div>

                {/* STARTING SCORE */}

                <div className="mt-5">

                  <div className="flex justify-between text-xs mb-2">

                    <span className="text-slate-500">
                      Where you started
                    </span>

                    <span className="text-slate-400">
                      {topic.assessmentScore}%
                    </span>

                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-slate-600 rounded-full"
                      style={{
                        width: `${topic.assessmentScore}%`,
                      }}
                    />

                  </div>

                </div>

                {/* CURRENT SCORE */}

                {topic.practiceAverage !== null && (

                  <div className="mt-4">

                    <div className="flex justify-between text-xs mb-2">

                      <span className="text-slate-500">
                        Practice average
                      </span>

                      <span
                        className={getScoreColor(
                          topic.practiceAverage
                        )}
                      >
                        {topic.practiceAverage}%
                      </span>

                    </div>

                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className={`h-full rounded-full ${getBarColor(
                          topic.practiceAverage
                        )}`}
                        style={{
                          width: `${topic.practiceAverage}%`,
                        }}
                      />

                    </div>

                  </div>

                )}

                {/* DETAILS */}

                <div className="flex flex-wrap gap-x-7 gap-y-3 mt-5">

                  <div>

                    <p className="text-slate-500 text-xs">
                      Practice sessions
                    </p>

                    <p className="text-slate-300 text-sm font-medium mt-1">
                      {topic.practiceCount}
                    </p>

                  </div>

                  {topic.improvement !== null && (

                    <div>

                      <p className="text-slate-500 text-xs">
                        Change
                      </p>

                      <p
                        className={`text-sm font-medium mt-1 ${
                          topic.improvement > 0
                            ? "text-green-400"
                            : topic.improvement < 0
                            ? "text-orange-400"
                            : "text-slate-400"
                        }`}
                      >

                        {topic.improvement > 0
                          ? `+${topic.improvement}%`
                          : `${topic.improvement}%`}

                      </p>

                    </div>

                  )}

                  {topic.latestPracticeScore !== null && (

                    <div>

                      <p className="text-slate-500 text-xs">
                        Latest session
                      </p>

                      <p className="text-slate-300 text-sm font-medium mt-1">
                        {topic.latestPracticeScore}%
                      </p>

                    </div>

                  )}

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* ========================================
          ENCOURAGEMENT
      ======================================== */}

      <div className="mt-8 bg-slate-900/70 border border-slate-800 rounded-3xl p-6">

        <div className="flex gap-4">

          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg shrink-0">
            🌱
          </div>

          <div>

            <p className="text-white font-medium">
              Keep going — progress isn't always a straight line.
            </p>

            <p className="text-slate-400 text-sm mt-2 leading-relaxed max-w-3xl">
              Some sessions will feel easier than others.
              What matters is that you're noticing where
              you're struggling, practicing those areas,
              and coming back to check again.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Progress;