import React, { useState } from "react";
import "./PendingRequestCard.css";
import CharityDashboardAdmin from "./CharityDashboardAdmin";

const PendingRequestCard = ({
  request,
  user,
  charityId,
  approvedCharities,
  setApprovedCharities,
  pendingRequests,
  setPendingRequests,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCharityId, setSelectedCharityId] = useState(null);

  const handleReview = () => {
    setSelectedCharityId(request.id);
    setShowModal(true);
  };

  const handleReject = () => {
    // Handle reject logic here
  };

  return (
    <div className="pending-card">
      <div className="card-header">
        <h2 className="card-title">{request.name}</h2>
      </div>
      <div className="card-image">
        <img src={request.image} alt={request.name} />
      </div>
      <div className="card-body">
        <p className="card-description">{request.description}</p>
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

export default PendingRequestCard;
