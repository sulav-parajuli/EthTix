import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";
import { Chart } from "chart.js/auto";
//Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTicket } from "@fortawesome/free-solid-svg-icons";

const Dashboard = ({ state }) => {
  const { ticketsContract } = state;
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const [eventCreated, setEventCreated] = useState(0);
  const [organizerRegistered, setOrganizerRegistered] = useState(0);
  const [ticketSold, setTicketSold] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [pendingTickets, setPendingTickets] = useState(0);
  const { events, setEvents, fetchEvents, isAdmin, formatTime } =
    useAppContext();

  const getOrganizers = async () => {
    if (!ticketsContract) {
      return;
    }
    const organizer = await ticketsContract.getAllOrganizers();
    // console.log(organizer);
    setOrganizerRegistered(organizer.length); // Update organizerRegistered with the length of organizer
  };

  useEffect(() => {
    try {
      if (isAdmin) {
        getOrganizers();
      }
      // Fetch initial events
      fetchEvents().then((initialEvents) => {
        setEvents(initialEvents);
        setEventCreated(initialEvents.length); // Update eventCreated with the length of initialEvents

        // Calculate ticketSold, pendingTickets and totalTickets
        let rem = 0;
        let total = 0;
        initialEvents.forEach((event) => {
          rem += event.remTickets.toNumber();
          total += event.totalTickets.toNumber();
        });
        setTicketSold(total - rem);
        setPendingTickets(rem);
        setTotalTickets(total);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [ticketsContract]);

  useEffect(() => {
    // Ensure that the chartRef.current is available before attempting to getContext
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Ticket Sales",
              data: [12, 19, 3, 5, 2, 3],
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "linear",
              position: "bottom",
            },
            y: {
              min: 0,
            },
          },
        },
      });
    }
  }, [chartRef]);

  return (
    <>
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
            height: "100vh",
          }}
          wrapperClass=""
        />
      ) : (
        <>
          {/* Statistics Row */}
          <div className="row">
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{eventCreated}</h5>
                  <p className="card-text">Events Created</p>
                </div>
              </div>
            </div>
            {isAdmin ? (
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{organizerRegistered}</h5>
                    <p className="card-text">Organizer Registered</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{pendingTickets}</h5>
                    <p className="card-text">Pending Tickets</p>
                  </div>
                </div>
              </div>
            )}
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{ticketSold}</h5>
                  <p className="card-text">Ticket Sold</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{totalTickets}</h5>
                  <p className="card-text">Total Tickets</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="row mt-4">
            <div className="col-md-8">
              {/* Placeholder for Analytics Carousel */}
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Analytics</h5>
                  <canvas
                    id="ticketSalesChart"
                    width="400"
                    height="200"
                    ref={chartRef}
                  ></canvas>
                  {/* Add your carousel component here */}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              {/* Placeholder for Events List */}
              <h5 className="card-title">Events List</h5>
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
                        >
                          <div>
                            <h4 style={{ margin: "0px" }}>
                              {event.eventName.toString()}{" "}
                            </h4>
                            <div className="d-flex align-items-center">
                              <>
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
                              </>
                              <div style={{ marginRight: "20px" }}></div>
                              <>
                                <FontAwesomeIcon
                                  icon={faTicket}
                                  className="mr-2"
                                  style={{
                                    fontSize: "70%",
                                    marginLeft: "30px",
                                  }}
                                />
                                &nbsp;
                                <p
                                  className="text-muted mb-0"
                                  style={{
                                    fontSize: "70%",
                                    // marginLeft: "20px",
                                  }}
                                >
                                  {" "}
                                  Ticket Sold:{" "}
                                  {event.totalTickets.toNumber() -
                                    event.remTickets.toNumber()}
                                </p>
                              </>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Add your events list component here */}
            </div>
          </div>

          {/* Currency Converter Section */}
          <div className="row mt-4">
            <div className="col-md-6">
              {/* Placeholder for Currency Converter */}
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Currency Converter</h5>
                  {/* Add your currency converter component here */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
