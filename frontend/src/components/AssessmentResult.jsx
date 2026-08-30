function AssessmentResult({ results, onBackToDashboard }) {
  // -----------------------------------------
  // 1. BASIC SCORE CALCULATION
  // -----------------------------------------

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


  // -----------------------------------------
  // 2. TOPIC-WISE PERFORMANCE
  // -----------------------------------------

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


  // -----------------------------------------
  // 3. CONVERT INTO ARRAY
  // -----------------------------------------

  const topics = Object.entries(topicPerformance).map(
    ([topic, data]) => {
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
    }
  );


  // -----------------------------------------
  // 4. FIND WEAKEST TOPIC
  // -----------------------------------------

  const weakestTopic =
    topics.length > 0
      ? [...topics].sort(
          (a, b) => a.percentage - b.percentage
        )[0]
      : null;


  // -----------------------------------------
  // 5. PERFORMANCE MESSAGE
  // -----------------------------------------

  const getOverallMessage = () => {
    if (overallPercentage < 50) {
      return "Your fundamentals need focused recovery.";
    }

    if (overallPercentage < 75) {
      return "You have a decent foundation, but some areas need improvement.";
    }

    return "Good performance! Keep strengthening your weak areas.";
  };


  return (
    <div className="max-w-4xl mx-auto">

      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <div className="mb-8">

        <p className="text-blue-400 text-sm font-medium mb-2">
          ASSESSMENT COMPLETE
        </p>

        <h1 className="text-3xl font-bold text-white">
          Your Learning Analysis
        </h1>

        <p className="text-slate-400 mt-2">
          StudyRecover AI analyzed your answers to
          identify where you need the most support.
        </p>

      </div>


      {/* -------------------------------- */}
      {/* OVERALL SCORE */}
      {/* -------------------------------- */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">

        <p className="text-slate-400 text-sm">
          Overall Performance
        </p>

        <h2 className="text-6xl font-bold text-white mt-3">
          {overallPercentage}%
        </h2>

        <p className="text-slate-400 mt-3">
          {correctAnswers} out of {totalQuestions}{" "}
          answers correct
        </p>

        <p
          className={`mt-4 text-sm font-medium ${
            overallPercentage < 50
              ? "text-red-400"
              : overallPercentage < 75
              ? "text-orange-400"
              : "text-green-400"
          }`}
        >
          {getOverallMessage()}
        </p>

      </div>


      {/* -------------------------------- */}
      {/* TOPIC PERFORMANCE */}
      {/* -------------------------------- */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

        <h2 className="text-xl font-semibold text-white">
          Topic Performance
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          Here's how you performed in each learning area.
        </p>


        <div className="space-y-6 mt-6">

          {topics.map((topic) => (

            <div key={topic.topic}>

              <div className="flex justify-between mb-2">

                <span className="text-white font-medium">
                  {topic.topic}
                </span>

                <span className="text-slate-400 text-sm">
                  {topic.correct}/{topic.total} •{" "}
                  {topic.percentage}%
                </span>

              </div>


              {/* Progress Bar */}

              <div className="w-full h-2 bg-slate-800 rounded-full">

                <div
                  className={`h-2 rounded-full ${
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


              {/* Status */}

              <p
                className={`text-xs mt-2 ${
                  topic.percentage < 50
                    ? "text-red-400"
                    : topic.percentage < 75
                    ? "text-orange-400"
                    : "text-green-400"
                }`}
              >
                {topic.percentage < 50
                  ? "Needs immediate recovery"
                  : topic.percentage < 75
                  ? "Needs improvement"
                  : "Good understanding"}
              </p>

            </div>

          ))}

        </div>

      </div>


      {/* -------------------------------- */}
      {/* AI RECOMMENDATION */}
      {/* -------------------------------- */}

      {weakestTopic && (

        <div className="bg-blue-950/40 border border-blue-900 rounded-2xl p-6 mt-6">

          <p className="text-blue-400 text-sm font-medium">
            STUDYRECOVER RECOMMENDATION
          </p>

          <h2 className="text-xl font-semibold text-white mt-2">
            Focus on {weakestTopic.topic}
          </h2>

          <p className="text-slate-300 mt-2">
            Your current performance in this topic is{" "}
            {weakestTopic.percentage}%. We recommend
            prioritizing this topic in your recovery plan.
          </p>

        </div>

      )}


      {/* -------------------------------- */}
      {/* RECOVERY SUMMARY */}
      {/* -------------------------------- */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

        <h2 className="text-xl font-semibold text-white">
          Recovery Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

          <div className="bg-slate-800 rounded-xl p-4">

            <p className="text-slate-400 text-sm">
              Questions
            </p>

            <p className="text-white text-2xl font-bold mt-1">
              {totalQuestions}
            </p>

          </div>


          <div className="bg-slate-800 rounded-xl p-4">

            <p className="text-slate-400 text-sm">
              Correct
            </p>

            <p className="text-green-400 text-2xl font-bold mt-1">
              {correctAnswers}
            </p>

          </div>


          <div className="bg-slate-800 rounded-xl p-4">

            <p className="text-slate-400 text-sm">
              Needs Recovery
            </p>

            <p className="text-red-400 text-2xl font-bold mt-1">
              {
                topics.filter(
                  (topic) => topic.percentage < 50
                ).length
              }
            </p>

          </div>

        </div>

      </div>


      {/* -------------------------------- */}
      {/* ACTION BUTTON */}
      {/* -------------------------------- */}

      <div className="flex justify-end mt-6">

        <button
          onClick={onBackToDashboard}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition"
        >
          Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default AssessmentResult;