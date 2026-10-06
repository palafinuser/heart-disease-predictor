# Heart Disease Predictor

A full-stack machine learning application that predicts the presence of heart disease from clinical measurements.

The project combines a scikit-learn machine learning pipeline with a FastAPI backend and a React + TypeScript frontend. The complete application can be run with Docker Compose.

> **Disclaimer:** This project is for demonstration purposes only. It is not a medical diagnostic tool and should not be used to make healthcare decisions.

## Features

- Binary heart disease prediction from 13 clinical features
- Logistic Regression machine learning model
- Scikit-learn preprocessing pipeline
- FastAPI REST API
- Pydantic request validation
- React + TypeScript frontend
- Prediction probability display
- Backend API tests with pytest
- Dockerized frontend and backend
- Docker Compose setup for the complete application

## Architecture

```text
React + TypeScript
       │
       │ HTTP POST /predict
       ▼
FastAPI Backend
       │
       ▼
Scikit-learn Pipeline
       │
       ▼
Heart Disease Model
       │
       ▼
Prediction + Probability
       │
       ▼
React Result Display
```

## Machine Learning

### Dataset

The model uses the **UCI Statlog (Heart) dataset**.

- 270 samples
- 13 input features
- Binary target
- No missing values in the selected dataset

The target was converted from the original dataset encoding:

- `1` → no heart disease
- `2` → heart disease

For model training this was converted to:

- `0` → no heart disease
- `1` → heart disease

### Features

The model uses:

- Age
- Sex
- Chest pain type
- Resting blood pressure
- Serum cholesterol
- Fasting blood sugar
- Resting ECG result
- Maximum heart rate
- Exercise-induced angina
- ST depression (`oldpeak`)
- Slope of peak exercise ST segment
- Number of major vessels (`ca`)
- Thalassemia classification (`thal`)

### Preprocessing

Numerical features are standardized using `StandardScaler`.

Categorical features are encoded using `OneHotEncoder` with unknown-category handling.

The preprocessing and classifier are combined into a single scikit-learn `Pipeline`, which ensures that the same transformations are applied during both training and prediction.

### Model

Several models were evaluated during development. Logistic Regression was selected as the final model based on the evaluation results and its strong balance of precision, recall, F1 score, and ROC-AUC.

The final model is saved as:

```text
src/heart_disease/ml/artifacts/heart_model.joblib
```

### Evaluation

The dataset was split into:

- 80% training data
- 20% test data
- Stratified split
- `random_state=42`

Final Logistic Regression test-set results:

| Metric | Score |
|---|---:|
| Accuracy | 87.04% |
| Precision | 81.48% |
| Recall | 91.67% |
| F1 Score | 86.27% |
| ROC-AUC | 91.39% |

The test set contained 54 samples.

These results should be interpreted cautiously because the dataset is relatively small and this model has not been clinically validated.

## Backend

The backend is built with **FastAPI**.

### Endpoints

#### `GET /`

Returns a basic API status message.

#### `GET /health`

Health-check endpoint.

Example response:

```json
{
  "status": "ok"
}
```

#### `POST /predict`

Accepts patient information and returns a prediction.

Example request:

```json
{
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
  "thal": 3
}
```

Example response:

```json
{
  "prediction": 0,
  "probability": 0.24,
  "result": "No heart disease detected"
}
```

The probability represents the model's estimated probability for the positive class used by the application. It should not be interpreted as a clinical risk score.

Interactive API documentation is available through FastAPI at:

```text
http://localhost:8000/docs
```

## Frontend

The frontend is built with:

- React
- TypeScript
- Vite

It provides:

- Structured patient information form
- Input validation
- Field descriptions
- Loading state
- Error handling
- Prediction result card
- Probability visualization
- Educational disclaimer

The frontend communicates with the backend through the `VITE_API_URL` environment variable.

## Tech Stack

### Machine Learning

- Python
- NumPy
- Pandas
- scikit-learn
- Joblib

### Backend

- FastAPI
- Uvicorn
- Pydantic
- pytest

### Frontend

- React
- TypeScript
- Vite

### Deployment / Development

- Docker
- Docker Compose
- uv

## Project Structure

```text
heart-disease/
├── Dockerfile
├── compose.yaml
├── pyproject.toml
├── uv.lock
├── README.md
│
└── src/
    └── heart_disease/
        ├── backend/
        │   ├── app/
        │   │   ├── main.py
        │   │   ├── model.py
        │   │   └── schemas.py
        │   ├── tests/
        │   │   └── test_prediction.py
        │   └── pytest.ini
        │
        ├── frontend/
        │   ├── Dockerfile
        │   ├── package.json
        │   └── src/
        │       ├── components/
        │       ├── services/
        │       ├── App.tsx
        │       └── ...
        │
        └── ml/
            ├── artifacts/
            │   └── heart_model.joblib
            ├── data/
            │   ├── heart.dat
            │   └── ...
            ├── notebooks/
            └── src/
                ├── predict.py
                └── train.py
```

## Running the Project

### Prerequisites

Install:

- Docker Desktop
- Git

For development outside Docker, Python 3.12+, Node.js, and uv are also useful.

### Run with Docker Compose

From the project root:

```bash
docker compose up --build
```

The application will then be available at:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8000
Swagger:  http://localhost:8000/docs
Health:   http://localhost:8000/health
```

To stop the application:

```bash
docker compose down
```

### Environment Variables

The frontend uses:

```env
VITE_API_URL=http://localhost:8000
```

A template is provided in:

```text
src/heart_disease/frontend/.env.example
```

The local `.env` file should not be committed to Git.

## Testing

The backend includes API and validation tests covering:

- Successful predictions
- Missing required fields
- Invalid age
- Invalid chest pain type
- Invalid sex
- Invalid thalassemia value
- Invalid `oldpeak`
- Multiple missing fields
- Health endpoint

Run the tests from the project root:

```bash
uv run pytest
```

## Docker

The project uses two Docker services:

```text
frontend → localhost:5173
backend  → localhost:8000
```

Both services are managed through:

```text
compose.yaml
```

The backend image contains the trained model artifact, while the frontend runs the Vite application inside its own container.

## Limitations

- The dataset contains only 270 samples.
- Model performance depends heavily on the dataset and may not generalize to other populations.
- The model has not undergone clinical validation.
- The displayed probability is a model output, not a medically calibrated risk estimate.
- The application is intended as a machine learning and full-stack engineering project, not a healthcare product.

## Future Improvements

Potential future work includes:

- Cross-validation-based model evaluation
- More robust probability calibration
- Additional datasets and external validation
- More comprehensive frontend testing
- Production-oriented frontend serving
- CI/CD
- Cloud deployment
- Improved model monitoring and experiment tracking

## License

This project is intended as an demonstration and portfolio project.
