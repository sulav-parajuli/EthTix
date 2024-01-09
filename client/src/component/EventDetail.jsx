import React, { useState } from "react";
import { ethers } from "ethers";
import ethtix from "../assets/images/abstract.png";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import BuyTicket from "./BuyTicket";
import { useAppContext } from "./AppContext";

const EventDetail = ({ event }) => {
  const { formatTime } = useAppContext();
  const [buyticketpage, setbuyticketpage] = useState(false);
  const handlebuyticket = () => {
    setbuyticketpage(true);
  };
  return (
    <div className="container">
      {buyticketpage ? (
        <BuyTicket event={event} />
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
                {/* Add more carousel items if you have multiple images */}
              </div>
              {/* </div> */}
            </div>
          </div>

          {/* Event Details */}
          <div className="col-lg-6">
            <h2>{event.eventName.toString()}</h2>
            <p>Price: {ethers.utils.formatEther(event.price).toString()} ETH</p>
            <p>Total Tickets: {event.totalTickets.toNumber()}</p>
            <p>Location: {event.location.toString()}</p>
            <p>Date: {event.date + ", " + formatTime(event.time)}</p>
            {/* <p>Creator: {event.creator}</p> */}
            <button
              className="main-button color-white"
              onClick={handlebuyticket}
            >
              Buy Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
