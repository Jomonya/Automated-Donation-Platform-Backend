import React from "react";
import "./CharityCard.css";
import { Link } from "react-router-dom";

const CharityCard = ({ charity }) => (
  <div className="charity-card">
    <img src={charity.image} alt={charity.name} />
    <h3>{charity.name}</h3>
    <strong>{charity.mission_statement}</strong>
    <Link to={`/donate/${charity.id}`} className='donate-button'>Donate</Link>
  </div>
);

export default CharityCard;