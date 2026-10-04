import joblib
import pandas as pd

model = joblib.load("../artifacts/heart_model.joblib")

patient = pd.DataFrame([{
    "age": 55,
    "sex": 1,
    "cp": 3,
    "trestbps": 130,
    "chol": 250,
    "fbs": 0,
    "restecg": 1,
    "thalach": 150,
    "exang": 0,
    "oldpeak": 1.0,
    "slope": 2,
    "ca": 0,
    "thal": 3
}])

prediction = model.predict(patient)
probability = model.predict_proba(patient)

print("Prediction:", prediction)
print("Probabilities:", probability)