import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../assets/css/Main.css";
import ethtix from "../assets/images/abstract.png";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";
//Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faClock } from "@fortawesome/free-solid-svg-icons";
import search from "../assets/images/search symbol.png";

const AdminEvents = ({ state }) => {
  const {
    formatTime,
    events,
    fetchEvents,
    handleEventCreated,
    setEvents,
    isAdmin,
  } = useAppContext();
  const { ticketsContract } = state;
  const [isLoading, setIsLoading] = useState(true);
  const [isSearch, setSearch] = useState(false); // Implement search
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [selectedFilteredEventIndex, setSelectedFilteredEventIndex] =
    useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [EventDetail, setEventDetail] = useState(false);

  const handleSelectEvent = (index) => {
    setSelectedEventIndex(index);
    setEventDetail(true);
  };

  const handleFilteredEvent = (index) => {
    setSelectedFilteredEventIndex(index);
    setEventDetail(true);
  };

  const handleGoBack = () => {
    setEventDetail(false);
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
                {isSearch
                  ? filteredEvents[
                      selectedFilteredEventIndex
                    ].eventName.toString()
                  : events[selectedEventIndex].eventName.toString()}
              </span>
            </p>
            <p>
              Creator:{" "}
              {isSearch
                ? filteredEvents[selectedFilteredEventIndex].creator
                : events[selectedEventIndex].creator}
            </p>
            <p>
              Price:{" "}
              {isSearch
                ? ethers.utils
                    .formatEther(
                      filteredEvents[selectedFilteredEventIndex].price
                    )
                    .toString()
                : ethers.utils
                    .formatEther(events[selectedEventIndex].price)
                    .toString()}{" "}
              ETH
            </p>
            <p>
              Location:{" "}
              {isSearch
                ? filteredEvents[selectedFilteredEventIndex].location.toString()
                : events[selectedEventIndex].location.toString()}
            </p>
            <p>
              Event Date:{" "}
              {isSearch
                ? filteredEvents[selectedFilteredEventIndex].date +
                  ", " +
                  formatTime(filteredEvents[selectedFilteredEventIndex].time)
                : events[selectedEventIndex].date +
                  ", " +
                  formatTime(events[selectedEventIndex].time)}
            </p>
            <p>
              Description:{" "}
              {isSearch
                ? filteredEvents[
                    selectedFilteredEventIndex
                  ].description.toString()
                : events[selectedEventIndex].description.toString()}
            </p>
            <p>
              Total Tickets:{" "}
              {isSearch
                ? filteredEvents[
                    selectedFilteredEventIndex
                  ].totalTickets.toNumber()
                : events[selectedEventIndex].totalTickets.toNumber()}
            </p>
            <p>
              Ticket Sold out:{" "}
              {isSearch
                ? filteredEvents[
                    selectedFilteredEventIndex
                  ].totalTickets.toNumber() -
                  filteredEvents[
                    selectedFilteredEventIndex
                  ].remTickets.toNumber()
                : events[selectedEventIndex].totalTickets.toNumber() -
                  events[selectedEventIndex].remTickets.toNumber()}
            </p>
            <p>
              Remaining Tickets:{" "}
              {isSearch
                ? filteredEvents[
                    selectedFilteredEventIndex
                  ].remTickets.toNumber()
                : events[selectedEventIndex].remTickets.toNumber()}
            </p>
            <p>
              Revenue:{" "}
              {isSearch
                ? ethers.utils
                    .formatEther(
                      filteredEvents[selectedFilteredEventIndex].price.mul(
                        filteredEvents[
                          selectedFilteredEventIndex
                        ].totalTickets.toNumber() -
                          filteredEvents[
                            selectedFilteredEventIndex
                          ].remTickets.toNumber()
                      )
                    )
                    .toString()
                : ethers.utils
                    .formatEther(
                      events[selectedEventIndex].price.mul(
                        events[selectedEventIndex].totalTickets.toNumber() -
                          events[selectedEventIndex].remTickets.toNumber()
                      )
                    )
                    .toString()}{" "}
              ETH
            </p>
            {isAdmin ? (
              <p>
                Total fund received during event creation:{" "}
                {isSearch
                  ? filteredEvents[selectedFilteredEventIndex].date
                  : events[selectedEventIndex].date}
              </p>
            ) : null}
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
          <div>
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
            <div className="adminsearchcontainer">
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
          {isSearch ? (
            <>
              <div className="event-blocks">
                {filteredEvents.length === 0 ? (
                  <p>Searched Events not available....</p>
                ) : (
                  <div className="row">
                    {filteredEvents.map((event, index) => (
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
                          onClick={() => handleFilteredEvent(index)}
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
                                {" "}
                                {event.date + ", " + formatTime(event.time)}
                              </p>
                            </div>
                          </div>
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            onClick={() => handleFilteredEvent(index)}
                            style={{ alignSelf: "center" }}
                          />
                        </div>
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
                              {" "}
                              {event.date + ", " + formatTime(event.time)}
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
          )}
        </>
      )}
    </div>
  );
};

export default AdminEvents;
