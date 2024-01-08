import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../assets/css/Main.css";
import ticket from "../assets/images/tickets.png";
import ethtix from "../assets/images/abstract.png";
import search from "../assets/images/search symbol.png";
import EventDetail from "./EventDetail";
import { retrieveFromIPFS } from "../utils/ipfsUtils";

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
  const { ticketsContract } = state;
  //const [uinqueEventId, setUniqueEventId] = useState([]);

  const [isPopupOpen, setPopupOpen] = useState(false);
  const handleOpenPopup = (index) => {
    setSelectedEventIndex(index);
    setPopupOpen(true);
    document.body.classList.add("popup-open"); // Prevent scrolling
  };

  const fetchEventIpfsContent = async (event) => {
    const eventCid = event.eventCid;
    const eventContent = await retrieveFromIPFS(eventCid);
    return eventContent;
  };
  const getAllEventsWithIPFSContent = async () => {
    try {
      const allEvents = await ticketsContract.getAllEvents();
      const eventsWithIpfsContent = await Promise.all(
        allEvents.map(async (event) => {
          const eventContent = await fetchEventIpfsContent(event);
          return { ...event, ...eventContent };
        })
      );
      setEvents(eventsWithIpfsContent);
      setIsContractReady(true);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleEventCreated = async (eventId) => {
    try {
      if (!ticketsContract) {
        alert("Contract not found");
        return;
      }

      const eventCid = await ticketsContract.getEventCid(eventId);

      const newEvent = await retrieveFromIPFS(eventCid);

      setEvents((prevEvents) => [...prevEvents, newEvent]);

      setSelectedEventIndex(prevEvents.length);

      setPopupOpen(true);
      document.body.classList.add("popup-open");
    } catch (error) {
      console.error("Error fetching and updating new event:", error);
    }
  };

  useEffect(() => {
    const initializeContract = async () => {
      if (!ticketsContract) {
        return;
      }
      try {
        await getAllEventsWithIPFSContent();

        ticketsContract.on("EventCreated", handleEventCreated);
      } catch (error) {
        console.error("Error subscribing to EventCreated event:", error);
      }
    };

    initializeContract();

    return () => {
      if (isContractReady && ticketsContract) {
        try {
          ticketsContract.removeAllListeners("EventCreated");
        } catch (error) {
          console.error("Error unsubscribing from EventCreated event:", error);
        }
      }
    };
  }, [ticketsContract, setEvents, setIsContractReady]);

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
                  <div key={index} className="col-4 mb-4">
                    <div className="container">
                      <div className="row justify-space-between py-2">
                        <div className="col-6 mx-auto">
                          <div className="card shadow-lg mt-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                              <a className="d-block blur-shadow-image">
                                <img
                                  src={ethtix}
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
                        document.body.classList.remove("popup-open"); // Allow scrolling
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
