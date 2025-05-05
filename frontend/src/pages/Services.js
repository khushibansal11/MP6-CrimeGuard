import React from "react";
import "../styles/Services.css";
import Card from "../components/ServiceCard";

//Importing Images
import queryAnalysisImg from "../images/queryAnalysisImg.jpeg";
import graphAnalysisImg from "../images/graphAnalysisImg.png";
import predictiveAnalysisImg from "../images/predictiveAnalysisImg.png";
import crimeMap from "../images/crimeMap.png";
import crimeStats from "../images/crimeStats.png";
import crimeTrends from "../images/crimeTrends.png";
import crimeSeverityHeatmap from "../images/crimeSeverityHeatmap.png";


const Services = () => {
  const services = [
    {
      image: queryAnalysisImg,
      title: "Query Analysis",
      description: "Analyze state-wise crime data.",
      link: "query-analysis",
    },
    {
      image: graphAnalysisImg,
      title: "Graph Analysis",
      description: "Visualize crime state-wise using bar chart.",
      link: "graph-analysis",
    },
    {
      image: predictiveAnalysisImg,
      title: "Predictive Analysis",
      description: "Predict future crime patterns.",
      link: "predictive-analysis",
    },
    {
      image: crimeMap,
      title: "Crime Map",
      description: "Visualizes the high crime states.",
      link: "crime-map",
    },
    {
      image: crimeTrends,
      title: "Crime Trends",
      description: "Visualizes the yearly data using line chart.",
      link: "crime-trends",
    },
    {
      image: crimeStats, 
      title: "Crime Statistics",
      description: "Displays the crime breakdown using a pie chart.",
      link: "crime-stats",
    },
    {
      image: crimeSeverityHeatmap, 
      title: "Crime Severity Heatmap",
      description: "Visualizes crime severity states-wise using heatmap.",
      link: "crime-severity-heatmap",
    }
    
  ];

  return (
    <section className="services">
      <div className="container">
        <h2>What We Can Do For You</h2>
        <div className="service-cards">
          {services.map((service, index) => (
            <Card
              key={index}
              image={service.image}
              title={service.title}
              description={service.description}
              link={service.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
