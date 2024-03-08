import React, { useState } from "react";
import { ethers } from "ethers";
import ethtix from "../assets/images/abstract.png";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import BuyTicket from "./BuyTicket";
import { useAppContext } from "./AppContext";
import UserTerm from "./UserTerm";
const Popup = ({ isOpen, onClose, onConfirm }) => {
  return isOpen ? (
    <div className="popup popuptop">
      <div className="card mb-5">
        <UserTerm onConfirm={onConfirm} />
      </div>
    </div>
  ) : null;
};

const EventDetail = ({ index, event, state }) => {
  const { formatTime } = useAppContext();
  const [buyticketpage, setbuyticketpage] = useState(false);
  const [agreeTermsCondition, setAgreeTermsCondition] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleTermsCondition = () => {
    setShowTerms(true);
  };
  const handlePopupConfirm = () => {
    setShowTerms(false);
    setAgreeTermsCondition(true);
  };

  const handlebuyticket = () => {
    setbuyticketpage(true);
  };
  return (
    <div className="container">
      {buyticketpage ? (
        <BuyTicket eventIndex={index} event={event} state={state} />
      ) : (
        <div className="row py-2">
          {/* Image Slider */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-lg mt-4">
              {/* <div
              id="eventImageCarousel"
              className="carousel slide"
              data-ride="carousel"
            > */}
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src={ethtix}
                    className="img-fluid"
                    alt="Event"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                  />
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>

          {/* Event Details */}
          <div className="col-lg-6">
            <h2 style={{ textAlign: "justify", padding: "0px" }}>
              {event.eventName.toString()}
            </h2>
            <p>Price: {ethers.utils.formatEther(event.price).toString()} ETH</p>
            <p>
              Available Tickets:&nbsp;
              {event.remTickets.toNumber()}
            </p>
            <p>Location: {event.location.toString()}</p>
            <p>Date: {event.date + ", " + formatTime(event.time)}</p>
            <p>
              Description:&nbsp;
              {event.description?.toString() || "No Description"}
            </p>
            <p>
              <input
                type="checkbox"
                value={agreeTermsCondition}
                disabled={agreeTermsCondition}
                onChange={handleTermsCondition}
              />
              <label>
                {" "}
                I agree to terms and condition
                <span className="required">*</span>{" "}
              </label>
              <br></br>
            </p>
            <button
              className="main-button color-white"
              onClick={handlebuyticket}
              disabled={!agreeTermsCondition}
            >
              Buy Ticket
            </button>
          </div>
          <Popup
            isOpen={showTerms}
            onClose={() => setShowTerms(false)}
            onConfirm={handlePopupConfirm}
          />
        </div>
      )}
    </div>
  );
};

export default EventDetail;
