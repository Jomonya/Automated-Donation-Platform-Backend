import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import ApprovedCharityCard from "./ApprovedCharityCard";
import PendingRequestCard from "./PendingRequestCard";
import CharityDashboardAdmin from "./CharityDashboardAdmin";

const AdminDashboard = ({ user }) => {
  const [charities, setCharities] = useState([]);
  const [approvedCharities, setApprovedCharities] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const [displayContent, setDisplayContent] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [selectedListElement, setSelectedListElement] = useState(null);
  const [foundCharity, setFoundCharity] = useState(null);

  const refreshCharities = async () => {
    try {
      const response = await fetch("/charities");
      const charities = await response.json();

      const approved = charities.filter(
        (charity) => charity.status === "approved"
      );
      const pending = charities.filter(
        (charity) => charity.status === "pending"
      );

      setApprovedCharities(approved);
      setPendingRequests(pending);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    refreshCharities();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;

    setSearchQuery(query);

    // Implement search logic here
    setFoundCharity(
      charities.find(
        (charity) =>
          charity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          charity.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    if (foundCharity) {
      setSelectedCharity(foundCharity);
      handleListClick();
      console.log(foundCharity.id);
    }
  };

  const handleListClick = (elementName) => {
    setSelectedListElement(elementName);
    if (searchQuery) {
      setDisplayContent(
        <CharityDashboardAdmin
          charityId={foundCharity.id}
          user={user}
          approvedCharities={approvedCharities}
          setApprovedCharities={setApprovedCharities}
          pendingRequests={pendingRequests}
          setPendingRequests={setPendingRequests}
        />
      );
    } else {
      switch (elementName) {
        case "Pending Requests":
          setDisplayContent(
            <>
              <h2>Pending Requests</h2>
              <div className="content-grid">
                {pendingRequests.map((request) => (
                  <PendingRequestCard
                    key={request.id}
                    request={request}
                    user={user}
                    approvedCharities={approvedCharities}
                    setApprovedCharities={setApprovedCharities}
                    pendingRequests={pendingRequests}
                    setPendingRequests={setPendingRequests}
                  />
                ))}
              </div>
            </>
          );
          break;
        case "Approved Requests":
          setDisplayContent(
            <>
              <h2>Approved Requests</h2>
              <div className="content-grid">
                {approvedCharities.map((charity) => (
                  <ApprovedCharityCard
                    key={charity.id}
                    refreshCharities={refreshCharities}
                    charity={charity}
                    user={user}
                    approvedCharities={approvedCharities}
                    setApprovedCharities={setApprovedCharities}
                    pendingRequests={pendingRequests}
                    setPendingRequests={setPendingRequests}
                  />
                ))}
              </div>
            </>
          );
          break;
        default:
          setDisplayContent([]);
      }
    }
  };
  return (
    <div className="admin-dashboard">
      <div className="dashboard-sidebar">
        <h2 className="sidebar-title">Admin Options</h2>
        <input
          className="sidebar-search-bar"
          type="text"
          placeholder="Search for a charity..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <ul className="sidebar-menu">
          <li
            onClick={() => handleListClick("Explore")}
            className="sidebar-item"
          >
            Explore
          </li>
          <li
            onClick={() => handleListClick("My Donation History")}
            className="sidebar-item"
          >
            My Donation History
          </li>
          <li
            onClick={() => handleListClick("Pending Requests")}
            className="sidebar-item"
          >
            Pending Requests
          </li>
          <li
            onClick={() => handleListClick("Approved Requests")}
            className="sidebar-item"
          >
            Approved Requests
          </li>
          <li
            onClick={() => handleListClick("Beneficiary Story")}
            className="sidebar-item"
          >
            Beneficiary Story
          </li>
          <li
            onClick={() => handleListClick("Join the Welfare")}
            className="sidebar-item"
          >
            Join the Welfare
          </li>
          <li
            onClick={() => handleListClick("To be Admin Requests")}
            className="sidebar-item"
          >
            To be Admin Requests
          </li>
          <li
            onClick={() => handleListClick("Invite a Friend")}
            className="sidebar-item"
          >
            Invite a Friend
          </li>
          <li
            onClick={() => handleListClick("Settings")}
            className="sidebar-item"
          >
            Settings
          </li>
        </ul>
      </div>
      <div className="dashboard-main-content">
        <h1 className="welcome-message">Welcome, {user.username}!</h1>
        <div className="content-container">{displayContent}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
