import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./css/Main.css";
import ticket from "../assets/images/tickets.png";
import search from "../assets/images/search symbol.png";

const BrowseEvent = ({ state }) => {
  const [events, setEvents] = useState([]);
  const [isContractReady, setIsContractReady] = useState(false);

  const { contract } = state;
  // console.log(contract);

  useEffect(() => {
    const initializeContract = async () => {
      if (!contract) {
        return; //Exist if contract is not available yet
      }
      try {
        //Subscribe to EventCreated event
        contract.on("EventCreated", (eventId) => handleEventCreated(eventId));
        setIsContractReady(true);
      } catch (error) {
        console.error("Error subscribing to EventCreated event:", error);
      }
    };
    const handleEventCreated = async (eventId) => {
      try {
        if (!contract) {
          alert("Contract not found");
          return;
        }
        // const testid = 1;
        // const testEvent = await contract.getEvent(testid);
        // console.log(testEvent);
        const newEvent = await contract.getEvent(eventId);
        console.log("New event created:", newEvent);
        setEvents((prevEvents) => [...prevEvents, newEvent]);
      } catch (error) {
        console.error("Error fetching and updating new event:", error);
      }
    };
    initializeContract();

    return () => {
      if (isContractReady && contract) {
        try {
          // Unsubscribe from the EventCreated event when component unmounts
          contract.removeAllListeners("EventCreated");
        } catch (error) {
          console.error("Error unsubscribing from EventCreated event:", error);
        }
      }
    };
  }, [contract, setEvents, isContractReady]);

  return (
    <>
      <div className="mcontainer main-event" style={{ paddingTop: "5%" }}>
        <div className="text-container" style={{ padding: "5%" }}>
          <div className="text-block">
            <p className="main-text">
              Unforgettable moments await. Grab your ticket now!
            </p>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search events"
              className="search-input"
            />
            <button className="search-button">
              <img src={search} alt="Search" />
            </button>
          </div>
        </div>
        <div className="image-container">
          <img src={ticket} className="ticketevent" />
        </div>
      </div>
      <div>
        <div className="text-block">
          <p className="main-text">Events</p>
        </div>
        <div>
          Event cards and other logic goes here.
          <div className="text-block">
            {events.length === 0 && <p>No events found.</p>}
            {events.map((event, index) => (
              <div key={index}>
                <h2>{event.eventName}</h2>
                <p>Price: {ethers.utils.formatEther(event.price)} ETH</p>
                <p>Total Tickets: {event.totalTickets}</p>
                <p>Remaining Tickets: {event.remTickets}</p>
                <p>Location: {event.location}</p>
                <p>Creator: {event.creator}</p>
                <p>
                  Timestamp: {new Date(event.timestamp * 1000).toLocaleString()}
                </p>
                <button>Buy Ticket</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowseEvent;
