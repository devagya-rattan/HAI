import { useState } from "react";
import axios from "axios";

interface HealthPayload {
  pid: number;
  hr: number;
  temp: number;
  spo2: number;
  age: number;
  weight: number;
  height: number;
  gender_male: number;
}

function App() {

  const [form, setForm] = useState<HealthPayload>({
    pid: 0,
    hr: 0,
    temp: 0,
    spo2: 0,
    age: 0,
    weight: 0,
    height: 0,
    gender_male: 1,
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: Number(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setPrediction("");

      const res = await axios.post(
        "http://127.0.0.1:8000/predict",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // setPrediction(res.data.prediction);
    } catch (err) {
      console.error(err);
      setPrediction(" Error submitting data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2>Patient Health Prediction</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="pid" placeholder="Patient ID" type="number" onChange={handleChange} required />
        <input name="hr" placeholder="Heart Rate" type="number" step="0.1" onChange={handleChange} required />
        <input name="temp" placeholder="Temperature" type="number" step="0.1" onChange={handleChange} required />
        <input name="spo2" placeholder="SpO₂" type="number" step="0.1" onChange={handleChange} required />
        <input name="age" placeholder="Age" type="number" onChange={handleChange} required />
        <input name="weight" placeholder="Weight (kg)" type="number" step="0.1" onChange={handleChange} required />
        <input name="height" placeholder="Height (m)" type="number" step="0.01" onChange={handleChange} required />

        <select name="gender_male" onChange={handleChange}>
          <option value={1}>Male</option>
          <option value={0}>Female</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Submit"}
        </button>
      </form>

      {prediction && (
        <h3 style={{ marginTop: 20 }}>
          Prediction: {prediction}
        </h3>
      )}
    </div>
  );
}
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    marginTop: 60,
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
    width: 280,
  },
};

export default App;