import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CharityDashboard1.css";

const CharityDashboard1 = ({ user }) => {
  const [charityDetails, setCharityDetails] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [stories, setStories] = useState([]);
  const [donors, setDonors] = useState([]);
  const [anonymousDonations, setAnonymousDonations] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [newStory, setNewStory] = useState({ title: '', content: '', image: '' });
  const [editBeneficiary, setEditBeneficiary] = useState(null);
  const [updatedBeneficiary, setUpdatedBeneficiary] = useState({ name: '', description: '', inventory: [] });
  const [newBeneficiary, setNewBeneficiary] = useState({ name: '', description: '', inventory: [] });
  const { username, id } = user;
  const navigate = useNavigate();

  const fetchCharityDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/charities/${id}`);
      setCharityDetails(response.data);
    } catch (error) {
      console.error("Error fetching charity details:", error);
    }
  }, [id]);

  const fetchBeneficiaries = useCallback(async () => {
    try {
      const response = await axios.get(`/charities/${id}/beneficiaries`);
      setBeneficiaries(response.data);
    } catch (error) {
      console.error("Error fetching beneficiaries:", error);
    }
  }, [id]);

  const fetchStories = useCallback(async () => {
    try {
      const response = await axios.get(`/charities/${id}/stories`);
      setStories(response.data);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  }, [id]);

  const fetchDonorData = useCallback(async () => {
    try {
      const response = await axios.get(`/charities/${id}/donors`);
      setDonors(response.data.donors);
      setAnonymousDonations(response.data.anonymousDonations);
      setTotalDonations(response.data.totalDonations);
    } catch (error) {
      console.error("Error fetching donor data:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchCharityDetails();
    fetchBeneficiaries();
    fetchStories();
    fetchDonorData();
  }, [fetchCharityDetails, fetchBeneficiaries, fetchStories, fetchDonorData]);

  const handleRegisterCharity = () => {
    navigate("/create_charity");
  };

  const handlePostStory = async () => {
    if (!newStory.title || !newStory.content) {
      console.error("Story title and content are required.");
      return;
    }

    try {
      const response = await axios.post(`/charities/${id}/stories`, newStory);
      if (response.status === 201) {
        console.log("Story posted successfully:", response.data);
        setNewStory({ title: '', content: '', image: '' });
        fetchStories();
      } else {
        console.error("Failed to post story. Status code:", response.status);
      }
    } catch (error) {
      console.error("Error posting story:", error.response ? error.response.data : error.message);
    }
  };

  const handleUpdateBeneficiary = async () => {
    try {
      await axios.put(`/charities/${id}/beneficiaries/${editBeneficiary.id}`, updatedBeneficiary);
      setEditBeneficiary(null);
      setUpdatedBeneficiary({ name: '', description: '', inventory: [] });
      fetchBeneficiaries();
    } catch (error) {
      console.error("Error updating beneficiary:", error);
    }
  };

  const handleAddBeneficiary = async () => {
    try {
      await axios.post(`/charities/${id}/beneficiaries`, newBeneficiary);
      setNewBeneficiary({ name: '', description: '', inventory: [] });
      fetchBeneficiaries();
    } catch (error) {
      console.error("Error adding beneficiary:", error);
    }
  };

  return (
    <div className="uniqueCharityDashboard">
      <aside className="uniqueSidebar">
        <h2 className="uniqueSidebarTitle">Navigation</h2>
        <ul className="uniqueSidebarList">
          <li className="uniqueSidebarItem"><a href="#charity-details" className="uniqueSidebarLink">Charity Details</a></li>
          <li className="uniqueSidebarItem"><a href="#donors" className="uniqueSidebarLink">Donors</a></li>
          <li className="uniqueSidebarItem"><a href="#beneficiaries" className="uniqueSidebarLink">Beneficiaries</a></li>
          <li className="uniqueSidebarItem"><a href="#stories" className="uniqueSidebarLink">Stories</a></li>
        </ul>
      </aside>

      <div className="uniqueMainContent">
        <h1 className="uniqueMainHeading">Charity Dashboard</h1>
        <p className="uniqueMainWelcome">Welcome, {username}! Here you can manage your charity details, beneficiaries, and stories.</p>

        <button className="uniqueMainButton" onClick={handleRegisterCharity}>
          Register a New Charity
        </button>

        <div id="charity-details" className="uniqueCharityDetails">
          {charityDetails && (
            <>
              <h2 className="uniqueSectionHeading">Charity Details</h2>
              <p className="uniqueSectionParagraph">Name: {charityDetails.name}</p>
              <p className="uniqueSectionParagraph">Description: {charityDetails.description}</p>
              <p className="uniqueSectionParagraph">Mission Statement: {charityDetails.mission_statement}</p>
              <p className="uniqueSectionParagraph">Goals: {charityDetails.goals}</p>
              <p className="uniqueSectionParagraph">Impact: {charityDetails.impact}</p>
              <img className="uniqueCharityImage" src={charityDetails.image} alt={`${charityDetails.name} logo`} />
            </>
          )}
        </div>

        <div id="donors" className="uniqueDonors">
          <h2 className="uniqueSectionHeading">Donors</h2>
          {donors.length > 0 ? (
            <>
              <div className="uniqueDonorSection">
                <h3 className="uniqueDonorSubHeading">Non-Anonymous Donors</h3>
                {donors.filter(donor => !donor.anonymous).map(donor => (
                  <div key={donor.id} className="uniqueDonorItem">
                    <p className="uniqueSectionParagraph">Name: {donor.name}</p>
                    <p className="uniqueSectionParagraph">Donation Amount: ${donor.amount}</p>
                  </div>
                ))}
              </div>
              <div className="uniqueDonorSection">
                <h3 className="uniqueDonorSubHeading">Anonymous Donors</h3>
                {donors.filter(donor => donor.anonymous).map(donor => (
                  <div key={donor.id} className="uniqueDonorItem">
                    <p className="uniqueSectionParagraph">Donation Amount: ${donor.amount}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="uniqueSectionParagraph">No donors found.</p>
          )}
          <div className="uniqueTotalAmount">
            <p className="uniqueSectionParagraph">Total Donations: ${totalDonations}</p>
            <p className="uniqueSectionParagraph">Anonymous Donations: ${anonymousDonations}</p>
          </div>
        </div>

        <div id="beneficiaries" className="uniqueBeneficiaries">
          <h2 className="uniqueSectionHeading">Beneficiaries</h2>
          {beneficiaries.length > 0 ? (
            beneficiaries.map((beneficiary) => (
              <div key={beneficiary.id} className="uniqueBeneficiaryItem">
                <p className="uniqueSectionParagraph">Name: {beneficiary.name}</p>
                <p className="uniqueSectionParagraph">Description: {beneficiary.description}</p>
                <p className="uniqueSectionParagraph">Inventory Sent: {beneficiary.inventory.join(', ')}</p>
                <button className="uniqueMainButton" onClick={() => setEditBeneficiary(beneficiary)}>Edit</button>
              </div>
            ))
          ) : (
            <p className="uniqueSectionParagraph">No beneficiaries found.</p>
          )}
          <div className="uniqueAddBeneficiary">
            <h3 className="uniqueSubHeading">Add New Beneficiary</h3>
            <input
              type="text"
              placeholder="Beneficiary Name"
              value={newBeneficiary.name}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
              className="uniqueInput"
            />
            <textarea
              placeholder="Beneficiary Description"
              value={newBeneficiary.description}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, description: e.target.value })}
              className="uniqueTextarea"
            />
            <input
              type="text"
              placeholder="Inventory Items (comma-separated)"
              value={newBeneficiary.inventory}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, inventory: e.target.value.split(',') })}
              className="uniqueInput"
            />
            <button className="uniqueMainButton" onClick={handleAddBeneficiary}>Add Beneficiary</button>
          </div>

          {editBeneficiary && (
            <div className="uniqueEditBeneficiary">
              <h3 className="uniqueSubHeading">Edit Beneficiary</h3>
              <input
                type="text"
                placeholder="Beneficiary Name"
                value={updatedBeneficiary.name}
                onChange={(e) => setUpdatedBeneficiary({ ...updatedBeneficiary, name: e.target.value })}
                className="uniqueInput"
              />
              <textarea
                placeholder="Beneficiary Description"
                value={updatedBeneficiary.description}
                onChange={(e) => setUpdatedBeneficiary({ ...updatedBeneficiary, description: e.target.value })}
                className="uniqueTextarea"
              />
              <input
                type="text"
                placeholder="Inventory Items (comma-separated)"
                value={updatedBeneficiary.inventory}
                onChange={(e) => setUpdatedBeneficiary({ ...updatedBeneficiary, inventory: e.target.value.split(',') })}
                className="uniqueInput"
              />
              <button className="uniqueMainButton" onClick={handleUpdateBeneficiary}>Update Beneficiary</button>
            </div>
          )}
        </div>

        <div id="stories" className="uniqueStories">
          <h2 className="uniqueSectionHeading">Beneficiary Stories</h2>
          {stories.length > 0 ? (
            stories.map(story => (
              <div key={story.id} className="uniqueStoryItem">
                <h3 className="uniqueStoryTitle">{story.title}</h3>
                <p className="uniqueSectionParagraph">{story.content}</p>
                {story.image && <img src={story.image} alt={story.title} className="uniqueStoryImage" />}
              </div>
            ))
          ) : (
            <p className="uniqueSectionParagraph">No stories found.</p>
          )}
          <div className="uniquePostStory">
            <h3 className="uniqueSubHeading">Post a New Story</h3>
            <input
              type="text"
              placeholder="Story Title"
              value={newStory.title}
              onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
              className="uniqueInput"
            />
            <textarea
              placeholder="Story Content"
              value={newStory.content}
              onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
              className="uniqueTextarea"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newStory.image}
              onChange={(e) => setNewStory({ ...newStory, image: e.target.value })}
              className="uniqueInput"
            />
            <button className="uniqueMainButton" onClick={handlePostStory}>Post Story</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityDashboard1;
