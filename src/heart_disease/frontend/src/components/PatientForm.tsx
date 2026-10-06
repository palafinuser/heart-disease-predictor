import { useState } from "react"
import Info from "./Info"
import {
  predictHeartDisease,
  type PatientData,
  type PredictionResult,
} from "../services/api"

type PatientFormProps = {
  loading: boolean
  onResult: (result: PredictionResult | null) => void
  onLoading: (loading: boolean) => void
  onError: (error: string) => void
}

const fieldInfo = {
  age: "Age of the patient in years.",
  sex: "Sex recorded for the patient.",
  cp: "Type of chest pain experienced by the patient.",
  trestbps: "Resting blood pressure measured in mmHg.",
  chol: "Serum cholesterol level measured in mg/dL.",
  fbs: "Whether fasting blood sugar is greater than 120 mg/dL.",
  restecg: "Resting electrocardiographic result.",
  thalach: "Maximum heart rate achieved during testing.",
  exang: "Whether exercise-induced angina was observed.",
  oldpeak: "ST depression induced by exercise relative to rest.",
  slope: "Slope of the peak exercise ST segment.",
  ca: "Number of major vessels detected by fluoroscopy.",
  thal: "Thalassemia classification recorded for the patient.",
}

function PatientForm({
  loading,
  onResult,
  onLoading,
  onError,
}: PatientFormProps) {
  const [form, setForm] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    onError("")
  }

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    onLoading(true)
    onError("")
    onResult(null)

    const patient: PatientData = {
      age: Number(form.age),
      sex: Number(form.sex),
      cp: Number(form.cp),
      trestbps: Number(form.trestbps),
      chol: Number(form.chol),
      fbs: Number(form.fbs),
      restecg: Number(form.restecg),
      thalach: Number(form.thalach),
      exang: Number(form.exang),
      oldpeak: Number(form.oldpeak),
      slope: Number(form.slope),
      ca: Number(form.ca),
      thal: Number(form.thal),
    }

    try {
      const result = await predictHeartDisease(patient)

      onResult(result)
    } catch (error) {
      console.error(error)
      onError(
        "Unable to connect to the prediction server."
      )
    } finally {
      onLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="prediction-form"
    >
      {/* BASIC INFORMATION */}

      <div className="form-section-title">
        <h2>Basic Information</h2>
        <p>General patient information</p>
      </div>

      <div className="form-group">
        <label htmlFor="age">
          Age
          <Info text={fieldInfo.age} />
        </label>

        <input
          id="age"
          className="form-input"
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          min="1"
          max="119"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="sex">
          Sex
          <Info text={fieldInfo.sex} />
        </label>

        <select
          id="sex"
          className="form-input"
          name="sex"
          value={form.sex}
          onChange={handleChange}
          required
        >
          <option value="">Select sex</option>
          <option value="0">Female</option>
          <option value="1">Male</option>
        </select>
      </div>

      {/* CLINICAL MEASUREMENTS */}

      <div className="form-section-title">
        <h2>Clinical Measurements</h2>
        <p>
          Blood pressure, cholesterol and heart rate
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="trestbps">
          Resting Blood Pressure (mmHg)
          <Info text={fieldInfo.trestbps} />
        </label>

        <input
          id="trestbps"
          className="form-input"
          type="number"
          name="trestbps"
          value={form.trestbps}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="chol">
          Cholesterol (mg/dL)
          <Info text={fieldInfo.chol} />
        </label>

        <input
          id="chol"
          className="form-input"
          type="number"
          name="chol"
          value={form.chol}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="thalach">
          Maximum Heart Rate (bpm)
          <Info text={fieldInfo.thalach} />
        </label>

        <input
          id="thalach"
          className="form-input"
          type="number"
          name="thalach"
          value={form.thalach}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="cp">
          Chest Pain Type
          <Info text={fieldInfo.cp} />
        </label>

        <select
          id="cp"
          className="form-input"
          name="cp"
          value={form.cp}
          onChange={handleChange}
          required
        >
          <option value="">Select type</option>
          <option value="1">Type 1</option>
          <option value="2">Type 2</option>
          <option value="3">Type 3</option>
          <option value="4">Type 4</option>
        </select>
      </div>

      {/* BLOOD & ECG */}

      <div className="form-section-title">
        <h2>Blood & ECG Information</h2>
        <p>
          Blood sugar and electrocardiographic measurements
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="fbs">
          Fasting Blood Sugar &gt; 120 mg/dL
          <Info text={fieldInfo.fbs} />
        </label>

        <select
          id="fbs"
          className="form-input"
          name="fbs"
          value={form.fbs}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="restecg">
          Resting ECG
          <Info text={fieldInfo.restecg} />
        </label>

        <select
          id="restecg"
          className="form-input"
          name="restecg"
          value={form.restecg}
          onChange={handleChange}
          required
        >
          <option value="">Select result</option>
          <option value="0">Normal</option>
          <option value="1">ST-T abnormality</option>
          <option value="2">
            Left ventricular hypertrophy
          </option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="oldpeak">
          ST Depression (Oldpeak)
          <Info text={fieldInfo.oldpeak} />
        </label>

        <input
          id="oldpeak"
          className="form-input"
          type="number"
          name="oldpeak"
          value={form.oldpeak}
          onChange={handleChange}
          min="0"
          step="0.1"
          required
        />
      </div>

      {/* EXERCISE */}

      <div className="form-section-title">
        <h2>Exercise Information</h2>
        <p>Measurements recorded during exercise testing</p>
      </div>

      <div className="form-group">
        <label htmlFor="exang">
          Exercise-Induced Angina
          <Info text={fieldInfo.exang} />
        </label>

        <select
          id="exang"
          className="form-input"
          name="exang"
          value={form.exang}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="slope">
          ST Segment Slope
          <Info text={fieldInfo.slope} />
        </label>

        <select
          id="slope"
          className="form-input"
          name="slope"
          value={form.slope}
          onChange={handleChange}
          required
        >
          <option value="">Select slope</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="ca">
          Major Vessels
          <Info text={fieldInfo.ca} />
        </label>

        <select
          id="ca"
          className="form-input"
          name="ca"
          value={form.ca}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="thal">
          Thalassemia
          <Info text={fieldInfo.thal} />
        </label>

        <select
          id="thal"
          className="form-input"
          name="thal"
          value={form.thal}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="3">Normal</option>
          <option value="6">Fixed Defect</option>
          <option value="7">Reversible Defect</option>
        </select>
      </div>

       <button
  type="submit"
  className="predict-button"
  disabled={loading}
>
  {loading ? "Predicting..." : "Predict"}
</button>
    </form>
  )
}

export default PatientForm