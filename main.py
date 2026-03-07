from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import random
import time

from paho.mqtt import client as mqtt_client

app = FastAPI()
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
joblib_file = (
    "model_filename.pkl"
)
loaded_model_joblib = joblib.load(joblib_file)


class payload(BaseModel):
    pid: int
    hr: float
    temp: float
    spo2: float
    age: float
    weight: float
    height: float
    gender_male: int


@app.post("/predict")
async def root(payload: payload,rc):
    data = pd.DataFrame(
        [
            {
                "Patient ID": payload.pid,
                "Heart Rate": payload.hr,
                "Body Temperature": payload.temp,
                "Oxygen Saturation": payload.spo2,
                "Age": payload.age,
                "Weight (kg)": payload.weight,
                "Height (m)": payload.height,
                "Gender_Male": payload.gender_male,
            }
        ]
    )
    print(data)
    prediction = loaded_model_joblib.predict(data)
    print(prediction[0])
    polished_value = prediction[0].astype(str)
    print(type(polished_value))
    return {polished_value}
temperature = None


@app.post("/update-temp")
def update_temp(temp: str):
    global temperature
    temperature = temp
    return {"ok": True}


@app.get("/temperature")
def get_temperature():
    return {"temperature": temperature}
