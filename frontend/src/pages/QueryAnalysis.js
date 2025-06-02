import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import '../styles/analysis-pages.css';
import { BACKEND_URL } from '../config';

const QueryAnalysis = () => {
  const [results, setResults] = useState([]);

  const handleInputSubmit = async (inputs) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/query_analysis?year=${inputs.year}&state=${inputs.state}`
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
      <h2>Query Analysis</h2>
      <InputForm fields={['year', 'state']} onSubmit={handleInputSubmit} />
      {results.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Crime</th>
              <th>Number of Cases</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={index}>
                <td>{row.Crime}</td>
                <td>{row['Number of Cases']}</td>
                <td>{row.Percentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QueryAnalysis;
