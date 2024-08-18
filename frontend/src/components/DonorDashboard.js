import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DonorDashboard.css";
import CharityCard from "./CharityCard";

const DonorDashboard = ({ user, setUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [charities, setCharities] = useState([]);
  const donations = user.donations;

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await axios.get("/charities");
        setCharities(response.data);
      } catch (error) {
        console.error("Error fetching charities:", error);
      }
    };

    if (user) {
      fetchCharities();
    }
  }, [user]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="donor-dashboard">
      <div className="dashboard-sidebar">
        <h2 className="sidebar-title">User Options</h2>
        <input
          className="sidebar-search-bar"
          type="text"
          placeholder="Search for a charity..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <ul className="sidebar-menu">
          <li className="sidebar-item">Explore</li>
          <li className="sidebar-item">My Donation History</li>
          <li className="sidebar-item">Pending Requests</li>
          <li className="sidebar-item">Beneficiary Story</li>
          <li className="sidebar-item">Join the Welfare</li>
          <li className="sidebar-item">Invite a Friend</li>
          <li className="sidebar-item">Settings</li>
          <li className="sidebar-item">Logout</li>
        </ul>
      </div>
      <div className="dashboard-main-content">
        <h1 className="welcome-message">Welcome, {user.username}!</h1>

        <div className="charity-list-container">
          {charities.length === 0 && <div>Loading...</div>}
          {charities
            .filter((charity) =>
              charity.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((charity) => (
              <CharityCard key={charity.id} charity={charity} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
