import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import '../styles/analysis-pages.css';

const PredictiveAnalysis = () => {
  const [results, setResults] = useState(null);

  const handleInputSubmit = async (inputs) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/predictive_analysis?state=${inputs.state}&year=${inputs.year}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        alert('Error fetching data. Please check your inputs.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching the data.');
    }
  };

  return (
    <div className="analysis-container">
      <h2>Predictive Analysis</h2>
      <InputForm fields={['state', 'year']} onSubmit={handleInputSubmit} />
      {results && (
        <div className="results-table">
          <h3>Forecast for Next 5 Years</h3>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Predicted Crimes</th>
              </tr>
            </thead>
            <tbody>
              {results.years.map((year, index) => (
                <tr key={index}>
                  <td>{year}</td>
                  <td>{results.forecast[index].toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PredictiveAnalysis;
