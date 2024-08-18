import React, { useState, useEffect, useRef } from "react";
import "./LandingPage.css";
import StoryCard from "./StoryCard";

const LandingPage = () => {
  const [charities, setCharities] = useState([]);
  const [beneficiary_stories, setBeneficiaryStories] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Fetch charities from your local server
    fetch("/charities")
      .then((response) => response.json())
      .then((data) => setCharities(data))
      .catch((error) => console.error("Error fetching charities:", error));
  }, []);

  useEffect(() => {
    // Fetch beneficiary_stories from your local server
    fetch("/beneficiary_stories")
      .then((response) => response.json())
      .then((data) => {
        setBeneficiaryStories(data);
      })
      .catch((error) =>
        console.error("Error fetching beneficiary stories:", error)
      );
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300, // Adjust this value based on the width of your cards
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300, // Adjust this value based on the width of your cards
      behavior: "smooth",
    });
  };

  return (
    <div className="landingPage">
      <header className="landingPage__hero">
        <img
          src="https://th.bing.com/th/id/OIP.e9xjV68wpSJXcQKRzsEXNgHaE0?w=285&h=185&c=7&r=0&o=5&dpr=1.5&pid=1.7"
          alt="Hero"
          className="landingPage__heroImage"
        />
        <div className="landingPage__heroOverlay">
          <h1 className="landingPage__heroTitle">
            Help us provide sanitary towels, clean water, and sanitation
            facilities to school-going girls
          </h1>
          <div className="landingPage__donationForm">
            <div className="landingPage__formGroup">
              <label htmlFor="donation-type" className="landingPage__formLabel">
                Donation Type
              </label>
              <select id="donation-type" className="landingPage__formSelect">
                <option value="once">Once</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="landingPage__formGroup">
              <label
                htmlFor="donation-amount"
                className="landingPage__formLabel"
              >
                Amount
              </label>
              <input
                type="number"
                id="donation-amount"
                placeholder="Enter amount"
                className="landingPage__formInput"
              />
            </div>
            <button type="submit" className="landingPage__formButton">
              Donate
            </button>
          </div>
        </div>
      </header>

      <section className="landingPage__charities">
        <h2 className="landingPage__sectionTitle">Our Charities</h2>
        <div className="landingPage__scrollContainer">
          <button
            className="landingPage__arrow landingPage__arrow--left"
            onClick={scrollLeft}
          >
            &#9664;
          </button>
          <div className="landingPage__charitiesList" ref={scrollRef}>
            {charities.map((charity) => (
              <div className="landingPage__charityCard" key={charity.id}>
                <img
                  src={charity.image}
                  alt={charity.name}
                  className="landingPage__charityImage"
                />
                <h3 className="landingPage__charityName">{charity.name}</h3>
                <p className="landingPage__charityDescription">
                  {charity.description}
                </p>
                <a
                  href={`/donate/${charity.id}`}
                  className="landingPage__donateButton"
                >
                  Donate
                </a>
              </div>
            ))}
          </div>
          <button
            className="landingPage__arrow landingPage__arrow--right"
            onClick={scrollRight}
          >
            &#9654;
          </button>
        </div>
      </section>

      <section className="landingPage__about">
        <h2 className="landingPage__sectionTitle">About Us</h2>
        <div className="landingPage__aboutContent">
          <div className="landingPage__aboutText">
            <p>
              In many Sub-Saharan countries, school-going girls miss out on
              education due to lack of sanitary towels and lack of proper
              sanitary facilities. Our platform aims to address this issue by
              enabling easy and regular donations to charities working on this
              cause.
            </p>
          </div>
          <div className="landingPage__aboutImage">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_KZrd0akrx3gxDbL2Xcc9bEsJAO5Kb-btDQ&s"
              alt="About Us"
            />
          </div>
        </div>

        <div className="landingPage__beneficiaryStory">
          <h3 className="landingPage__storyTitle">Beneficiary Story</h3>
          {beneficiary_stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      <section className="landingPage__contact">
        <h2 className="landingPage__sectionTitle">Contact Us</h2>
        <form className="landingPage__contactForm">
          <div className="landingPage__formGroup">
            <label htmlFor="name" className="landingPage__formLabel">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="landingPage__formInput"
            />
          </div>
          <div className="landingPage__formGroup">
            <label htmlFor="email" className="landingPage__formLabel">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="landingPage__formInput"
            />
          </div>
          <div className="landingPage__formGroup">
            <label htmlFor="message" className="landingPage__formLabel">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              required
              className="landingPage__formTextarea"
            ></textarea>
          </div>
          <button type="submit" className="landingPage__formButton">
            Send Message
          </button>
        </form>
        <div className="landingPage__subscription">
          <h3 className="landingPage__subscriptionTitle">
            Subscribe to Our Newsletter
          </h3>
          <form className="landingPage__subscriptionForm">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="landingPage__subscriptionInput"
            />
            <button type="submit" className="landingPage__subscriptionButton">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
