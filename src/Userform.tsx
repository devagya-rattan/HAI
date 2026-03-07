import React, { useState } from 'react'
import axios from 'axios';
// import {temp} from "../index.js"
const Userform = () => {
    // console.log(temp)
    interface UserFormState {
        pid: string;
        hr: string;
        temp: string;
        spo2: string;
        age: string;
        weight: string;
        height: string;
        gender_male: string;
    }
    const [formData, setFormData] = useState<UserFormState>({
        pid: "",
        hr: "",
        temp: "",
        spo2: "",
        age: "",
        weight: "",
        height: "",
        gender_male: "",
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }))
    }
    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/predict', formData);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="App">
            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="Paitent ID">Paitent ID</label>
                    <br />
                    <input  name="pid" id="fname" onChange={handleChange} value={formData.pid} required maxLength={20} />
                    <br />
                </div>

                <div>
                    <label htmlFor="Heartrate">Heartrate</label>
                    <br />
                    <input name="hr" id="lname" onChange={handleChange} value={formData.hr} required maxLength={20} />
                    <br />
                </div>

                <div>
                    <label htmlFor="Body temperature">Body temperature</label>
                    <br />
                    <input name="temp" id="email" onChange={handleChange} value={formData.temp} required maxLength={40} />
                    <br />
                </div>

                <div>
                    <label htmlFor="Oxygen %">Oxygen %</label>
                    <br />
                    <input  name="spo2" id="pass" onChange={handleChange} value={formData.spo2} required maxLength={15} />
                    <br />
                </div>
                <div>
                    <label htmlFor="Age">Age</label>
                    <br />
                    <input name="age" id="pass" onChange={handleChange} value={formData.age} required maxLength={15} />
                    <br />
                </div><div>
                    <label htmlFor="Weight">Weight</label>
                    <br />
                    <input name="weight" id="pass" onChange={handleChange} value={formData.weight} required maxLength={15} />
                    <br />
                </div><div>
                    <label htmlFor="Height">Height</label>
                    <br />
                    <input name="height" id="pass" onChange={handleChange} value={formData.height} required maxLength={15} />
                    <br />
                </div>
                <div>
                    <label htmlFor="Gender">Gender</label>
                    <br />
                    <input name="gender_male" id="pass" onChange={handleChange} value={formData.gender_male} required maxLength={15} />
                    <br />
                </div>
                <button>Start</button>

            </form>
        </div>
    )
}

export default Userform