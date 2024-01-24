import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../assets/css/Main.css";
import ethtix from "../assets/images/abstract.png";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";
//Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faClock } from "@fortawesome/free-solid-svg-icons";

const AdminEvents = ({ state }) => {
  const { formatTime, events, fetchEvents, handleEventCreated, setEvents } =
    useAppContext();
  const { ticketsContract } = state;
  const [isLoading, setIsLoading] = useState(true);
  // const [events, setEvents] = useState([]);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  // const { ticketsContract } = state;
  const [EventDetail, setEventDetail] = useState(false);

  const handleSelectEvent = (index) => {
    setSelectedEventIndex(index);
    setEventDetail(true);
  };

  const handleGoBack = () => {
    setEventDetail(false);
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
      ) : EventDetail ? (
        <div className="row py-2">
          {/* Image Slider */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-lg mt-4">
              {/* <div
              id="eventImageCarousel"
              className="carousel slide"
              data-ride="carousel"
            > */}
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src={ethtix}
                    className="img-fluid"
                    alt="Event"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                  />
                </div>
                {/* Add more carousel items if you have multiple images */}
              </div>
              {/* </div> */}
            </div>
          </div>

          {/* Event Details */}
          <div className="col-lg-6" style={{ textAlign: "justify" }}>
            <p>
              Event Name:{" "}
              <span style={{ color: "#008eb0" }}>
                {events[selectedEventIndex].eventName.toString()}
              </span>
            </p>
            <p>Creator: {events[selectedEventIndex].creator}</p>
            <p>
              Price:{" "}
              {ethers.utils
                .formatEther(events[selectedEventIndex].price)
                .toString()}{" "}
              ETH
            </p>
            <p>Location: {events[selectedEventIndex].location.toString()}</p>
            <p>
              Date:{" "}
              {events[selectedEventIndex].date +
                ", " +
                formatTime(events[selectedEventIndex].time)}
            </p>
            <p>Date of Creation: {events[selectedEventIndex].date}</p>
            <p>
              Total Tickets:{" "}
              {events[selectedEventIndex].totalTickets.toNumber()}
            </p>
            <p>
              Ticket Sold out:{" "}
              {events[selectedEventIndex].totalTickets.toNumber() -
                events[selectedEventIndex].remTickets.toNumber()}
            </p>
            <p>
              Remaining Tickets:{" "}
              {events[selectedEventIndex].remTickets.toNumber()}
            </p>
            <p>
              Revenue:{" "}
              {ethers.utils
                .formatEther(
                  events[selectedEventIndex].price *
                    (events[selectedEventIndex].totalTickets.toNumber() -
                      events[selectedEventIndex].remTickets.toNumber())
                )
                .toString()}{" "}
              ETH
            </p>
            <p>
              Total fund received during event creation:{" "}
              {events[selectedEventIndex].date}
            </p>
            <div className="buttons" style={{ padding: "0px" }}>
              <button
                className="main-button color-white"
                onClick={handleGoBack}
              >
                Go Back
              </button>
              <button
                className="main-button color-white"
                onClick={handleGoBack}
              >
                View Event Analytics
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="event-blocks">
            {events.length === 0 ? (
              <p>Events not available....</p>
            ) : (
              <div className="row">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="col-12 mb-4 card"
                    style={{ padding: "0px" }}
                  >
                    <div
                      className="insection card-body"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      onClick={() => handleSelectEvent(index)}
                    >
                      <div>
                        <h4 style={{ margin: "0px" }}>
                          {event.eventName.toString()}{" "}
                        </h4>
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon
                            icon={faClock}
                            className="mr-2"
                            style={{ fontSize: "70%" }}
                          />
                          &nbsp;
                          <p
                            className="text-muted mb-0"
                            style={{ fontSize: "70%" }}
                          >
                            {formatTime(event.creationTime)}
                          </p>
                        </div>
                      </div>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        onClick={() => handleSelectEvent(index)}
                        style={{ alignSelf: "center" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminEvents;
