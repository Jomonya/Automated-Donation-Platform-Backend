import React, { useState, useEffect } from "react";
import "./CharityDashboardAdmin.css";
import { Link } from "react-router-dom";
const CharityDashboardAdmin = ({
  user,
  charityId,
  approvedCharities,
  setApprovedCharities,
  pendingRequests,
  setPendingRequests,
}) => {
  const [charity, setCharity] = useState(null);
  const [password, setPassword] = useState("");
  const username = user.username;
  const [donations, setDonations] = useState([]);
  const [totals, setTotals] = useState(0);
  const [showDonations, setShowDonations] = useState(false);
  const [showTotal, setShowTotals] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = (id) => {
    if (showDeleteConfirmation) {
      // Perform deletion logic here
      setLoading(true);

      // Introduce a timeout to delay the execution
      setTimeout(() => {
        deleteData(id, "delete");
        setShowDeleteConfirmation(false);
        setCharity(null); // Clear loading state
      }, 10000); // 1000 milliseconds (1 second) delay
    } else {
      setShowDeleteConfirmation(true);
    }
  };

  // Implement the password confirmation logic here
  const confirmDelete = async (event) => {
    event.preventDefault();
    console.log(
      `${username} is the username and password inputted is ${password}`
    );

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        handleDelete(charity.id);
      }
    } catch (error) {
      console.log(username, password);
      console.error("invalid credentials", error);
    }
  };

  useEffect(() => {
    const fetchCharity = async () => {
      const response = await fetch(`/charities/${charityId}`);
      const data = await response.json();

      if (data) {
        // Ensure donations and totalDonatedAmount are not undefined

        setCharity(data);
      } else {
        alert(
          "this charity has no donations or lacks any amount contributed towards it, kindly explore another charity"
        );
      }
    };

    fetchCharity();
  }, [charityId]);

  const getData = async (id, endpoint) => {
    try {
      const response = await fetch(`/${endpoint}/${id}`, { method: "GET" });
      const data = await response.json();
      setCharity(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteData = async (id, endpoint) => {
    try {
      const response = await fetch(`/${endpoint}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDonations = async (id) => {
    setShowDonations(true);
    if (charity && charity.donations) {
      setDonations(charity.donations);
    } else {
      console.error("Error: Charity object or getDonations method is missing.");
    }
  };

  const handleTotalAmount = (id) => {
    setShowTotals(true);
    if (charity && charity.totalDonatedAmount) {
      setTotals(charity.totalDonatedAmount);
    } else {
      console.error("Error: Charity object or totals is missing.");
    }
  };

  const handleClick = () => {
    setCharity(null);
  };
  const handleClickD = () => {
    setShowDeleteConfirmation(false);
  };
  const removeTotal = () => {
    setShowTotals(false);
  };
  const removeDonations = () => {
    setShowDonations(false);
  };
  const exitReview = () => {
    setCharity(null);
  };
  const postData = async (id, endpoint) => {
    try {
      const response = await fetch(`/${endpoint}/${id}`, {
        method: "POST",
      });
      const data = await response.json();
      setCharity(null);
      refreshCharities();
      getData(id, "charity");
    } catch (error) {
      console.error(error);
    }
  };
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
  const handleApprove = (id) => {
    setLoading(true);

    // Introduce a timeout to delay the execution
    setTimeout(() => {
      postData(id, "approve");
      setCharity(null);
      setLoading(false); // Clear loading state
    }, 10000); // 1000 milliseconds (1 second) delay
  };

  const handleReject = (id) => {
    postData(id, "reject");
    setCharity(null);
  };
  if (!charity) {
    return <div></div>;
  }
  if (loading) {
    return (
      <div className="loadingIndicator">
        Request Processing...<p>This might take upto 3 minutes</p>
      </div>
    );
  }

  return (
    <>
      {charity && charity.status === "pending" ? (
        <div className="popup-pending">
          <div className="close-icon" onClick={exitReview}>
            <Link to="/admin_dashboard" className="close-icon">
              &#10005;
            </Link>
          </div>
          <div className="pending-body">
            <h4>Name:</h4>
            <p>{charity.name}</p>
            <h4>About:</h4>
            <p>{charity.description}</p>

            <h4>Mission:</h4>
            <p>{charity.mission_statement}</p>

            <div className="button-container-pending">
              <button
                className="button-approve"
                onClick={() => handleApprove(charity.id)}
              >
                Approve
              </button>
              <button
                className="button-reject"
                onClick={() => handleReject(charity.id)}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="popup">
            {!charity && <div>Loading...</div>}
            <div className="close-icon" onClick={handleClick}>
              <Link to="/admin_dashboard" className="close-icon">
                &#10005;
              </Link>
            </div>
            <div className="button-container">
              <button
                onClick={() => handleDonations(charity.id)}
                className="button"
              >
                View Donations
              </button>

              <button
                onClick={() => handleDelete(charity.id)}
                className="confirm-delete"
              >
                Delete
              </button>
              <button
                onClick={() => handleTotalAmount(charity.id)}
                className="button"
              >
                Totals
              </button>
            </div>
            <div className="container">
              <div className="body">
                <p>{charity.description}</p>
              </div>
              {showDeleteConfirmation ? (
                <div className="popup-delete">
                  <p>enter your password to confirm</p>
                  <div className="close-icon" onClick={handleClickD}>
                    <Link to="/admin_dashboard" className="close-icon">
                      &#10005;
                    </Link>
                  </div>

                  <form onSubmit={confirmDelete}>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                    />
                    <button type="submit" className="confirm-delete">
                      confirm deletion
                    </button>
                  </form>
                </div>
              ) : (
                <div></div>
              )}
              {showDonations && (
                <div className="popup-donations">
                  <div className="close-icon" onClick={removeDonations}>
                    <Link to="/admin_dashboard" className="close-icon">
                      &#10005;
                    </Link>
                  </div>
                  <h2>Donation History</h2>
                  <ul>
                    {donations.map((donation, index) => (
                      <li key={index}>
                        <p>Donor: {donation.donor}</p>
                        <p>Amount: ${donation.amount}</p>
                        <p>Date: {donation.date}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {showTotal ? (
                <div className="popup-total">
                  <div className="close-icon" onClick={removeTotal}>
                    <Link to="/admin_dashboard" className="close-icon">
                      &#10005;
                    </Link>
                  </div>
                  <div>
                    <h2>Totals</h2>
                    <p>
                      {charity.name} has managed to amass a total of{" "}
                      {charity.totalDonatedAmount} as of today. click the View
                      donations button to check or find a specific
                      donation/transaction.
                    </p>
                    <h4>Year totals: updating...</h4>
                    <h4>Monthly totals: updating...</h4>
                    <h4>Target achieved: updating...</h4>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="bottom-line">Send a message</div>
          </div>
        </>
      )}
    </>
  );
};

export default CharityDashboardAdmin;
