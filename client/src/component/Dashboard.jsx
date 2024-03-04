import React, { useState, useEffect } from "react";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";

//Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faTicket,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import line from "../assets/images/line.png";
import pendingticket from "../assets/images/pendingticket.png";
import ticketsold from "../assets/images/ticketsold.png";

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
  // Define state variables for date and time
  const [currentTime, setCurrentTime] = useState(new Date());
  const {
    events,
    setEvents,
    fetchEvents,
    isAdmin,
    formatTime,
    account,
    convertUnixTimestampToDateTime,
  } = useAppContext();
  // Array of currency options
  const currencyOptions = [
    "ETH",
    "USD",
    "AED",
    "AFN",
    "ARS",
    "AUD",
    "BGN",
    "BRL",
    "BSD",
    "CAD",
    "CHF",
    "CLP",
    "CNY",
    "COP",
    "CZK",
    "DKK",
    "DOP",
    "EGP",
    "EUR",
    "FJD",
    "GBP",
    "GTQ",
    "HKD",
    "HRK",
    "HUF",
    "IDR",
    "ILS",
    "INR",
    "ISK",
    "JPY",
    "KRW",
    "KZT",
    "MVR",
    "MXN",
    "MYR",
    "NOK",
    "NPR",
    "NZD",
    "PAB",
    "PEN",
    "PHP",
    "PKR",
    "PLN",
    "PYG",
    "RON",
    "RUB",
    "SAR",
    "SEK",
    "SGD",
    "THB",
    "TRY",
    "TWD",
    "UAH",
    "UYU",
    "ZAR",
  ];

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
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      if (isAdmin) {
        getOrganizers();
      }
      // Fetch initial events
      fetchEvents().then((initialEvents) => {
        setEvents(initialEvents);

        // Calculate ticketSold, pendingTickets and totalTickets
        let rem = 0;
        let total = 0;
        let eventCreated = 0;
        initialEvents.forEach((event) => {
          if (isAdmin) {
            rem += event.remTickets.toNumber();
            total += event.totalTickets.toNumber();
            setEventCreated(initialEvents.length); // Update eventCreated with the length of initialEvents
          } else {
            if (event.creator.toLowerCase() === account) {
              rem += event.remTickets.toNumber();
              total += event.totalTickets.toNumber();
              eventCreated += 1;
              setEventCreated(eventCreated); // Update eventCreated with the length of events created by the account
            }
          }
        });
        setTicketSold(total - rem);
        setPendingTickets(rem);
        setTotalTickets(total);
      });

      // Clean up the timer on component unmount
      return () => clearInterval(timer);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [ticketsContract]);

  const handleUnixConversion = () => {
    const inputTime = document.getElementById("fromUnixTime").value;
    const actualTime = convertUnixTimestampToDateTime(inputTime);
    const finalValueTime = document.querySelector(".finalTime");
    if (finalValueTime) {
      if (actualTime) {
        finalValueTime.textContent = `Converted Date and Time: ${actualTime}`;
      } else {
        finalValueTime.textContent = `Invalid Unix Timestamp. Please enter a valid Unix Timestamp.`;
      }
    }
  };

  //Currency Converter
  const handleNormalConversion = (currFrom, currTo, inputValue) => {
    const apiKey = "CBJWw1G1zzeKtZXrzjb01HdvVwFNJCak";
    const apiUrl = `https://api.apilayer.com/fixer/latest?symbols=${currTo}&base=${currFrom}&apikey=${apiKey}`; //fixer api
    // const apiUrl =`https://free.currconv.com/api/v7/convert?q=${currFrom}_${currTo}&compact=ultra&apiKey=fca_live_HbIzxvWGgIYwNZXtP7Z0pdCoMVBlJDqSs2QVqm7N`
    // const apiUrl = `https://api.exchangerate-api.com/v4/latest/${currFrom}`; //exchangerate-api

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const convertedValue = data.rates[currTo];
          const finalValue = (inputValue * convertedValue).toFixed(2);
          setFinalValue(finalValue);
        } else {
          console.error("Error in fetching data from Fixer API");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleConversion = () => {
    // Ensure required values are set
    if (!currencyFrom || !currencyTo) {
      document.querySelector(
        ".finalValue"
      ).textContent = `Please select both currency fields "From" and "To"`;
      return;
    }

    const inputValue = parseFloat(document.getElementById("fromAmount").value);

    // Check if either currencyFrom or currencyTo is "ETH"
    if (currencyFrom === "ETH" || currencyTo === "ETH") {
      // Fetch conversion rate between USD and ETH from CoinCap API
      fetch("https://api.coincap.io/v2/rates/ethereum")
        .then((response) => response.json())
        .then((data) => {
          const ethToUsd = data.data.rateUsd;
          // If currencyFrom is "ETH", convert from ETH to USD
          const ethValue =
            currencyFrom === "ETH" ? inputValue : inputValue / ethToUsd;
          // If currencyTo is "ETH", convert from USD to ETH
          const finalValue =
            currencyTo === "ETH" ? ethValue : inputValue * ethToUsd;

          if (
            (currencyTo === "USD" && currencyFrom === "ETH") ||
            (currencyTo === "ETH" && currencyFrom === "ETH") ||
            (currencyTo === "ETH" && currencyFrom === "USD")
          ) {
            setFinalValue(finalValue.toFixed(6));
          } else {
            // Two cases: 1) currencyTo is "ETH" and currencyFrom is not "USD"  2) currencyTo is not "USD" and currencyFrom is "ETH"
            let currTo = currencyTo;
            let currFrom = currencyFrom;
            if (currencyTo === "ETH" && currencyFrom !== "USD") {
              currTo = "USD";
              currFrom = currencyFrom;
            } else {
              currTo = currencyTo;
              currFrom = "USD";
            }
            // Use the final ETH value to perform conversion with selected currency using Fixer API
            const apiKey = "CBJWw1G1zzeKtZXrzjb01HdvVwFNJCak";
            const apiUrl = `https://api.apilayer.com/fixer/latest?symbols=${currTo}&base=${currFrom}&apikey=${apiKey}`; //fixer api
            // const apiUrl =`https://free.currconv.com/api/v7/convert?q=${currFrom}_${currTo}&compact=ultra&apiKey=fca_live_HbIzxvWGgIYwNZXtP7Z0pdCoMVBlJDqSs2QVqm7N`
            // const apiUrl = `https://api.exchangerate-api.com/v4/latest/${currFrom}`; //exchangerate-api

            fetch(apiUrl)
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  const convertedValue = data.rates[currTo];
                  if (currencyTo === "ETH" && currencyFrom !== "USD") {
                    const finalValue =
                      (inputValue * convertedValue).toFixed(2) / ethToUsd;
                    setFinalValue(finalValue);
                  } else {
                    setFinalValue((convertedValue * finalValue).toFixed(2));
                  }
                } else {
                  console.error("Error in fetching data from Fixer API");
                }
              })
              .catch((error) => console.error("Error:", error));
          }
        })
        .catch((error) =>
          console.error("Error fetching ETH to USD conversion rate:", error)
        );
    } else {
      // If neither currencyFrom nor currencyTo is "ETH", use Fixer API directly
      handleNormalConversion(currencyFrom, currencyTo, inputValue);
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
          <div className="row statisticssection">
            <div className="col-md-3">
              <div className="card">
                <div className="card-body statisticscard">
                  <FontAwesomeIcon icon={faCalendarCheck} />
                  <img
                    src={line}
                    style={{ height: "1.5em", alignSelf: "center" }}
                  />
                  <div>
                    <h5 className="cardtitle">{eventCreated}</h5>
                    <p className="card-text">Events Created</p>
                  </div>
                </div>
              </div>
            </div>
            {isAdmin ? (
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body statisticscard">
                    <FontAwesomeIcon icon={faCalendarCheck} />
                    <img
                      src={line}
                      style={{ height: "1.5em", alignSelf: "center" }}
                    />
                    <div>
                      <h5 className="cardtitle">{organizerRegistered}</h5>
                      <p className="card-text">Organizer Registered</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body statisticscard">
                    <img
                      src={pendingticket}
                      style={{ height: "2em", alignSelf: "center" }}
                    />
                    <img
                      src={line}
                      style={{ height: "1.5em", alignSelf: "center" }}
                    />
                    <div>
                      <h5 className="cardtitle">{pendingTickets}</h5>
                      <p className="card-text">Pending Tickets</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="col-md-3">
              <div className="card">
                <div className="card-body statisticscard">
                  <img
                    src={ticketsold}
                    style={{ height: "2em", alignSelf: "center" }}
                  />
                  <img
                    src={line}
                    style={{ height: "1.5em", alignSelf: "center" }}
                  />
                  <div>
                    <h5 className="cardtitle">{ticketSold}</h5>
                    <p className="card-text">Tickets Sold</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body statisticscard">
                  <FontAwesomeIcon icon={faTicket} />
                  <img
                    src={line}
                    style={{ height: "1.5em", alignSelf: "center" }}
                  />
                  <div>
                    <h5 className="cardtitle">{totalTickets}</h5>
                    <p className="card-text">Total Tickets</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Converter Section */}
          <div className="row mt-4">
            <div className="col-md-8 mb-5">
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
                          {/* Map over currencyOptions array */}
                          {currencyOptions.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
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
                          {/* Map over currencyOptions array */}
                          {currencyOptions.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <button
                      className="main-button btn btn-primary btn-sm"
                      onClick={handleConversion}
                    >
                      Convert
                    </button>
                  </div>
                  {/* </div> */}
                  <p className="finalValue"> </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-5 dashboardevent">
              {/* Placeholder for Events List */}
              <h5>Events List</h5>
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
          {/* Date and time section */}
          <div className="row mt-4">
            {/* <div className="col-md-9 mb-5"> */}
            {/* Placeholder for Unix Date and Time Converter */}
            {/* <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Unix Date and Time Converter</h5>
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control mb-2"
                      id="fromUnixTime"
                      placeholder="Enter Unix Timestamp to convert"
                    /> */}
            {/* <div className="col-auto"> */}
            {/* <button
                      className="main-button btn btn-primary btn-sm"
                      onClick={handleUnixConversion}
                    >
                      Convert
                    </button> */}
            {/* </div> */}
            {/* </div> */}
            {/* <p className="finalTime"> </p>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="col-md-12">
              {/* Date and Time */}
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">Current Date and Time</h5>
                  <div className="justify-content-between">
                    <p className="text-muted mb-0">
                      Date: {currentTime.toLocaleDateString()}
                    </p>
                    <p className="text-muted mb-0">
                      Time: {currentTime.toLocaleTimeString()}
                    </p>
                  </div>
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
