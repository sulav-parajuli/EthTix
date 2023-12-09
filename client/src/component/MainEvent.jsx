import React from "react";
import { Link } from "react-router-dom";
import ticketcounter from "../assets/images/tickets.gif";

const MainEvent = () => {
  return (
    <div className="main-event">
      <div className="maine image-container">
        <img src={ticketcounter} className="ticketevent" />
      </div>
      <div
        className="text-container"
        style={{ justifyContent: "center", paddingLeft: "0px" }}
      >
        <div className="maine text-block">
          <p className="main-text">
            Join the excitement. Buy your ticket today!
          </p>
        </div>
        <div className="maine buttons">
          <Link to="/events" className="main-button">
            Explore Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainEvent;
