import React, { useState } from "react";
import "./ApprovedCharityCard.css";
import CharityDashboardAdmin from "./CharityDashboardAdmin";

const ApprovedCharityCard = ({
  charity,
  user,
  charityId,
  approvedCharities,
  setApprovedCharities,
  pendingRequests,
  setPendingRequests,
  refreshCharities,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCharityId, setSelectedCharityId] = useState(null);

  const handleReview = () => {
    setSelectedCharityId(charity.id);
    setShowModal(true);
  };

  return (
    <div className="approved-card">
      <div className="card-header">
        <h3 className="card-title">{charity.name}</h3>
      </div>
      <div className="card-image">
        <img src={charity.image} alt={charity.name} />
      </div>
      <div className="card-body">
        <p className="mission-statement">{charity.mission_statement}</p>
      </div>
      <div className="card-footer">
        <button className="review-button" onClick={handleReview}>
          Review
        </button>
      </div>
      {showModal && (
        <CharityDashboardAdmin
          charityId={selectedCharityId}
          user={user}
          approvedCharities={approvedCharities}
          setApprovedCharities={setApprovedCharities}
          pendingRequests={pendingRequests}
          setPendingRequests={setPendingRequests}
        />
      )}
    </div>
  );
};

export default ApprovedCharityCard;
