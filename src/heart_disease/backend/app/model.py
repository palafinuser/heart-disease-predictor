from pathlib import Path

import joblib

MODEL_PATH = Path(__file__).resolve().parents[2] / "ml" / "artifacts" / "heart_model.joblib"

model = joblib.load(MODEL_PATH)
