import React, { useState, useEffect } from "react";
import "./css/Main.css";
import ticket from "../assets/images/tickets.png";
import search from "../assets/images/search symbol.png";

const BrowseEvent = ({ state }) => {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState(0);
  const { contract } = state;
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };

    loadEvents();
  }, []);

  const fetchEvents = async () => {
    const fetchedEvents = [];
    for (let i = 0; i <= eventId; i++) {
      try {
        const event = await contract.getEvent(i);
        fetchedEvents.push(event);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    }
    return fetchedEvents;
  };

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
            <p className="main-text">Events</p>
          </div>
          {events.map((event, index) => (
            <div key={index}>
              <h2>{event.eventName}</h2>
              <p>Price: {ethers.utils.formatEther(event.price)} ETH</p>
              <p>Total Tickets: {event.totalTickets}</p>
              <p>Remaining Tickets: {event.remTickets}</p>
              <p>Location: {event.location}</p>
              <p>Creator: {event.creator}</p>
              <p>Timestamp: {getReadableDate(event.timestamp)}</p>
              <button>Buy Ticket</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BrowseEvent;
