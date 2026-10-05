import { useState } from "react"
import "./App.css"

import PatientForm from "./components/PatientForm"
import PredictionResult from "./components/PredictionResult"

import type { PredictionResult as PredictionResultType } from "./services/api"

function App() {
  const [result, setResult] =
    useState<PredictionResultType | null>(null)

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  return (
    <div className="app">
      <div className="container">

        <header className="header">
          <h1>Heart Disease Predictor</h1>

          <p>
            Enter patient information to get a model prediction.
          </p>
        </header>

        <PatientForm
          loading={loading}
          onResult={setResult}
          onLoading={setLoading}
          onError={setError}
        />

        {error && (
          <div className="error-card">
            {error}
          </div>
        )}

        {result && (
          <PredictionResult result={result} />
        )}

      </div>
    </div>
  )
}

export default App