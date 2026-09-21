export function calculateTopicRisk(
  assessmentResults = [],
  practiceResults = []
) {
  if (assessmentResults.length === 0) {
    return [];
  }

  const topics = {};

  // ============================================
  // ASSESSMENT DATA
  // ============================================

  assessmentResults.forEach((result) => {
    if (!topics[result.topic]) {
      topics[result.topic] = {
        topic: result.topic,
        assessmentCorrect: 0,
        assessmentTotal: 0,
        practiceScores: [],
      };
    }

    topics[result.topic].assessmentTotal += 1;

    if (result.isCorrect) {
      topics[result.topic].assessmentCorrect += 1;
    }
  });

  // ============================================
  // PRACTICE DATA
  // ============================================

  practiceResults.forEach((result) => {
    if (!topics[result.topic]) {
      topics[result.topic] = {
        topic: result.topic,
        assessmentCorrect: 0,
        assessmentTotal: 0,
        practiceScores: [],
      };
    }

    topics[result.topic].practiceScores.push(
      result.percentage
    );
  });

  // ============================================
  // CALCULATE TOPIC RISK
  // ============================================

  const topicRisk = Object.values(topics).map(
    (data) => {
      const assessmentScore =
        data.assessmentTotal > 0
          ? Math.round(
              (data.assessmentCorrect /
                data.assessmentTotal) *
                100
            )
          : 0;

      const practiceAverage =
        data.practiceScores.length > 0
          ? Math.round(
              data.practiceScores.reduce(
                (sum, score) => sum + score,
                0
              ) /
                data.practiceScores.length
            )
          : null;

      // ------------------------------------------
      // Mastery
      // ------------------------------------------

      let masteryScore;

      if (practiceAverage === null) {
        masteryScore = assessmentScore;
      } else {
        masteryScore = Math.round(
          assessmentScore * 0.4 +
            practiceAverage * 0.6
        );
      }

      // ------------------------------------------
      // Learning risk
      // ------------------------------------------

      const riskScore = Math.max(
        0,
        100 - masteryScore
      );

      // ------------------------------------------
      // Risk label
      // ------------------------------------------

      let risk;

      if (riskScore >= 60) {
        risk = "High Risk";
      } else if (riskScore >= 30) {
        risk = "Medium Risk";
      } else {
        risk = "Low Risk";
      }

      // ------------------------------------------
      // Recommended time
      // ------------------------------------------

      let recommendedMinutes;

      if (risk === "High Risk") {
        recommendedMinutes = 45;
      } else if (risk === "Medium Risk") {
        recommendedMinutes = 30;
      } else {
        recommendedMinutes = 15;
      }

      return {
        topic: data.topic,
        assessmentScore,
        practiceAverage,
        masteryScore,
        riskScore,
        risk,
        recommendedMinutes,
        practiceAttempts:
          data.practiceScores.length,
      };
    }
  );

  // Highest risk first

  topicRisk.sort(
    (a, b) => b.riskScore - a.riskScore
  );

  return topicRisk;
}