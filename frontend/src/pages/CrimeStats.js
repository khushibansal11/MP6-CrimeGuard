import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import '../styles/analysis-pages.css';
import { BACKEND_URL } from '../config';

const CrimeStats = () => {
  const [chartUrl, setChartUrl] = useState('');

  const handleInputSubmit = (inputs) => {
    const { state, year } = inputs;
    const url = `${BACKEND_URL}/api/crime-stats?state=${encodeURIComponent(state)}&year=${encodeURIComponent(year)}`;
    setChartUrl(url);
  };

  return (
    <div className="analysis-container">
      <h2>Crime Statistics</h2>
      <InputForm fields={['state', 'year']} onSubmit={handleInputSubmit} />

      {chartUrl && (
        <div className="chart-container">
          <img 
            src={chartUrl} 
            alt="Crime Stats Pie Chart" 
            style={{ width: '100%', maxHeight: '500px', marginTop: '20px' }} 
          />
        </div>
      )}
    </div>
  );
};

export default CrimeStats;
