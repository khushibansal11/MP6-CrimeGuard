import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import '../styles/analysis-pages.css';

const CrimeSeverityHeatmap = () => {
  const [heatmapUrl, setHeatmapUrl] = useState('');

  const handleInputSubmit = () => {
    const url = `http://127.0.0.1:5000/api/crime-severity-heatmap`;
    setHeatmapUrl(url);
  };

  return (
    <div className="analysis-container">
      <h2>Crime Severity Heatmap</h2>
      <p>This heatmap visualizes the severity of different crimes across states.</p>
      
      <button className="submit-btn" onClick={handleInputSubmit}>
        Generate Heatmap
      </button>

      {heatmapUrl && (
        <div className="chart-container">
          <img 
            src={heatmapUrl} 
            alt="Crime Severity Heatmap" 
            style={{ width: '100%', maxHeight: '500px', marginTop: '20px' }} 
          />
        </div>
      )}
    </div>
  );
};

export default CrimeSeverityHeatmap;
