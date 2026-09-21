function AssessmentResult({
  results = [],
  onBackToDashboard,
}) {
  // ============================================
  // SCORE CALCULATION
  // ============================================

  const totalQuestions = results.length;

  const correctAnswers = results.filter(
    (result) => result.isCorrect
  ).length;

  const overallPercentage =
    totalQuestions > 0
      ? Math.round(
          (correctAnswers / totalQuestions) * 100
        )
      : 0;

  // ============================================
  // TOPIC PERFORMANCE
  // ============================================

  const topicPerformance = {};

  results.forEach((result) => {
    if (!topicPerformance[result.topic]) {
      topicPerformance[result.topic] = {
        correct: 0,
        total: 0,
      };
    }

    topicPerformance[result.topic].total += 1;

    if (result.isCorrect) {
      topicPerformance[result.topic].correct += 1;
    }
  });

  const topics = Object.entries(topicPerformance)
    .map(([topic, data]) => {
      const percentage =
        data.total > 0
          ? Math.round(
              (data.correct / data.total) * 100
            )
          : 0;

      return {
        topic,
        correct: data.correct,
        total: data.total,
        percentage,
      };
    })
    .sort((a, b) => a.percentage - b.percentage);

  const weakestTopic =
    topics.length > 0 ? topics[0] : null;

  const strongestTopic =
    topics.length > 0
      ? [...topics].sort(
          (a, b) => b.percentage - a.percentage
        )[0]
      : null;

  // ============================================
  // FRIENDLY MESSAGES
  // ============================================

  const getOverallMessage = () => {
    if (overallPercentage < 50) {
      return {
        title: "This is a good starting point.",
        description:
          "You've found a few areas that deserve some focused attention. That's exactly what this check-in was for.",
      };
    }

    if (overallPercentage < 75) {
      return {
        title: "You're on your way.",
        description:
          "You already have some understanding. A little focused practice can make the weaker areas much stronger.",
      };
    }

    if (overallPercentage < 90) {
      return {
        title: "Nice work!",
        description:
          "You have a solid foundation. Let's use targeted practice to close the remaining gaps.",
      };
    }

    return {
      title: "Excellent work! 🎉",
      description:
        "You've built a strong foundation. Keep practicing so that understanding turns into confidence.",
    };
  };

  const overallMessage = getOverallMessage();

  // ============================================
  // TOPIC STATUS
  // ============================================

  const getTopicStatus = (percentage) => {
    if (percentage < 50) {
      return {
        label: "Needs attention",
        text: "text-red-400",
      };
    }

    if (percentage < 75) {
      return {
        label: "Worth more practice",
        text: "text-orange-400",
      };
    }

    return {
      label: "Looking good",
      text: "text-green-400",
    };
  };

  const recoveryTopics = topics.filter(
    (topic) => topic.percentage < 50
  );

  return (
    <div className="max-w-4xl mx-auto">

      {/* ========================================
          HEADER
      ======================================== */}

      <section className="mb-8">

        <p className="text-blue-400 text-sm font-medium mb-3">
          CHECK-IN COMPLETE
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Here's where you are right now.
        </h1>

        <p className="text-slate-400 mt-3 max-w-2xl leading-relaxed">
          Your answers give us a starting point. There is
          nothing to pass or fail here — the goal is to
          understand what to work on next.
        </p>

      </section>

      {/* ========================================
          OVERALL RESULT
      ======================================== */}

      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10">

        <div className="text-center max-w-2xl mx-auto">

          <p className="text-slate-500 text-sm">
            Overall performance
          </p>

          <div className="mt-4">
            <span className="text-6xl md:text-7xl font-bold text-white tracking-tight">
              {overallPercentage}%
            </span>
          </div>

          <p className="text-slate-400 mt-3">
            {correctAnswers} of {totalQuestions} answers
            correct
          </p>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-white">
              {overallMessage.title}
            </h2>

            <p className="text-slate-400 mt-2 leading-relaxed">
              {overallMessage.description}
            </p>
          </div>

        </div>

      </section>

      {/* ========================================
          QUICK TAKEAWAY
      ======================================== */}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

        {/* Strongest */}

        {strongestTopic && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
              YOU'RE STRONGEST IN
            </p>

            <h2 className="text-xl font-semibold text-white mt-3">
              {strongestTopic.topic}
            </h2>

            <p className="text-green-400 text-sm mt-2">
              {strongestTopic.percentage}% correct
            </p>

            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Keep this topic fresh while you spend more
              time on the areas that need attention.
            </p>

          </div>
        )}

        {/* Weakest */}

        {weakestTopic && (
          <div className="bg-blue-500/5 border border-blue-500/15 rounded-2xl p-6">

            <p className="text-blue-400 text-xs font-medium uppercase tracking-wider">
              A GOOD PLACE TO START
            </p>

            <h2 className="text-xl font-semibold text-white mt-3">
              {weakestTopic.topic}
            </h2>

            <p className="text-blue-400 text-sm mt-2">
              {weakestTopic.percentage}% correct
            </p>

            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              This is currently your weakest area, so it
              deserves a little more attention in your
              recovery plan.
            </p>

          </div>
        )}

      </section>

      {/* ========================================
          TOPIC PERFORMANCE
      ======================================== */}

      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-7 mt-6">

        <div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
            YOUR TOPICS
          </p>

          <h2 className="text-xl font-semibold text-white mt-2">
            How each topic went
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            This helps decide where your next study session
            should go.
          </p>
        </div>

        <div className="space-y-6 mt-7">

          {topics.map((topic) => {
            const status = getTopicStatus(
              topic.percentage
            );

            return (
              <div key={topic.topic}>

                <div className="flex items-center justify-between gap-4 mb-2">

                  <span className="text-white font-medium">
                    {topic.topic}
                  </span>

                  <span className="text-slate-400 text-sm whitespace-nowrap">
                    {topic.correct}/{topic.total} ·{" "}
                    {topic.percentage}%
                  </span>

                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">

                  <div
                    className={`h-full rounded-full transition-all ${
                      topic.percentage < 50
                        ? "bg-red-400"
                        : topic.percentage < 75
                        ? "bg-orange-400"
                        : "bg-green-400"
                    }`}
                    style={{
                      width: `${topic.percentage}%`,
                    }}
                  />

                </div>

                <p
                  className={`text-xs mt-2 ${status.text}`}
                >
                  {status.label}
                </p>

              </div>
            );
          })}

        </div>

      </section>

      {/* ========================================
          NEXT STEP
      ======================================== */}

      {weakestTopic && (
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-7 mt-6">

          <p className="text-blue-400 text-xs font-medium uppercase tracking-wider">
            WHAT TO DO NEXT
          </p>

          <h2 className="text-xl font-semibold text-white mt-2">
            Give {weakestTopic.topic} a little more time.
          </h2>

          <p className="text-slate-400 text-sm mt-3 max-w-2xl leading-relaxed">
            Your assessment suggests that this is the best
            place to start. The Recovery Plan will turn this
            result into a focused practice path.
          </p>

          <div className="mt-5 flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
              →
            </div>

            <p className="text-slate-300 text-sm">
              Review the topic, practice questions, then
              check your progress again.
            </p>

          </div>

        </section>
      )}

      {/* ========================================
          SIMPLE SUMMARY
      ======================================== */}

      <section className="mt-6">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <p className="text-slate-500 text-sm">
              Questions
            </p>

            <p className="text-white text-2xl font-bold mt-2">
              {totalQuestions}
            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <p className="text-slate-500 text-sm">
              Correct
            </p>

            <p className="text-white text-2xl font-bold mt-2">
              {correctAnswers}
            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <p className="text-slate-500 text-sm">
              Topics to revisit
            </p>

            <p className="text-white text-2xl font-bold mt-2">
              {recoveryTopics.length}
            </p>

          </div>

        </div>

      </section>

      {/* ========================================
          ACTION
      ======================================== */}

      <div className="mt-8 mb-4 flex flex-col items-center gap-3">

        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200"
        >
          Go to Dashboard
          <span className="ml-2">→</span>
        </button>

        <p className="text-xs text-slate-600">
          Your results have been saved.
        </p>

      </div>

    </div>
  );
}

export default AssessmentResult;