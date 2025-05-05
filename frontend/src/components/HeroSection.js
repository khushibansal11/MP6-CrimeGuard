import React from "react";
import "../styles/HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="text-content">
        <h1>Turn Crime Data into Insights</h1>
        <p>
          Detect, Analyze and control crime effectively with technology.
        </p>
        <button className="cta-btn">Get Started</button>
      </div>
      <div className="image-container">
        <img src={require("../images/back.jpg")}
          alt="Crime data analysis"
        />
      </div>
    </section>
  );
};

export default HeroSection;
