import pandas as pd 
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer    
from sklearn.preprocessing import StandardScaler, OneHotEncoder  
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)
import joblib 

#define columns
columns = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak",
    "slope", "ca", "thal", "target"
]

#load dataset: https://archive.ics.uci.edu/dataset/145/statlog%2Bheart
df = pd.read_csv(
    "../data/heart.dat",
    sep=r"\s+",
    names=columns
)

#create features(X)/target(y)
X = df.drop("target", axis=1)
y = (df["target"] == 2).astype(int)

#train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

#preprocessing pipline for logistic regression
numerical = ["age", "trestbps", "chol", "thalach", "oldpeak"]
categorical = ["sex", "cp", "fbs", "restecg", "exang", "slope", "ca", "thal"]

preprocessor = ColumnTransformer([
    ("num", StandardScaler(), numerical),
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical)
])

model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(max_iter=1000))
])

#train Logistic Regression
model.fit(X_train, y_train)

#evaluate trained model

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("Accuracy :", accuracy_score(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred))
print("Recall   :", recall_score(y_test, y_pred))
print("F1       :", f1_score(y_test, y_pred))
print("ROC-AUC  :", roc_auc_score(y_test, y_prob))

#save trained pipeline
joblib.dump(model, "../artifacts/heart_model.joblib")
print("Saved model successfully!")