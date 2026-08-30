import RiskScore from "./RiskScore";
import WeakTopics from "./WeakTopics";
import ProgressCard from "./ProgressCard";

function Dashboard({ assessmentResults = [] }) {
  // ==================================================
  // 1. CHECK WHETHER AN ASSESSMENT HAS BEEN COMPLETED
  // ==================================================

  const hasAssessment = assessmentResults.length > 0;


  // ==================================================
  // 2. CALCULATE OVERALL PERFORMANCE
  // ==================================================

  const correctAnswers = assessmentResults.filter(
    (result) => result.isCorrect
  ).length;

  const totalQuestions = assessmentResults.length;

  const overallPercentage = hasAssessment
    ? Math.round(
        (correctAnswers / totalQuestions) * 100
      )
    : 0;


  // ==================================================
  // 3. CALCULATE LEARNING RISK
  //
  // Higher risk = weaker performance
  // ==================================================

  const learningRisk = hasAssessment
    ? 100 - overallPercentage
    : 0;


  // ==================================================
  // 4. CALCULATE TOPIC PERFORMANCE
  // ==================================================

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


  // ==================================================
  // 5. CONVERT TOPIC DATA TO ARRAY
  // ==================================================

  const topics = Object.entries(topicData)
    .map(([topic, data]) => {
      const percentage = Math.round(
        (data.correct / data.total) * 100
      );

      return {
        topic,
        correct: data.correct,
        total: data.total,
        percentage,
      };
    })
    .sort(
      (a, b) => a.percentage - b.percentage
    );


  // ==================================================
  // 6. FIND WEAKEST TOPIC
  // ==================================================

  const weakestTopic = topics[0] || null;


  // ==================================================
  // 7. SELECT TOP 3 FOCUS AREAS
  // ==================================================

  const focusTopics = topics.slice(0, 3);


  // ==================================================
  // 8. HUMAN-FRIENDLY RISK MESSAGE
  // ==================================================

  let riskMessage = "Take your first assessment";

  if (hasAssessment) {
    if (learningRisk >= 60) {
      riskMessage = "Let's strengthen the basics";
    } else if (learningRisk >= 30) {
      riskMessage = "A little more practice will help";
    } else {
      riskMessage = "You're building a strong foundation";
    }
  }


  return (
    <div className="max-w-7xl mx-auto">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-10">

        <p className="text-blue-400 text-sm font-semibold tracking-wide mb-2">
          YOUR LEARNING SPACE
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Welcome back 👋
        </h1>

        <p className="text-slate-400 mt-3">
          {hasAssessment
            ? "Here's what deserves your attention today."
            : "Let's start by understanding where you stand."}
        </p>

      </div>


      {/* ==================================================
          QUICK SUMMARY
      ================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        {/* Learning Health */}

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">

          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
            Learning health
          </p>

          <div className="flex items-center justify-between mt-4">

            <div>

              <p className="text-3xl font-bold text-white">

                {hasAssessment
                  ? `${overallPercentage}%`
                  : "--"}

              </p>

              <p
                className={`text-sm mt-2 ${
                  hasAssessment
                    ? learningRisk >= 60
                      ? "text-red-400"
                      : learningRisk >= 30
                      ? "text-orange-400"
                      : "text-green-400"
                    : "text-slate-500"
                }`}
              >
                {riskMessage}
              </p>

            </div>

            {hasAssessment && (
              <div className="w-12 h-12 rounded-full border-4 border-blue-400/30 flex items-center justify-center">

                <span className="text-blue-400 text-xs font-semibold">
                  {overallPercentage}%
                </span>

              </div>
            )}

          </div>

        </div>


        {/* Today's Focus */}

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">

          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
            Today's focus
          </p>

          {weakestTopic ? (
            <>
              <h2 className="text-xl font-semibold text-white mt-4">
                {weakestTopic.topic}
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                This is currently your weakest area.
              </p>

              <div className="mt-4 w-full h-2 bg-slate-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-red-400 rounded-full"
                  style={{
                    width: `${weakestTopic.percentage}%`,
                  }}
                />

              </div>

              <p className="text-red-400 text-xs mt-2">
                {weakestTopic.percentage}% confidence
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mt-4">
                No focus area yet
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                Complete an assessment and we'll find your
                priority topic.
              </p>
            </>
          )}

        </div>


        {/* Assessment Progress */}

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">

          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
            Assessment progress
          </p>

          <div className="flex items-end gap-2 mt-4">

            <h2 className="text-3xl font-bold text-white">
              {hasAssessment
                ? `${correctAnswers}/${totalQuestions}`
                : "--"}
            </h2>

            {hasAssessment && (
              <span className="text-green-400 text-sm mb-1">
                correct
              </span>
            )}

          </div>

          <p className="text-slate-400 text-sm mt-2">
            {hasAssessment
              ? "Based on your latest assessment."
              : "Complete an assessment to see your progress."}
          </p>

        </div>

      </div>


      {/* ==================================================
          LEARNING PICTURE
      ================================================== */}

      <div className="mb-8">

        <div className="mb-5">

          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
            Your learning picture
          </p>

          <h2 className="text-xl font-semibold text-white mt-1">
            Where you stand right now
          </h2>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Existing components remain here */}
          <RiskScore />

          <WeakTopics />

          <ProgressCard />

        </div>

      </div>


      {/* ==================================================
          FOCUS AREAS
      ================================================== */}

      {hasAssessment && focusTopics.length > 0 && (

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-8">

          <div className="mb-6">

            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wide">
              WHAT NEEDS ATTENTION
            </p>

            <h2 className="text-2xl font-semibold text-white mt-1">
              Your focus areas
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Start with the areas where your confidence is lowest.
            </p>

          </div>


          <div className="space-y-4">

            {focusTopics.map((topic, index) => (

              <div
                key={topic.topic}
                className="flex items-center gap-4 bg-slate-800/70 rounded-xl p-4"
              >

                {/* Number */}

                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center shrink-0">

                  <span className="text-slate-300 text-sm font-semibold">
                    {index + 1}
                  </span>

                </div>


                {/* Topic */}

                <div className="flex-1">

                  <div className="flex items-center justify-between mb-2">

                    <h3 className="text-white font-medium">
                      {topic.topic}
                    </h3>

                    <span
                      className={`text-sm ${
                        topic.percentage < 50
                          ? "text-red-400"
                          : topic.percentage < 75
                          ? "text-orange-400"
                          : "text-green-400"
                      }`}
                    >
                      {topic.percentage}%
                    </span>

                  </div>


                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">

                    <div
                      className={`h-full rounded-full ${
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

                </div>

              </div>

            ))}

          </div>

        </div>

      )}


      {/* ==================================================
          TODAY'S PLAN
      ================================================== */}

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-7">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7">

          <div>

            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wide">
              YOUR NEXT STEPS
            </p>

            <h2 className="text-2xl font-semibold text-white mt-1">
              Today's study plan
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              {hasAssessment
                ? "A focused session based on your latest assessment."
                : "Complete your first assessment to build a personalized plan."}
            </p>

          </div>

          <div className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm w-fit">
            {hasAssessment
              ? `${focusTopics.length} focus areas`
              : "Not started"}
          </div>

        </div>


        {hasAssessment ? (

          <div className="space-y-3">

            {focusTopics.map((topic, index) => (

              <div
                key={topic.topic}
                className="flex items-center justify-between gap-4 bg-slate-800/70 hover:bg-slate-800 border border-transparent hover:border-slate-700 rounded-xl p-4 transition"
              >

                <div className="flex items-center gap-4">

                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      topic.percentage < 50
                        ? "border-red-400/60"
                        : topic.percentage < 75
                        ? "border-orange-400/60"
                        : "border-blue-400/60"
                    }`}
                  >

                    <span
                      className={`w-2 h-2 rounded-full ${
                        topic.percentage < 50
                          ? "bg-red-400"
                          : topic.percentage < 75
                          ? "bg-orange-400"
                          : "bg-blue-400"
                      }`}
                    />

                  </div>

                  <div>

                    <h3 className="text-white font-medium">
                      {index === 0
                        ? `Review ${topic.topic}`
                        : `Practice ${topic.topic}`}
                    </h3>

                    <p className="text-slate-400 text-sm mt-1">
                      {topic.percentage < 50
                        ? "Start with the fundamentals"
                        : topic.percentage < 75
                        ? "Strengthen your understanding"
                        : "Keep your skills sharp"}
                    </p>

                  </div>

                </div>


                <span
                  className={`hidden sm:block text-xs font-medium ${
                    topic.percentage < 50
                      ? "text-red-400"
                      : topic.percentage < 75
                      ? "text-orange-400"
                      : "text-blue-400"
                  }`}
                >
                  {topic.percentage < 50
                    ? "HIGH PRIORITY"
                    : topic.percentage < 75
                    ? "FOCUS"
                    : "PRACTICE"}
                </span>

              </div>

            ))}

          </div>

        ) : (

          <div className="bg-slate-800/50 rounded-xl p-6 text-center">

            <div className="text-3xl mb-3">
              🎯
            </div>

            <h3 className="text-white font-medium">
              Your plan starts with an assessment
            </h3>

            <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
              Answer a few questions and StudyRecover will
              identify your weak areas and suggest what to
              study next.
            </p>

          </div>

        )}


        {/* Tip */}

        <div className="mt-6 pt-5 border-t border-slate-800">

          <p className="text-slate-500 text-sm">
            💡 Tip: Focus on one weak topic at a time. Consistent
            practice beats trying to learn everything at once.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;