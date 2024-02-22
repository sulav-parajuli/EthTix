import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";

//Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTicket } from "@fortawesome/free-solid-svg-icons";

const Dashboard = ({ state }) => {
  const { ticketsContract } = state;
  const [isLoading, setIsLoading] = useState(true);
  const [eventCreated, setEventCreated] = useState(0);
  const [organizerRegistered, setOrganizerRegistered] = useState(0);
  const [ticketSold, setTicketSold] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [currencyFrom, setCurrencyFrom] = useState("");
  const [currencyTo, setCurrencyTo] = useState("");
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

  //Currency Converter
  const handleConversion = () => {
    // Ensure required values are set
    if (!currencyFrom || !currencyTo) {
      document.querySelector(
        ".finalValue"
      ).textContent = `Please select both currency fields "From" and "To"`;
    } else {
      const apiKey = "CBJWw1G1zzeKtZXrzjb01HdvVwFNJCak";
      const apiUrl = `https://api.apilayer.com/fixer/latest?symbols=${currencyTo}&base=${currencyFrom}&apikey=${apiKey}`; //fixer api
      // const apiUrl =`https://free.currconv.com/api/v7/convert?q=${currencyFrom}_${currencyTo}&compact=ultra&apiKey=fca_live_HbIzxvWGgIYwNZXtP7Z0pdCoMVBlJDqSs2QVqm7N`
      // const apiUrl = `https://api.exchangerate-api.com/v4/latest/${currencyFrom}`

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const convertedValue = data.rates[currencyTo];
            const inputValue = parseFloat(
              document.getElementById("fromAmount").value
            );
            const finalValue = (inputValue * convertedValue).toFixed(2);
            setFinalValue(finalValue);
          } else {
            console.error("Error in fetching data from Fixer API");
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const setFinalValue = (value) => {
    const finalValueElement = document.querySelector(".finalValue");
    if (finalValueElement) {
      finalValueElement.textContent = `Converted Currency: ${value} ${currencyTo}`;
    }
  };
  // When user click on reset button
  // function clearVal() {
  // 	window.location.reload();
  // 	document.getElementsByClassName("finalValue").innerHTML = "";
  // };

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
          wrapperClassNclassName=""
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

          {/* Converter Section */}
          <div className="row mt-4">
            <div className="col-md-8">
              {/* Placeholder for Price Converter */}
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Currency Converter</h5>
                  {/* <div className="form-row align-items-center"> */}
                  <div className="col-auto">
                    <input
                      type="number"
                      className="form-control mb-2"
                      id="fromAmount"
                      placeholder="Enter amount to convert"
                    />
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text">From</span>
                        </div>
                        <select
                          className="form-control from"
                          id="sel1"
                          onChange={(e) => setCurrencyFrom(e.target.value)}
                        >
                          <option value="">Select One</option>
                          <option value="USD">USD</option>
                          <option value="AED">AED</option>
                          <option value="AFN">AFN</option>
                          <option value="ARS">ARS</option>
                          <option value="AUD">AUD</option>
                          <option value="BGN">BGN</option>
                          <option value="BRL">BRL</option>
                          <option value="BSD">BSD</option>
                          <option value="CAD">CAD</option>
                          <option value="CHF">CHF</option>
                          <option value="CLP">CLP</option>
                          <option value="CNY">CNY</option>
                          <option value="COP">COP</option>
                          <option value="CZK">CZK</option>
                          <option value="DKK">DKK</option>
                          <option value="DOP">DOP</option>
                          <option value="EGP">EGP</option>
                          <option value="EUR">ETH</option>
                          <option value="EUR">EUR</option>
                          <option value="FJD">FJD</option>
                          <option value="GBP">GBP</option>
                          <option value="GTQ">GTQ</option>
                          <option value="HKD">HKD</option>
                          <option value="HRK">HRK</option>
                          <option value="HUF">HUF</option>
                          <option value="IDR">IDR</option>
                          <option value="ILS">ILS</option>
                          <option value="INR">INR</option>
                          <option value="ISK">ISK</option>
                          <option value="JPY">JPY</option>
                          <option value="KRW">KRW</option>
                          <option value="KZT">KZT</option>
                          <option value="MVR">MVR</option>
                          <option value="MXN">MXN</option>
                          <option value="MYR">MYR</option>
                          <option value="NOK">NOK</option>
                          <option value="NPR">NPR</option>
                          <option value="NZD">NZD</option>
                          <option value="PAB">PAB</option>
                          <option value="PEN">PEN</option>
                          <option value="PHP">PHP</option>
                          <option value="PKR">PKR</option>
                          <option value="PLN">PLN</option>
                          <option value="PYG">PYG</option>
                          <option value="RON">RON</option>
                          <option value="RUB">RUB</option>
                          <option value="SAR">SAR</option>
                          <option value="SEK">SEK</option>
                          <option value="SGD">SGD</option>
                          <option value="THB">THB</option>
                          <option value="TRY">TRY</option>
                          <option value="TWD">TWD</option>
                          <option value="UAH">UAH</option>
                          <option value="UYU">UYU</option>
                          <option value="ZAR">ZAR</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text">To</span>
                        </div>
                        <select
                          className="form-control to"
                          id="sel2"
                          onChange={(e) => setCurrencyTo(e.target.value)}
                        >
                          <option value="">Select One</option>
                          <option value="USD">USD</option>
                          <option value="AED">AED</option>
                          <option value="AFN">AFN</option>
                          <option value="ARS">ARS</option>
                          <option value="AUD">AUD</option>
                          <option value="BGN">BGN</option>
                          <option value="BRL">BRL</option>
                          <option value="BSD">BSD</option>
                          <option value="CAD">CAD</option>
                          <option value="CHF">CHF</option>
                          <option value="CLP">CLP</option>
                          <option value="CNY">CNY</option>
                          <option value="COP">COP</option>
                          <option value="CZK">CZK</option>
                          <option value="DKK">DKK</option>
                          <option value="DOP">DOP</option>
                          <option value="EGP">EGP</option>
                          <option value="EUR">ETH</option>
                          <option value="EUR">EUR</option>
                          <option value="FJD">FJD</option>
                          <option value="GBP">GBP</option>
                          <option value="GTQ">GTQ</option>
                          <option value="HKD">HKD</option>
                          <option value="HRK">HRK</option>
                          <option value="HUF">HUF</option>
                          <option value="IDR">IDR</option>
                          <option value="ILS">ILS</option>
                          <option value="INR">INR</option>
                          <option value="ISK">ISK</option>
                          <option value="JPY">JPY</option>
                          <option value="KRW">KRW</option>
                          <option value="KZT">KZT</option>
                          <option value="MVR">MVR</option>
                          <option value="MXN">MXN</option>
                          <option value="MYR">MYR</option>
                          <option value="NOK">NOK</option>
                          <option value="NPR">NPR</option>
                          <option value="NZD">NZD</option>
                          <option value="PAB">PAB</option>
                          <option value="PEN">PEN</option>
                          <option value="PHP">PHP</option>
                          <option value="PKR">PKR</option>
                          <option value="PLN">PLN</option>
                          <option value="PYG">PYG</option>
                          <option value="RON">RON</option>
                          <option value="RUB">RUB</option>
                          <option value="SAR">SAR</option>
                          <option value="SEK">SEK</option>
                          <option value="SGD">SGD</option>
                          <option value="THB">THB</option>
                          <option value="TRY">TRY</option>
                          <option value="TWD">TWD</option>
                          <option value="UAH">UAH</option>
                          <option value="UYU">UYU</option>
                          <option value="ZAR">ZAR</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <button className="main-button" onClick={handleConversion}>
                      Convert
                    </button>
                  </div>
                  {/* </div> */}
                  <p className="finalValue"> </p>
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
        </>
      )}
    </>
  );
};

export default Dashboard;
