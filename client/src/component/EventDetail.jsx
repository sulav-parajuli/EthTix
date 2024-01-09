import React from "react";
import { ethers } from "ethers";

const EventDetail = ({ event }) => {
  return (
    <div>
      <h2>{event.eventName.toString()}</h2>
      <p>Price: {ethers.utils.formatEther(event.price).toString()} ETH</p>
      <p>Total Tickets: {event.totalTickets.toNumber()}</p>
      <p>Location: {event.location.toString()}</p>
      <p>Timestamp: {new Date(event.timestamp.toNumber()).toLocaleString()}</p>
      <button
        onClick={() => {
          /* Implement Buy Ticket logic */
        }}
      >
        Buy Ticket
      </button>
    </div>
  );
};

export default EventDetail;
