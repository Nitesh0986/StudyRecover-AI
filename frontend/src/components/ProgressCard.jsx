function ProgressCard() {
  const progress = 72;
  const weeklyImprovement = 8;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <p className="text-slate-400 text-sm">
        Overall Progress
      </p>

      <div className="flex items-end gap-2 mt-3">
        <h2 className="text-4xl font-bold text-white">
          {progress}%
        </h2>

        <span className="text-green-400 text-sm mb-1">
          +{weeklyImprovement}%
        </span>
      </div>

      <div className="w-full h-2 bg-slate-800 rounded-full mt-5">
        <div
          className="h-2 bg-green-400 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-slate-400 text-sm mt-3">
        Progress this week
      </p>
    </div>
  );
}

export default ProgressCard;