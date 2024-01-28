import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../assets/css/Main.css";
import ticket from "../assets/images/tickets.png";
import search from "../assets/images/search symbol.png";
import EventDetail from "./EventDetail";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";

const Popup = ({ isOpen, onClose, event, state, selectedEventIndex }) => {
  return isOpen ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close" onClick={onClose}>
          Close
        </button>
        <EventDetail
          index={selectedEventIndex}
          event={event[selectedEventIndex]}
          state={state}
        />
      </div>
    </div>
  ) : null;
};

const BrowseEvent = ({ state }) => {
  const { formatTime, events, setEvents, fetchEvents, handleEventCreated } =
    useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const { ticketsContract } = state;
  const [isSearch, setSearch] = useState(false); // Implement search
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Function to handle opening the popup for a selected event
  const handleOpenPopup = (index) => {
    setSelectedEventIndex(index);
    setPopupOpen(true);
    document.body.classList.add("popup-open"); // Prevent scrolling
    document.querySelector(".topnav").style.background =
      "rgba(255,255,255,0.9)";
  };

  const handleSearchButton = () => {
    setSearch(true);
    const filterEvents = events.filter((event) =>
      event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filterEvents);
  };

  useEffect(() => {
    if (ticketsContract) {
      ticketsContract.on("EventCreated", handleEventCreated);
    }

    // Fetch initial events
    fetchEvents().then((initialEvents) => {
      setEvents(initialEvents);
      setIsLoading(false); // Set loading to false once events are fetched
    });

    return () => {
      if (ticketsContract) {
        try {
          // Unsubscribe from the EventCreated event when component unmounts
          ticketsContract.removeAllListeners("EventCreated");
        } catch (error) {
          console.error("Error unsubscribing from EventCreated event:", error);
        }
      }
    };
  }, [ticketsContract]);

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button" onClick={handleSearchButton}>
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
          {isLoading ? (
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#008eb0"
              ariaLabel="triangle-loading"
              wrapperStyle={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh", // 100% of the viewport height
              }}
              wrapperClass=""
            />
          ) : isSearch ? (
            <>
              {isSearch && (
                <div
                  className="searchforevent alert alert-success alert-dismissible fade show"
                  role="alert"
                >
                  <p className="mb-0">{`Searched Events for: ${searchQuery}`}</p>
                  <div
                    type="button"
                    className="searchforeventclose"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setSearch(false)}
                  >
                    <span style={{ width: "1.5em", height: "1.5em" }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </span>
                  </div>
                </div>
              )}
              <div className="event-blocks">
                {filteredEvents.length === 0 ? (
                  <p>Searched Events not available....</p>
                ) : (
                  <div className="row">
                    {filteredEvents.map((event, index) => (
                      <div key={index} className="col-4 mb-4">
                        <div className="container">
                          <div className="row justify-space-between py-2">
                            <div className="col-6 mx-auto">
                              <div className="card shadow-lg mt-4">
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
                                    Available Tickets:&nbsp;
                                    {event.remTickets.toNumber()}
                                  </p>
                                  <p>Location: {event.location.toString()}</p>
                                  <p>
                                    Date and Time:{" "}
                                    {event.date + ", " + formatTime(event.time)}
                                  </p>
                                  <div className="buttons">
                                    <button
                                      className="icon-move-right main-button color-white"
                                      onClick={() => handleOpenPopup(index)}
                                    >
                                      View Details
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Popup
                          isOpen={isPopupOpen && selectedEventIndex === index}
                          onClose={() => {
                            setPopupOpen(false);
                            document.body.classList.remove("popup-open");
                            setSelectedEventIndex(null);
                            document.querySelector(".topnav").style.background =
                              "transparent";
                          }}
                          event={filteredEvents}
                          state={state}
                          selectedEventIndex={selectedEventIndex}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
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
                                  Available Tickets:&nbsp;
                                  {event.remTickets.toNumber()}
                                </p>
                                <p>Location: {event.location.toString()}</p>
                                <p>
                                  Date and Time:{" "}
                                  {event.date + ", " + formatTime(event.time)}
                                </p>
                                <div className="buttons">
                                  <button
                                    className="icon-move-right main-button color-white"
                                    onClick={() => handleOpenPopup(index)}
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Popup
                        isOpen={isPopupOpen && selectedEventIndex === index}
                        onClose={() => {
                          setPopupOpen(false);
                          document.body.classList.remove("popup-open");
                          setSelectedEventIndex(null);
                          document.querySelector(".topnav").style.background =
                            "transparent";
                        }}
                        event={events}
                        state={state}
                        selectedEventIndex={selectedEventIndex}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BrowseEvent;
