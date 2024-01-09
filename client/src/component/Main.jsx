import React, { useState } from "react";
// import mainimage from "../assets/images/work space1.png";
import mainimage from "../assets/images/work anniversary2.png";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import EventOrganizer from "./EventOrganizer";

import { useAppContext } from "./AppContext";

const Popup = ({ isOpen, onClose, state }) => {
  const { isUserConnected, isEventOrganizer } = useAppContext();
  return isOpen ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close" onClick={onClose}>
          Close
        </button>
        {isUserConnected && !isEventOrganizer ? (
          <EventOrganizer state={state} />
        ) : (
          <div className="container mt-5">
            <p>Sign in to create event</p>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

const Main = ({ state }) => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate(); //to redirect to another page
  const { isUserConnected, isEventOrganizer } = useAppContext();

  const handleOpenPopup = () => {
    setPopupOpen(true);
    document.body.classList.add("popup-open"); // Prevent scrolling
    document.querySelector(".App").background = "rgba(0,0,0,0.9)";
    document.querySelector(".topnav").style.backgroundColor =
      "rgba(255,255,255,0.9)";
  };

  const handleClosePopup = async () => {
    setPopupOpen(false);
    document.body.classList.remove("popup-open"); // Allow scrolling
    document.querySelector(".topnav").style.backgroundColor = "transparent";
  };

  const handleUser = () => {
    if (isUserConnected && isEventOrganizer) {
      document.body.classList.remove("popup-open"); // Allow scrolling
      navigate("/dashboard");
    } else {
      handleOpenPopup();
    }
  };

  const handleLearnMoreClick = () => {
    setShowMoreInfo(true);
  };

  return (
    <div className="main-container">
      <div className="text-container">
        <div className="text-block">
          <p className="main main-text">
            {showMoreInfo ? (
              "Planning to host your own event?"
            ) : (
              <>{"Welcome to EthTix!"}</>
            )}
          </p>
          <p className="sub-text">
            {showMoreInfo
              ? "Effortlessly organize, execute, and analyze events with our user-friendly UI. Elevate your event hosting experience from start to finish. Get started now!"
              : "Elevating your event adventure and unlocking the full potential of your tickets"}
          </p>
        </div>
        <div className="buttons" id="hostevent">
          <button
            style={{ display: showMoreInfo ? "block" : "none" }}
            className="main-button"
            onClick={handleUser}
          >
            Create Event
          </button>
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
      <Popup isOpen={isPopupOpen} onClose={handleClosePopup} state={state} />
      <div className="image-container">
        <img src={mainimage} className="main-image" alt="Coming Soon" />
      </div>
    </div>
  );
};

export default Main;
