import React, { useState } from "react";
import "./CreateCharity.css";
import { useNavigate } from "react-router-dom";

const NewCharityForm = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [impact, setImpact] = useState(""); 
  const [goals, setGoals] = useState("");
  const [mission_statement, setMissionStatement] = useState("");
  const [paypal_account, setPaypalAccount] = useState("");
  

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/charities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          goals,
          image,
          mission_statement,
          impact,
          description,
          paypal_account,
        }),
      });

      if (response.ok) {
        setIsLoading(false);
        // Navigate to a page informing the user about the approval process
        navigate("/charity_pending");
      } else {
        throw new Error("Failed to create charity");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Registration failed", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="charity-container">
      <form className="charity-form" onSubmit={handleSubmit}>
        <p>
          Fill out the following form and click the submit button at the bottom.
          You will have to wait for your application to be approved. Kindly
          check after 24 hours...
        </p>

        <div className="inputsContainer">
          <div className="label-and-input">
            <label className="form-label">Name:</label>
            <input
              className="form-input"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your preferred name for your charity"
            />
          </div>
          
          <div className="label-and-input">
            <label className="form-label">PayPal Email:</label>
            <input
              className="form-input"
              type="text"
              name="paypal_account"
              value={paypal_account}
              placeholder="Enter your paypal email"
              onChange={(e) => setPaypalAccount(e.target.value)}
              required
            />
          </div>
          <div className="label-and-input">
            <label className="form-label">Image:</label>
            <input
              className="form-input"
              type="text"
              name="image"
              value={image}
              placeholder="Enter charity image URL for profile"
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </div>

          <div className="label-and-input">
            <label className="form-label">Description:</label>
            <input
              className="form-input"
              type="text"
              name="description"
              value={description}
              placeholder="Enter a small description about your charity"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="label-and-input">
            <label className="form-label">Mission Statement:</label>
            <input
              className="form-input"
              type="text"
              name="mission_statement"
              value={mission_statement}
              onChange={(e) => setMissionStatement(e.target.value)}
              required
              placeholder="Enter your charity mission statement"
            />
          </div>
          <div className="label-and-input">
            <label className="form-label">Goals:</label>
            <input
              className="form-input"
              type="text"
              name="goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              required
              placeholder="Charity will have the following goals.."
            />
          </div>
          <div className="label-and-input">
            <label className="form-label">Impact:</label>
            <input
              className="form-input"
              type="text"
              name="impact"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              required
              placeholder="Our impact on society will include.."
            />
          </div>

          {error && <div className="error">{error}</div>}
          {isLoading && <div className="loading">Loading...</div>}

          <button className="submit-btn" type="submit" disabled={isLoading}>
            Create Charity
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCharityForm;
