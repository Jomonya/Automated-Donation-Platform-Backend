import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CharityList.css";

const CharityList = () => {
  // Fetch the approved charities
  const [charities, setCharities] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/charities");
      setCharities(response.data);
    };

    fetchData();
  }, []);

  return (
    <div className="charity-list">
      <h1>Available Charities</h1>
      <ul>
        {charities.map((charity) => (
          <li key={charity.id}>
            <h2>{charity.name}</h2>
            <img src={charity.image} alt={charity.name} />
            <p>{charity.description}</p>
            <a href={`/donate/${charity.id}`} className="donate-button">
              Donate
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharityList;
