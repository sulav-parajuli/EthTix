import React from "react";
import { ethers } from "ethers";

const EventDetail = ({ index, event }) => {
  return (
    <div key={index}>
      <h2>{event.eventName.toString()}</h2>
      <p>Price: {ethers.utils.formatEther(event.price).toString()} ETH</p>
      <p>Total Tickets: {event.totalTickets.toNumber()}</p>

      <p>Location: {event.location.toString()}</p>
      {/* <p>Creator: {event.creator}</p> */}
      <p>Timestamp: {new Date(event.timestamp.toNumber()).toLocaleString()}</p>
      <button>Buy Ticket</button>
    </div>
  );
};

export default EventDetail;
