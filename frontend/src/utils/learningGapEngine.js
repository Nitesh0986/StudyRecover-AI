export function calculateLearningGaps(
  assessmentResults = [],
  practiceResults = []
) {
  if (assessmentResults.length === 0) {
    return [];
  }

  const topicData = {};

  // ============================================
  // 1. PROCESS ASSESSMENT RESULTS
  // ============================================

  assessmentResults.forEach((result) => {
    if (!topicData[result.topic]) {
      topicData[result.topic] = {
        topic: result.topic,
        assessmentCorrect: 0,
        assessmentTotal: 0,
        practiceResults: [],
      };
    }

    topicData[result.topic].assessmentTotal += 1;

    if (result.isCorrect) {
      topicData[result.topic].assessmentCorrect += 1;
    }
  });

  // ============================================
  // 2. PROCESS PRACTICE HISTORY
  // ============================================

  practiceResults.forEach((result) => {
    if (!topicData[result.topic]) {
      topicData[result.topic] = {
        topic: result.topic,
        assessmentCorrect: 0,
        assessmentTotal: 0,
        practiceResults: [],
      };
    }

    topicData[result.topic].practiceResults.push(result);
  });

  // ============================================
  // 3. CALCULATE TOPIC MASTERY
  // ============================================

  const learningGaps = Object.values(topicData).map(
    (data) => {
      // ------------------------------------------
      // Assessment Score
      // ------------------------------------------

      const assessmentScore =
        data.assessmentTotal > 0
          ? Math.round(
              (data.assessmentCorrect /
                data.assessmentTotal) *
                100
            )
          : 0;

      // ------------------------------------------
      // Practice History
      // ------------------------------------------

      const practiceHistory =
        data.practiceResults || [];

      const practiceCount =
        practiceHistory.length;

      // ------------------------------------------
      // Practice Average
      // ------------------------------------------

      const practiceAverage =
        practiceCount > 0
          ? Math.round(
              practiceHistory.reduce(
                (total, practice) =>
                  total + practice.percentage,
                0
              ) / practiceCount
            )
          : null;

      // ------------------------------------------
      // Latest Practice
      // ------------------------------------------

      const latestPractice =
        practiceCount > 0
          ? practiceHistory[
              practiceCount - 1
            ]
          : null;

      const latestPracticeScore =
        latestPractice
          ? latestPractice.percentage
          : null;

      // ============================================
      // 4. ADAPTIVE MASTERY SCORE
      // ============================================

      let masteryScore;

      if (practiceAverage === null) {
        // No practice yet
        masteryScore = assessmentScore;
      } else {
        // Assessment contributes 40%
        // Practice history contributes 60%

        masteryScore = Math.round(
          assessmentScore * 0.4 +
            practiceAverage * 0.6
        );
      }

      // ============================================
      // 5. LEARNING RISK
      // ============================================

      const learningRisk = Math.max(
        0,
        100 - masteryScore
      );

      // ============================================
      // 6. IMPROVEMENT
      // ============================================

      const improvement =
        practiceAverage !== null
          ? practiceAverage - assessmentScore
          : 0;

      // ============================================
      // 7. PRIORITY
      // ============================================

      let priority;

      if (masteryScore < 50) {
        priority = "High";
      } else if (masteryScore < 75) {
        priority = "Medium";
      } else {
        priority = "Low";
      }

      // ============================================
      // 8. RECOMMENDED STUDY TIME
      // ============================================

      let recommendedMinutes;

      if (masteryScore < 50) {
        recommendedMinutes = 45;
      } else if (masteryScore < 75) {
        recommendedMinutes = 30;
      } else if (masteryScore < 90) {
        recommendedMinutes = 20;
      } else {
        recommendedMinutes = 15;
      }

      // ============================================
      // 9. STATUS
      // ============================================

      let status;

      if (masteryScore < 50) {
        status = "Needs Attention";
      } else if (masteryScore < 75) {
        status = "Needs Practice";
      } else if (masteryScore < 90) {
        status = "Improving";
      } else {
        status = "Mastered";
      }

      // ============================================
      // 10. LEARNING TREND
      // ============================================

      let trend = "No practice data";

      if (practiceCount >= 2) {
        const previousPractice =
          practiceHistory[
            practiceCount - 2
          ];

        const latestScore =
          latestPracticeScore;

        const previousScore =
          previousPractice.percentage;

        if (latestScore > previousScore) {
          trend = "Improving";
        } else if (
          latestScore < previousScore
        ) {
          trend = "Declining";
        } else {
          trend = "Stable";
        }
      } else if (practiceCount === 1) {
        if (improvement > 0) {
          trend = "Improving";
        } else if (improvement < 0) {
          trend = "Declining";
        } else {
          trend = "Stable";
        }
      }

      // ============================================
      // RETURN TOPIC DATA
      // ============================================

      return {
        topic: data.topic,

        assessmentScore,

        practiceAverage,

        latestPracticeScore,

        masteryScore,

        learningRisk,

        improvement,

        priority,

        recommendedMinutes,

        status,

        trend,

        practiceCount,
      };
    }
  );

  // ============================================
  // 11. SORT BY HIGHEST RISK
  // ============================================

  learningGaps.sort(
    (a, b) =>
      b.learningRisk - a.learningRisk
  );

  return learningGaps;
}