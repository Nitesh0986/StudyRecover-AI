import RiskScore from "./RiskScore";
import WeakTopics from "./WeakTopics";
import ProgressCard from "./ProgressCard";
import MLRiskCard from "./MLRiskCard";

function Dashboard({
  assessmentResults = [],
  onStartAssessment,
  onOpenRecovery,
}) {
  // ============================================
  // SCORE CALCULATIONS
  // ============================================

  const totalQuestions = assessmentResults.length;

  const correctAnswers = assessmentResults.filter(
    (result) => result.isCorrect
  ).length;

  const overallScore =
    totalQuestions > 0
      ? Math.round(
          (correctAnswers / totalQuestions) * 100
        )
      : 0;

  // ============================================
  // TOPIC PERFORMANCE
  // ============================================

  const topicPerformance = {};

  assessmentResults.forEach((result) => {
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
    .map(([name, data]) => ({
      name,
      score: Math.round(
        (data.correct / data.total) * 100
      ),
      correct: data.correct,
      total: data.total,
    }))
    .sort((a, b) => a.score - b.score);

  const weakestTopic = topics[0];

  // ============================================
  // FRIENDLY MESSAGES
  // ============================================

  const getGreetingMessage = () => {
    if (totalQuestions === 0) {
      return "Take a short assessment and we'll figure out where to start.";
    }

    if (overallScore >= 90) {
      return "You're doing really well. Keep the momentum going!";
    }

    if (overallScore >= 75) {
      return "Nice work! A little more practice can make these topics stronger.";
    }

    if (overallScore >= 50) {
      return "You're making progress. Let's strengthen a few areas.";
    }

    return "No worries — this is exactly what StudyRecover is here for.";
  };

  const getScoreMessage = () => {
    if (overallScore >= 90) {
      return "Excellent foundation";
    }

    if (overallScore >= 75) {
      return "Good foundation";
    }

    if (overallScore >= 50) {
      return "Some areas need practice";
    }

    return "Let's build the foundation";
  };

  // ============================================
  // EMPTY DASHBOARD
  // ============================================

  if (totalQuestions === 0) {
    return (
      <div className="max-w-6xl mx-auto">

        {/* Welcome */}

        <section className="mb-10">

          <p className="text-blue-400 text-sm font-medium mb-3">
            YOUR LEARNING SPACE
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Let's figure out where you are.
          </h1>

          <p className="text-slate-400 mt-4 max-w-2xl leading-relaxed">
            Everyone gets stuck sometimes. Take a quick
            assessment and we'll help you find the topics
            that deserve your attention.
          </p>

        </section>

        {/* Start Assessment */}

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 mb-8">

          <div className="max-w-2xl">

            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl mb-6">
              🧭
            </div>

            <h2 className="text-2xl font-semibold text-white">
              Start with a quick check-in
            </h2>

            <p className="text-slate-400 mt-3 leading-relaxed">
              We'll ask you a few questions about your
              current knowledge. There are no grades here —
              the goal is simply to understand where you
              need help.
            </p>

            <button
              type="button"
              onClick={onStartAssessment}
              className="mt-7 inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all duration-200"
            >
              Take Assessment
              <span className="ml-2">→</span>
            </button>

          </div>

        </section>

        {/* How It Works */}

        <section>

          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-4">
            HOW IT WORKS
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">

              <span className="text-2xl">
                📝
              </span>

              <h3 className="text-white font-medium mt-4">
                Check your understanding
              </h3>

              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Answer a few questions about the topics
                you're learning.
              </p>

            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">

              <span className="text-2xl">
                🔎
              </span>

              <h3 className="text-white font-medium mt-4">
                Find the gaps
              </h3>

              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                We'll identify the areas where you could
                use some extra practice.
              </p>

            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">

              <span className="text-2xl">
                🌱
              </span>

              <h3 className="text-white font-medium mt-4">
                Work at your pace
              </h3>

              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Practice, see your progress, and adjust
                your plan as you improve.
              </p>

            </div>

          </div>

        </section>

      </div>
    );
  }

  // ============================================
  // MAIN DASHBOARD
  // ============================================

  return (
    <div className="max-w-6xl mx-auto">

      {/* ========================================
          HEADER
      ======================================== */}

      <section className="mb-8">

        <p className="text-blue-400 text-sm font-medium mb-3">
          YOUR LEARNING SPACE
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Welcome back 👋
        </h1>

        <p className="text-slate-400 mt-3 max-w-2xl leading-relaxed">
          {getGreetingMessage()}
        </p>

      </section>

      {/* ========================================
          SCORE SNAPSHOT
      ======================================== */}

      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 mb-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>

            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
              YOUR SNAPSHOT
            </p>

            <div className="flex items-end gap-3 mt-3">

              <span className="text-5xl font-bold text-white tracking-tight">
                {overallScore}%
              </span>

              <span className="text-slate-400 text-sm mb-2">
                overall performance
              </span>

            </div>

            <p className="text-slate-300 mt-3">
              {getScoreMessage()}
            </p>

          </div>

          {/* Small stats */}

          <div className="grid grid-cols-3 gap-6 lg:gap-10">

            <div>
              <p className="text-2xl font-semibold text-white">
                {correctAnswers}
              </p>

              <p className="text-slate-500 text-sm mt-1">
                correct
              </p>
            </div>

            <div>
              <p className="text-2xl font-semibold text-white">
                {totalQuestions}
              </p>

              <p className="text-slate-500 text-sm mt-1">
                answered
              </p>
            </div>

            <div>
              <p className="text-2xl font-semibold text-white">
                {topics.length}
              </p>

              <p className="text-slate-500 text-sm mt-1">
                topics
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================
          RECOMMENDED STARTING POINT
      ======================================== */}

      {weakestTopic && (
        <section className="bg-blue-500/5 border border-blue-500/15 rounded-3xl p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">
                A GOOD PLACE TO START
              </p>

              <h2 className="text-xl font-semibold text-white mt-2">
                Spend some time on {weakestTopic.name}
              </h2>

              <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                This is currently your lowest-performing
                topic. A focused practice session could help
                strengthen it.
              </p>

            </div>

            <button
              type="button"
              onClick={onOpenRecovery}
              className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all duration-200"
            >
              View Recovery Plan
              <span className="ml-2">
                →
              </span>
            </button>

          </div>

        </section>
      )}

      {/* ========================================
          TOPICS
      ======================================== */}

      <section className="mb-8">

        <div className="mb-4">

          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
            YOUR TOPICS
          </p>

          <h2 className="text-xl font-semibold text-white mt-1">
            How things are going
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {topics.map((topic) => {

            const isWeak = topic.score < 50;

            const isOkay =
              topic.score >= 50 &&
              topic.score < 75;

            return (
              <div
                key={topic.name}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
              >

                <div className="flex items-center justify-between gap-3">

                  <h3 className="text-white font-medium">
                    {topic.name}
                  </h3>

                  <span
                    className={`text-sm font-semibold ${
                      isWeak
                        ? "text-red-400"
                        : isOkay
                        ? "text-orange-400"
                        : "text-green-400"
                    }`}
                  >
                    {topic.score}%
                  </span>

                </div>

                <div className="mt-4 w-full h-2 bg-slate-800 rounded-full overflow-hidden">

                  <div
                    className={`h-full rounded-full transition-all ${
                      isWeak
                        ? "bg-red-400"
                        : isOkay
                        ? "bg-orange-400"
                        : "bg-green-400"
                    }`}
                    style={{
                      width: `${topic.score}%`,
                    }}
                  />

                </div>

                <p className="text-slate-500 text-xs mt-3">
                  {isWeak
                    ? "Could use some practice"
                    : isOkay
                    ? "Getting there"
                    : "Looking good"}
                </p>

              </div>
            );
          })}

        </div>

      </section>

      {/* ========================================
          DETAILS
      ======================================== */}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div>
          <RiskScore
            results={assessmentResults}
          />
        </div>

        <div>
          <ProgressCard
            results={assessmentResults}
          />
        </div>

      </section>

      {/* ========================================
          ML RISK PREDICTION
      ======================================== */}

      <section className="mt-6">

        <MLRiskCard
          assessmentResults={assessmentResults}
        />

      </section>

      {/* ========================================
          WEAK TOPICS
      ======================================== */}

      <section className="mt-6">

        <WeakTopics
          results={assessmentResults}
        />

      </section>

      {/* ========================================
          TODAY'S PLAN
      ======================================== */}

      <section className="mt-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-7">

        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
          A SIMPLE PLAN FOR TODAY
        </p>

        <h2 className="text-xl font-semibold text-white mt-2">
          Small steps are enough.
        </h2>

        <p className="text-slate-500 text-sm mt-2">
          You don't need to fix everything in one sitting.
        </p>

        <div className="mt-6 space-y-3">

          {/* Step 1 */}

          <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl">

            <div className="w-9 h-9 shrink-0 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-300">
              1
            </div>

            <div>

              <p className="text-white text-sm font-medium">
                Review your weakest topic
              </p>

              <p className="text-slate-500 text-xs mt-1">
                Start with{" "}
                {weakestTopic?.name ||
                  "your weakest area"}.
              </p>

            </div>

          </div>

          {/* Step 2 */}

          <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl">

            <div className="w-9 h-9 shrink-0 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-300">
              2
            </div>

            <div>

              <p className="text-white text-sm font-medium">
                Practice a few questions
              </p>

              <p className="text-slate-500 text-xs mt-1">
                Use the explanations to learn from mistakes.
              </p>

            </div>

          </div>

          {/* Step 3 */}

          <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl">

            <div className="w-9 h-9 shrink-0 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-300">
              3
            </div>

            <div>

              <p className="text-white text-sm font-medium">
                Check your progress
              </p>

              <p className="text-slate-500 text-xs mt-1">
                Come back after practice and see what's changed.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================
          RETAKE
      ======================================== */}

      <div className="mt-8 mb-4 text-center">

        <button
          type="button"
          onClick={onStartAssessment}
          className="text-slate-500 hover:text-blue-400 text-sm transition-colors"
        >
          Retake assessment →
        </button>

      </div>

    </div>
  );
}

export default Dashboard;