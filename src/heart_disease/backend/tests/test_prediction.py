from fastapi.testclient import TestClient

from heart_disease.backend.app.main import app

client = TestClient(app)


VALID_PATIENT = {
    "age": 52,
    "sex": 1,
    "cp": 3,
    "trestbps": 130,
    "chol": 240,
    "fbs": 0,
    "restecg": 1,
    "thalach": 150,
    "exang": 0,
    "oldpeak": 1.0,
    "slope": 2,
    "ca": 0,
    "thal": 3,
}

def test_health():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_prediction_success():
    response = client.post("/predict", json=VALID_PATIENT)

    assert response.status_code == 200

    data = response.json()

    assert "prediction" in data
    assert "probability" in data
    assert "result" in data

    assert data["prediction"] in [0, 1]
    assert 0 <= data["probability"] <= 1


def test_missing_field():
    patient = VALID_PATIENT.copy()
    del patient["age"]

    response = client.post("/predict", json=patient)

    assert response.status_code == 422


def test_invalid_age():
    patient = VALID_PATIENT.copy()
    patient["age"] = -10

    response = client.post("/predict", json=patient)

    assert response.status_code == 422


def test_invalid_chest_pain_type():
    patient = VALID_PATIENT.copy()
    patient["cp"] = 10

    response = client.post("/predict", json=patient)

    assert response.status_code == 422

def test_invalid_sex():
    patient = VALID_PATIENT.copy()
    patient["sex"] = 2

    response = client.post("/predict", json=patient)

    assert response.status_code == 422


def test_invalid_thal():
    patient = VALID_PATIENT.copy()
    patient["thal"] = 2

    response = client.post("/predict", json=patient)

    assert response.status_code == 422


def test_invalid_oldpeak():
    patient = VALID_PATIENT.copy()
    patient["oldpeak"] = -1

    response = client.post("/predict", json=patient)

    assert response.status_code == 422


def test_multiple_missing_fields():
    patient = VALID_PATIENT.copy()
    del patient["age"]
    del patient["chol"]
    del patient["thal"]

    response = client.post("/predict", json=patient)

    assert response.status_code == 422