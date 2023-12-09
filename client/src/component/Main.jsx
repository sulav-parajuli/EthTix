import React, { useState } from "react";
import mainimage from "../assets/images/work anniversary2.png";
import { Link, animateScroll as scroll } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";

const Main = () => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const handleLearnMoreClick = () => {
    setShowMoreInfo(true);
  };

  return (
    <div className="main-container">
      <div className="text-container">
        <div className="text-block">
          <p className="main main-text">
            {showMoreInfo
              ? "Planning to host your own event?"
              : "Transforming your event adventure!"}
          </p>
          <p className="sub-text">
            {showMoreInfo
              ? "Effortlessly organize, execute, and analyze events with our user-friendly UI. Elevate your event hosting experience from start to finish. Get started now!"
              : "Unlocking the potential of your tickets"}
          </p>
        </div>
        <div className="buttons">
          <RouterLink
            style={{ display: showMoreInfo ? "block" : "none" }}
            className="main-button"
            to="/createevent"
          >
            Create Event
          </RouterLink>
          <Link
            to="main-event" // This should match the target component's name
            smooth={true}
            duration={500}
            style={{ display: showMoreInfo ? "none" : "block" }}
            className="main-button no-smooth-scroll"
          >
            Get Started
          </Link>
          <button
            className="sub-button"
            style={{ display: showMoreInfo ? "none" : "block" }}
            onClick={handleLearnMoreClick}
          >
            Host Event
          </button>
        </div>
      </div>
      <div className="image-container">
        <img src={mainimage} className="main-image" alt="Coming Soon" />
      </div>
    </div>
  );
};

export default Main;
