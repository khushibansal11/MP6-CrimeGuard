import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import '../styles/analysis-pages.css';

const CrimeMap = () => {
  const [mapUrl, setMapUrl] = useState('');

  const handleInputSubmit = (inputs) => {
    const { year, crime_type } = inputs;
    const url = `http://127.0.0.1:5000/api/crime-map?year=${year}&crime_type=${encodeURIComponent(crime_type)}`;
    setMapUrl(url);
  };

  return (
    <div className="analysis-container">
      <h2>Crime Map Analysis</h2>
      <InputForm fields={['year', 'crime_type']} onSubmit={handleInputSubmit} />
      
      {mapUrl && (
        <div className="map-container">
          <iframe 
            src={mapUrl} 
            width="100%" 
            height="500px" 
            style={{ border: 'none', marginTop: '20px' }} 
            title="Crime Map"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default CrimeMap;
