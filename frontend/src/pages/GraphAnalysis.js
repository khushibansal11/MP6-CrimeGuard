import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import "../styles/analysis-pages.css"

const GraphAnalysis = () => {
  const [imageUrl, setImageUrl] = useState(null);

  const handleInputSubmit = async (inputs) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/graph_analysis?year=${inputs.year}&crime_type=${inputs.crime_type}`
      );
      if (response.ok) {
        const imageBlob = await response.blob();
        setImageUrl(URL.createObjectURL(imageBlob));
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
      <h2>Graph Analysis</h2>
      <InputForm fields={['year', 'crime_type']} onSubmit={handleInputSubmit} />
      {imageUrl && <img src={imageUrl} alt="Graph Analysis" />}
    </div>
  );
};

export default GraphAnalysis;
