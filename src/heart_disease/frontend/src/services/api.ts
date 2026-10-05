export type PatientData = {
  age: number
  sex: number
  cp: number
  trestbps: number
  chol: number
  fbs: number
  restecg: number
  thalach: number
  exang: number
  oldpeak: number
  slope: number
  ca: number
  thal: number
}

export type PredictionResult = {
  prediction: number
  probability: number
  result: string
}

export async function predictHeartDisease(
  patient: PatientData
): Promise<PredictionResult> {
  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patient),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error("Backend error:", errorData)

    throw new Error("Prediction request failed")
  }

  return response.json()
}