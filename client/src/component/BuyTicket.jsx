import React, { useState, useEffect } from "react";

import { useAppContext } from "./AppContext";

const BuyTicket = ({ state }) => {
  const { account } = useAppContext();
  const [ticketAmount, setTicketAmount] = useState(0);

  const [selectedEvent, setSelectedEvent] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const handleTicketPurchase = async (event) => {
    event.preventDefault();
    const { ticketContract } = state;
    if (!ticketContract) {
      console.log("Contract not deployed");
      return;
    }
    try {
      //BrowseEvent must sent selectedEvent to BuyTicket
      const eventId = parseInt(selectedEvent);
      //call the buyTicket function
      //user must themselves enter the value of ticketAmount in metamask

      const transaction = await ticketContract.buyTicket(
        eventId,
        ticketAmount,
        { value: ticketAmount }
      );
      await transaction.wait();
      alert("Ticket purchased");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // Fetch events or any necessary data for the dropdown
    // and populate the dropdown with event options
  }, []); // Add any dependencies for fetching events
  return (
    <div>
      <h2>Buy Tickets</h2>
      <form onSubmit={handleTicketPurchase}>
        <label>
          Select Event:
          <select onChange={(e) => setSelectedEvent(e.target.value)}></select>
        </label>
        <br />
        <label>
          Number of Tickets:
          <input
            type="number"
            value={ticketAmount}
            onChange={(e) => setTicketAmount(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Purchase Tickets</button>
      </form>
    </div>
  );
};
export default BuyTicket;
