function WeakTopics({ results = [] }) {
  // Empty state when no assessment has been taken yet
  if (!results || results.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Learning Gaps</p>
            <h2 className="text-xl font-semibold text-white mt-1">
              Weak Topics
            </h2>
          </div>
          <span className="text-sm text-slate-500">0 topics</span>
        </div>
        <p className="text-slate-500 text-sm mt-6">
          Complete an assessment to identify areas needing improvement.
        </p>
      </div>
    );
  }

  // Aggregate results by topic
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

  const allTopics = Object.entries(topicPerformance)
    .map(([name, data]) => {
      const score =
        data.total > 0
          ? Math.round((data.correct / data.total) * 100)
          : 0;

      let priority = "Needs Improvement";
      if (score < 50) {
        priority = "Critical";
      } else if (score >= 75) {
        priority = "Strong";
      }

      return {
        name,
        score,
        priority,
      };
    })
    .sort((a, b) => a.score - b.score);

  // Filter for topics that actually need improvement (< 75%)
  const weakTopics = allTopics.filter((t) => t.score < 75);

  // If no topics are weak, show encouraging state
  if (weakTopics.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Learning Gaps</p>
            <h2 className="text-xl font-semibold text-white mt-1">
              Weak Topics
            </h2>
          </div>
          <span className="text-sm text-green-400">All clear!</span>
        </div>
        <p className="text-slate-400 text-sm mt-4">
          Great job! All assessed topics are at 75% or higher. Keep up the practice to maintain mastery.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">Learning Gaps</p>
          <h2 className="text-xl font-semibold text-white mt-1">
            Weak Topics
          </h2>
        </div>

        <span className="text-sm text-red-400">
          {weakTopics.length} {weakTopics.length === 1 ? "topic" : "topics"}
        </span>
      </div>

      <div className="space-y-4 mt-6">
        {weakTopics.map((topic) => {
          const isCritical = topic.score < 50;

          return (
            <div key={topic.name}>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-white">{topic.name}</span>
                <span
                  className={`text-sm ${
                    isCritical ? "text-red-400" : "text-orange-400"
                  }`}
                >
                  {topic.score}%
                </span>
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isCritical ? "bg-red-400" : "bg-orange-400"
                  }`}
                  style={{ width: `${topic.score}%` }}
                />
              </div>

              <p
                className={`text-xs mt-2 ${
                  isCritical ? "text-red-400" : "text-orange-400"
                }`}
              >
                {topic.priority}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeakTopics;