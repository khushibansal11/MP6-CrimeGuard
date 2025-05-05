import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import '../styles/analysis-pages.css';

const CrimeTrends = () => {
  const [chartUrl, setChartUrl] = useState('');

  const handleInputSubmit = (inputs) => {
    const { state, crime_type } = inputs;
    const url = `http://127.0.0.1:5000/api/crime-trends?state=${encodeURIComponent(state)}&crime_type=${encodeURIComponent(crime_type)}`;
    setChartUrl(url);
  };

  return (
    <div className="analysis-container">
      <h2> Crime Trends Analysis</h2>
      <InputForm fields={['state', 'crime_type']} onSubmit={handleInputSubmit} />

      {chartUrl && (
        <div className="chart-container">
          <img 
            src={chartUrl} 
            alt="Crime Trends Chart" 
            style={{ width: '100%', maxHeight: '500px', marginTop: '20px' }} 
          />
        </div>
      )}
    </div>
  );
};

export default CrimeTrends;
