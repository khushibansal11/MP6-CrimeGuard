import React from "react";
// import realTimeViolenceImg from "../images/aboutImg.png"
import "../styles/AboutCrimeGuard.css";

//Importing Images
import queryAnalysisImg from "../images/queryAnalysisImg.jpeg";
import graphAnalysisImg from "../images/graphAnalysisImg.png";
// import predictiveAnalysisImg from "../images/predictiveAnalysisImg.png";
import crimeMap from "../images/crimeMap.png";
import crimeStats from "../images/crimeStats.png";
import crimeTrends from "../images/crimeTrends.png";
import crimeSeverityHeatmap from "../images/crimeSeverityHeatmap.png";

const AboutCrimeGuard = () => {
    return (
        <div className="about-section">
          <div className="container">
            <h2 className="about-title">About CrimeGuard</h2>
            
            {/* Real-Time Violence Detection */}
            <div className="section-container red-bg" style={{ backgroundColor: "#ddcaf1" }}>
              <p>CrimeGuard's real-time video processing technology detects violent activities and alerts authorities instantly, ensuring swift action to prevent crime.</p>
            </div>
            
            {/* Predictive Analysis */}
            <div className="section-container blue-bg" style={{ backgroundColor: "#cae1f1" }} >
              <p>Utilizing advanced machine learning models, CrimeGuard analyzes historical crime data to predict future crime trends and assist law enforcement.</p>
            </div>
            
            {/* Services */}
            <div className="section-container green-bg">
              <h3 className="services-title">Our Services</h3>
              <div className="services-grid">
                <div className="service-card" style={{ backgroundImage: `url('${queryAnalysisImg}')` }}>
                  <h4>Query Analysis</h4>
                  <p>Analyze state-wise crime data.</p>
                </div>
                <div className="service-card" style={{ backgroundImage: `url('${graphAnalysisImg}')`}}>
                  <h4>Graph Analysis</h4>
                  <p>Visualize crime state-wise using bar charts.</p>
                </div>
                <div className="service-card" style={{ backgroundImage: `url('${crimeMap}')` }}>
                  <h4>Crime Map</h4>
                  <p>Visualizes the high crime states.</p>
                </div>
                <div className="service-card" style={{ backgroundImage: `url('${crimeTrends}')` }}>
                  <h4>Crime Trends</h4>
                  <p>Visualizes yearly crime data using line charts.</p>
                </div>
                <div className="service-card" style={{ backgroundImage: `url('${crimeStats}')` }}>
                  <h4>Crime Statistics</h4>
                  <p style={{ color: "#fff" }}>Displays crime breakdown using pie charts.</p>
                </div>
                <div className="service-card" style={{ backgroundImage: `url('${crimeSeverityHeatmap}')` }}>
                  <h4>Crime Severity Heatmap</h4>
                  <p style={{ color: "#fff" }}>Visualizes crime severity state-wise using heatmaps.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default AboutCrimeGuard;
    