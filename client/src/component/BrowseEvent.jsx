import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../assets/css/Main.css";
import ticket from "../assets/images/tickets.png";
import search from "../assets/images/search symbol.png";
import EventDetail from "./EventDetail";
import { retrieveFromIPFS } from "../utils/ipfsUtils";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";

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
  const { formatTime } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
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
    document.querySelector(".topnav").style.background =
      "rgba(255,255,255,0.9)";
  };

  const fetchEventIpfsContent = async (event) => {
    const eventCID = event.eventCID;
    const eventContent = await retrieveFromIPFS(eventCID);
    return eventContent;
  };
  const getAllEventsWithIPFSContent = async () => {
    try {
      setIsLoading(true);
      const allEvents = await ticketsContract.getAllEvents();
      const eventsWithIpfsContent = await Promise.all(
        allEvents.map(async (event) => {
          const eventContent = await fetchEventIpfsContent(event);
          return { ...event, ...eventContent }; //spread operator
        })
      );
      setEvents(eventsWithIpfsContent);
      setIsContractReady(true);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventCreated = async (eventId) => {
    try {
      if (!ticketsContract) {
        toast.error("Contract not found", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      // const eventCID = await ticketsContract.geteventCID(eventId);

      // const newEvent = await retrieveFromIPFS(eventCID);

      setEvents((prevEvents) => [...prevEvents, newEvent]);

      setSelectedEventIndex(prevEvents.length);

      setPopupOpen(true);
      document.body.classList.add("popup-open");
    } catch (error) {
      console.error("Error fetching and updating new event:", error);
    }
  };

  // // Function to format time to AM/PM format
  // const formatTime = (time) => {
  //   const formattedTime = new Date(`1970-01-01T${time}`);
  //   return formattedTime.toLocaleString("en-US", {
  //     hour: "numeric",
  //     minute: "numeric",
  //     hour12: true,
  //   });
  // };

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
                              {/* <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                              <a className="d-block blur-shadow-image">
                                <img
                                  src={ethtix}
                                  className="img-fluid shadow border-radius-lg"
                                />
                              </a>
                            </div> */}
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
                                    <i
                                      className="fas fa-arrow-right text-xs ms-1"
                                      aria-hidden="true"
                                    ></i>
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
                          document.querySelector(".topnav").style.background =
                            "transparent";
                        }}
                        ke={selectedEventIndex}
                        event={events[selectedEventIndex]}
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
