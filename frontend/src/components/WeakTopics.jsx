const topics = [
  {
    name: "Normalization",
    score: 32,
    priority: "Critical",
  },
  {
    name: "Transactions",
    score: 41,
    priority: "Critical",
  },
  {
    name: "Relational Algebra",
    score: 48,
    priority: "Needs Improvement",
  },
];

function WeakTopics() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">
            Learning Gaps
          </p>

          <h2 className="text-xl font-semibold text-white mt-1">
            Weak Topics
          </h2>
        </div>

        <span className="text-sm text-red-400">
          3 topics
        </span>
      </div>

      <div className="space-y-4 mt-6">
        {topics.map((topic) => (
          <div key={topic.name}>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-white">
                {topic.name}
              </span>

              <span className="text-sm text-slate-400">
                {topic.score}%
              </span>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full">
              <div
                className="h-2 bg-red-400 rounded-full"
                style={{ width: `${topic.score}%` }}
              />
            </div>

            <p className="text-xs text-red-400 mt-2">
              {topic.priority}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeakTopics;