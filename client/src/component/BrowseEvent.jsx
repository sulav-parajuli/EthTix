import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./css/Main.css";
import ticket from "../assets/images/tickets.png";
import search from "../assets/images/search symbol.png";
import EventDetail from "./EventDetail";

const Popup = ({ isOpen, onClose, ke, event }) => {
  return isOpen ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close" onClick={onClose}>
          Close
        </button>
        <EventDetail index={ke} event={event} />
      </div>
    </div>
  ) : null;
};

const BrowseEvent = ({ state }) => {
  const [events, setEvents] = useState([]);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [isContractReady, setIsContractReady] = useState(false);
  //const [uinqueEventId, setUniqueEventId] = useState([]);

  const [isPopupOpen, setPopupOpen] = useState(false);
  const handleOpenPopup = (index) => {
    setSelectedEventIndex(index);
    setPopupOpen(true);
  };

  const handleClosePopup = async () => {
    setPopupOpen(false);
  };

  const { contract } = state;
  //console.log(contract);

  useEffect(() => {
    const initializeContract = async () => {
      if (!contract) {
        return; //Exist if contract is not available yet
      }
      try {
        //Fetch all events when the component mounts
        const allEvents = await contract.getAllEvents();

        setEvents(allEvents);
        //console.log(allEvents);

        // Subscribe to the EventCreated event
        contract.on("EventCreated", handleEventCreated);
        setIsContractReady(true);
      } catch (error) {
        console.error("Error subscribing to EventCreated event:", error);
      }
    };
    const handleEventCreated = async (eventId) => {
      try {
        if (
          !contract
          //events.some((singleEvent) => singleEvent.eventId.eq(eventId))
        ) {
          alert("Contract not found");
          return;
        }
        // const testid = 1;
        // const testEvent = await contract.getEvent(testid);
        // console.log(testEvent);
        const newEvent = await contract.getEvent(eventId);
        //Append newly created events to the list of events
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
  }, [contract, setEvents, isContractReady]); //uinqueEventId]);

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
          {/* <div className="text-block "> */}

          <div className="event-blocks">
            {events.length === 0 ? (
              <p>Events not available....</p>
            ) : (
              <div className="row">
                {events.map((event, index) => (
                  // <div key={index}>
                  //   <h2>{event.eventName.toString()}</h2>
                  //   <p>
                  //     Price: {ethers.utils.formatEther(event.price).toString()}{" "}
                  //     ETH
                  //   </p>
                  //   <p>Total Tickets: {event.totalTickets.toNumber()}</p>

                  //   <p>Location: {event.location.toString()}</p>
                  //   {/* <p>Creator: {event.creator}</p> */}
                  //   <p>
                  //     Timestamp:{" "}
                  //     {new Date(event.timestamp.toNumber()).toLocaleString()}
                  //   </p>
                  //   <button>Buy Ticket</button>
                  // </div>
                  <div key={index} className="col-4 mb-4">
                    <div className="container">
                      <div className="row justify-space-between py-2">
                        <div className="col-6 mx-auto">
                          <div className="card shadow-lg mt-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                              <a className="d-block blur-shadow-image">
                                <img
                                  src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1950&amp;q=80"
                                  alt="img-blur-shadow"
                                  className="img-fluid shadow border-radius-lg"
                                />
                              </a>
                            </div>
                            <div className="card-body">
                              <h4>{event.eventName.toString()}</h4>
                              <p>
                                Price:{" "}
                                {ethers.utils
                                  .formatEther(event.price)
                                  .toString()}{" "}
                                ETH
                              </p>
                              <p>
                                Total Tickets: {event.totalTickets.toNumber()}
                              </p>

                              <p>Location: {event.location.toString()}</p>
                              {/* <p>Creator: {event.creator}</p> */}
                              <p>
                                Date and Time :
                                {new Date(
                                  event.timestamp.toNumber()
                                ).toLocaleString()}
                              </p>
                              <div className="buttons">
                                <button
                                  className="icon-move-right main-button color-white"
                                  onClick={() => handleOpenPopup(index)}
                                >
                                  Buy Ticket
                                  {/* <i
                              className="fas fa-arrow-right text-xs ms-1"
                              aria-hidden="true"
                            ></i> */}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Popup
                      isOpen={isPopupOpen}
                      onClose={() => {
                        setPopupOpen(false);
                        setSelectedEventIndex(null);
                      }}
                      ke={selectedEventIndex}
                      event={events[selectedEventIndex]}
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
