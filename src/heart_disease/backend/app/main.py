from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import PatientData, PredictionResponse
from .model import model
import pandas as pd
import uvicorn

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Heart Disease Predictor API"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict", response_model=PredictionResponse)
def predict(data: PatientData):
    patient = pd.DataFrame([data.model_dump()])

    prediction = model.predict(patient)[0]
    probability = model.predict_proba(patient)[0][1]

    return {
    "prediction": int(prediction),
    "probability": float(probability),
    "result": (
        "Heart disease detected"
        if prediction == 1
        else "No heart disease detected"
        )
    }


def start() -> None:
    uvicorn.run("heart_disease.backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
