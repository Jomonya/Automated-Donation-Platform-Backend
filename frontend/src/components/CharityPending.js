import React from "react";
import { Link } from "react-router-dom";
import "./CharityPending.css";

const CharityPending = () => {
  return (
    <div className="charity-pending">
      <h1>Charity Submission Pending</h1>
      <p>Your charity application has been submitted and is pending approval by the admin.</p>
      <p>Please check back after 24 hours for an update on your application status.</p>
      <Link to="/" className="button">Back to Home</Link>
    </div>
  );
};

export default CharityPending;
