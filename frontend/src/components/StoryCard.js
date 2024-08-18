import React from "react";
import "./StoryCard.css";

const StoryCard = ({ story }) => {
  return (
    <div className="landingPage__storyContent">
      <p>{story.title}</p>
      <img
        src={story.image_url}
        alt="Beneficiary"
        className="landingPage__storyImage"
      />
      <div className="landingPage__storyText">
        <p>{story.content}</p>
      </div>
    </div>
  );
};

export default StoryCard;
