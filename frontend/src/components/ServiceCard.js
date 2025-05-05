import React from "react";
import "../styles/ServiceCard.css";
import { Link } from "react-router-dom";

const ServiceCard = ({ image, title, description,link }) => {
  return (
    <div className="card">
      <img src={image} alt={title} className="card-image" />
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={`/service/${link}`}className="card-btn">Know More</Link>
    </div>
  );
};

export default ServiceCard;
