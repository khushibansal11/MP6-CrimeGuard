import React, { useState } from 'react';
import '../styles/analysis-pages.css';
import { BACKEND_URL } from '../config';

const CrimeSeverityHeatmap = () => {
  const [heatmapUrl, setHeatmapUrl] = useState('');

  const handleInputSubmit = () => {
    const url = `${BACKEND_URL}/api/crime-severity-heatmap`;
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
