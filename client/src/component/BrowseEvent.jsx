import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../assets/css/Main.css";
import ticket from "../assets/images/tickets.png";
import search from "../assets/images/search symbol.png";
import EventDetail from "./EventDetail";
import { retrieveFromIPFS } from "../utils/ipfsUtils";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";

const Popup = ({ isOpen, onClose, ke, event, state }) => {
  return isOpen ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close" onClick={onClose}>
          Close
        </button>
        <EventDetail index={ke} event={event} state={state} />
      </div>
    </div>
  ) : null;
};

// ... (import statements)

const BrowseEvent = ({ state }) => {
  const { formatTime } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [eventIds, setEventIds] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [isContractReady, setIsContractReady] = useState(false);
  const { ticketsContract } = state;

  const [isPopupOpen, setPopupOpen] = useState(false);

  // Function to handle opening the popup for a selected event
  const handleOpenPopup = (index) => {
    setSelectedEventIndex(index);
    setPopupOpen(true);
    document.body.classList.add("popup-open"); // Prevent scrolling
  };

  // Function to fetch events from the smart contract
  const fetchEvents = async () => {
    try {
      if (!ticketsContract) {
        return [];
      }

      // Fetch all events when the component mounts
      const allEvents = await ticketsContract.getAllEvents();
      const eventsWithDetails = await Promise.all(
        allEvents.map(async (event, index) => {
          const details = await retrieveFromIPFS(event.eventCID);
          return { ...event, ...details, index };
        })
      );

      return eventsWithDetails;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  };

  // Function to handle the "EventCreated" event from the smart contract
  const handleEventCreated = async (eventId) => {
    try {
      if (!ticketsContract) {
        alert("Contract not found");
        return;
      }

      // Fetch updated events
      const updatedEvents = await fetchEvents();
      // Update the eventIds state
      setEventIds(updatedEvents.map((event) => event.eventId));
      // Update the events state
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error fetching and updating new event:", error);
    }
  };

  useEffect(() => {
    if (ticketsContract) {
      ticketsContract.on("EventCreated", handleEventCreated);
    }

    // Fetch initial events
    fetchEvents().then((initialEvents) => {
      setEvents(initialEvents);
      setEventIds(initialEvents.map((event) => event.eventId));
      setIsLoading(false); // Set loading to false once events are fetched
    });

    return () => {
      if (isContractReady && ticketsContract) {
        try {
          // Unsubscribe from the EventCreated event when component unmounts
          ticketsContract.removeAllListeners("EventCreated");
        } catch (error) {
          console.error("Error unsubscribing from EventCreated event:", error);
        }
      }
    };
  }, [ticketsContract, setEvents, isContractReady]);

  return (
    <>
      <div className="mcontainer main-event" style={{ paddingTop: "5%" }}>
        {/* ... (other JSX) */}
      </div>
      <div>
        <div className="text-block">
          <p className="main-text">Events</p>
        </div>
        <div>
          <div className="event-blocks">
            {events.length === 0 ? (
              <p>Events not available....</p>
            ) : (
              <div className="row">
                {events.map((event, index) => (
                  <div key={index} className="col-4 mb-4">
                    {/* ... (card layout) */}
                    <Popup
                      isOpen={isPopupOpen && selectedEventIndex === index}
                      onClose={() => {
                        setPopupOpen(false);
                        document.body.classList.remove("popup-open");
                        setSelectedEventIndex(null);
                      }}
                      ke={selectedEventIndex}
                      event={events[selectedEventIndex]}
                      state={state}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowseEvent;
