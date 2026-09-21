import numpy as np

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score


# ============================================
# SAMPLE TRAINING DATA
# ============================================
#
# Features:
# 1. assessment_score
# 2. practice_average
# 3. practice_attempts
# 4. improvement
#
# Target:
# 0 = Low Risk
# 1 = Medium Risk
# 2 = High Risk
#

X = np.array([
    [95, 92, 5,  2],
    [90, 88, 4,  1],
    [85, 84, 4,  3],
    [80, 82, 3,  2],

    [75, 72, 2, -3],
    [70, 68, 2, -2],
    [65, 70, 2,  5],
    [60, 62, 1,  2],

    [55, 48, 1, -7],
    [50, 45, 1, -5],
    [45, 40, 0, -5],
    [40, 35, 0, -5],
    [35, 30, 0, -5],
    [30, 25, 0, -5],
])


y = np.array([
    0, 0, 0, 0,
    1, 1, 1, 1,
    2, 2, 2, 2, 2, 2
])


# ============================================
# TRAIN MODEL
# ============================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42,
    stratify=y
)


model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


model.fit(X_train, y_train)


# ============================================
# MODEL EVALUATION
# ============================================

predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)


print("Model Accuracy:", round(accuracy * 100, 2), "%")


# ============================================
# PREDICTION FUNCTION
# ============================================

def predict_learning_risk(
    assessment_score,
    practice_average,
    practice_attempts,
    improvement
):
    """
    Predict learning risk for a topic.

    Returns:
        risk_level
        confidence
    """

    features = np.array([[
        assessment_score,
        practice_average,
        practice_attempts,
        improvement
    ]])

    prediction = model.predict(features)[0]

    probabilities = model.predict_proba(
        features
    )[0]

    confidence = round(
        float(max(probabilities)) * 100,
        2
    )

    risk_labels = {
        0: "Low Risk",
        1: "Medium Risk",
        2: "High Risk"
    }

    return {
        "risk": risk_labels[prediction],
        "confidence": confidence
    }


# ============================================
# TEST PREDICTION
# ============================================

if __name__ == "__main__":

    result = predict_learning_risk(
        assessment_score=45,
        practice_average=40,
        practice_attempts=1,
        improvement=-5
    )

    print("\nExample Prediction:")
    print(result)