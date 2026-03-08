import random
import pandas as pd
import joblib
import numpy as np
from paho.mqtt import client as mqtt_client

joblib_file = "health_risk_model.pkl"
loaded_model_joblib = joblib.load(joblib_file)
broker = "13.233.207.XXX" # Enter your personal server/broker IP address
port = 1883
topic = "esp32/body-temp"
# Generate a Client ID with the subscribe prefix.
client_id = f"subscribe-{random.randint(0, 100)}"

username = "deXXXXX" # Enter your personal broker cred
password = "deXXXXX" # Enter your personal broker cred


def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id)
    client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def subscribe(client: mqtt_client):
    def on_message(client, userdata, msg):
        Paitent_id = float(input("Enter paitent ID: "))
        age = float(input("Enter age: "))
        weight = float(input("Enter weight: "))
        height = float(input("Enter height: "))
        gender = float(input("Enter gender: "))
        heartrate = 72
        spo2 = 98
        data = pd.DataFrame(
            [
                {
                    "Patient ID": Paitent_id,
                    "Heart Rate": heartrate,
                    "Body Temperature": msg.payload.decode(),
                    "Oxygen Saturation": spo2,
                    "Age": age,
                    "Weight (kg)": weight,
                    "Height (m)": height,
                    "Gender_Male": gender,
                }
            ]
        )
        prediction = loaded_model_joblib.predict(data)
        print(prediction)
        print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")

    client.subscribe(topic)
    client.on_message = on_message


def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()


if __name__ == "__main__":
    run()
