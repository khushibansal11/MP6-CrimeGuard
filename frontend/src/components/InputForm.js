import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/InputForm.css';
import { BACKEND_URL } from '../config';  

const InputForm = ({ fields, onSubmit }) => {
  const [inputs, setInputs] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
  );
  const [states, setStates] = useState([]);
  
  // A mapping of state names to their respective backend values
  const stateOptions = {
    "Andaman & Nicobar Islands": "A & N ISLANDS",
    "Andhra Pradesh": "ANDHRA PRADESH",
    "Arunachal Pradesh": "ARUNACHAL PRADESH",
    "Assam": "ASSAM",
    "Bihar": "BIHAR",
    "Chandigarh": "CHANDIGARH",
    "Chhattisgarh": "CHHATTISGARH",
    "Dadra & Nagar Haveli": "D & N HAVELI",
    "Daman & Diu": "DAMAN & DIU",
    "Delhi": "DELHI UT",
    "Goa": "GOA",
    "Gujarat": "GUJARAT",
    "Haryana": "HARYANA",
    "Himachal Pradesh": "HIMACHAL PRADESH",
    "Jammu & Kashmir": "JAMMU & KASHMIR",
    "Jharkhand": "JHARKHAND",
    "Karnataka": "KARNATAKA",
    "Kerala": "KERALA",
    "Lakshadweep": "LAKSHADWEEP",
    "Madhya Pradesh": "MADHYA PRADESH",
    "Maharashtra": "MAHARASHTRA",
    "Manipur": "MANIPUR",
    "Meghalaya": "MEGHALAYA",
    "Mizoram": "MIZORAM",
    "Nagaland": "NAGALAND",
    "Odisha": "ODISHA",
    "Puducherry": "PUDUCHERRY",
    "Punjab": "PUNJAB",
    "Rajasthan": "RAJASTHAN",
    "Sikkim": "SIKKIM",
    "Tamil Nadu": "TAMIL NADU",
    "Tripura": "TRIPURA",
    "Uttar Pradesh": "UTTAR PRADESH",
    "Uttarakhand": "UTTARAKHAND",
    "West Bengal": "WEST BENGAL"
  };

  useEffect(() => {
    if (fields.some(field => field.toLowerCase() === 'state')) {
      axios.get(`${BACKEND_URL}/api/states`)
        .then(res => setStates(res.data))
        .catch(err => console.error('Failed to load states:', err));
    }
  }, [fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value; // Display name of the state
    setInputs({ ...inputs, state: stateOptions[selectedState] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  return (
    <div className="input-form">
      <form onSubmit={handleSubmit}>
        {fields.map((field) => {
          const isStateField = field.toLowerCase() === 'state';
          return isStateField ? (
            <select
              name="state"
              value={Object.keys(stateOptions).find(
                (key) => stateOptions[key] === inputs.state
              ) || ""}
              onChange={handleStateChange}
            >
              <option value="">Select State/UT</option>
              {Object.keys(stateOptions).map((displayName, idx) => (
                <option key={idx} value={displayName}>
                  {displayName}
                </option>
              ))}
            </select>
          ) : (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field}
              value={inputs[field]}
              onChange={handleChange}
            />
          );
        })}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InputForm;
