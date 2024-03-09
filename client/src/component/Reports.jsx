import React, { useState, useEffect } from "react";
import "../assets/css/Main.css";
import { ethers } from "ethers";
import ethtix from "../assets/images/abstract.png";
// import { retrieveFromIPFS, uploadReportToIPFS } from "../utils/ipfsUtils";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";
//Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faClock } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify"; // Import toastify for displaying notifications
import search from "../assets/images/search symbol.png";

const Reports = ({ state }) => {
  const {
    formatTime,
    reports,
    setReports,
    fetchReports,
    // retrieveAllTransactionsFromLocalStorage,
    // getTransactionDetails,
    // viewTransactionOnEtherscan,
    isEventOrganizer,
    account,
    isAdmin,
  } = useAppContext();
  const { ticketsContract } = state;
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReportIndex, setSelectedReportIndex] = useState(null);
  const [ReportDetail, setReportDetail] = useState(false);
  const [isSearch, setSearch] = useState(false); // Implement search
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [organizerreports, setOrganizerReports] = useState([]);

  const handleSelectReport = (index) => {
    setSelectedReportIndex(index);
    setReportDetail(true);
  };

  const handleFilteredReport = (index) => {
    setSelectedIndex(index);
    console.log(selectedIndex);

    const selectedFilteredReport = filteredReports[selectedIndex];
    const selectedReportIndex = reports.findIndex(
      (report) => report.ipfsCid === selectedFilteredReport.ipfsCid
    );

    if (selectedReportIndex !== -1) {
      setSelectedReportIndex(selectedReportIndex);
      setReportDetail(true);
    } else {
      console.error("Report not found in the original reports array");
    }
  };

  const handleGoBack = () => {
    setReportDetail(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchButton();
    }
  };

  const handleSearchButton = () => {
    setSearch(true);
    if (isAdmin) {
      const filterReports = reports.filter((report) =>
        report.reportName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredReports(filterReports);
    } else {
      const filterReports = organizerreports.filter((report) =>
        report.reportName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredReports(filterReports);
    }
  };

  // const handletransactionDetails = () => {
  //   const transactions = retrieveAllTransactionsFromLocalStorage();
  //   // console.log("transaction hash", transactions[selectedReportIndex]);
  //   // const transactionDetails = getTransactionDetails(
  //   //   transactions[selectedReportIndex]
  //   // );
  //   // console.log("transaction details", transactionDetails);
  //   const transactionPromise = viewTransactionOnEtherscan(
  //     transactions[selectedReportIndex]
  //   );

  //   transactionPromise.then((transactionUrl) => {
  //     // console.log("transaction url", transactionUrl);
  //     window.open(transactionUrl, "_self"); // Open the transaction url in a same page if written as "_self" and in a new tab if written as "_blank"
  //   });
  // };

  useEffect(() => {
    try {
      const initialize = async () => {
        if (ticketsContract) {
          // Fetch initial reports using the fetchReports function
          const initialReports = await fetchReports();
          console.log("Initial Reports:", initialReports);
          setReports(initialReports);

          if (isEventOrganizer) {
            // Initialize organizer reports array
            const organizerReports = [];

            // Loop through the events and check if the creator matches the current account
            await initialReports.forEach((report) => {
              if (report.eventType === "EventCreated") {
                if (report.reportDetails.creator.toLowerCase() === account) {
                  organizerReports.push(report);
                }
              } else if (report.eventType === "OrganizerRegistered") {
                if (
                  report.reportDetails.organizerAddress.toLowerCase() ===
                  account
                ) {
                  organizerReports.push(report);
                }
              } else {
                // Verify if the report type is "Ticket Purchased" and if the creator of the event, for which the ticket was purchased, matches the current account.
                for (let i = 0; i < report.details.length; i++) {
                  // console.log("Creator:", report.details[i].detail[0].creator);
                  if (
                    report.details[i].detail[0].creator.toLowerCase() ===
                    account
                  ) {
                    organizerReports.push(report);
                  }
                }
              }
            });

            setOrganizerReports(organizerReports);
          }
          setIsLoading(false); // Set loading to false once reports are fetched
        } else {
          console.error("Contract is not deployed!");
          toast.warning("Contract is not deployed!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          const newToastMessage = {
            notificationName: "Contract is not deployed!",
          };

          createNotification(newToastMessage);
        }
      };

      initialize();
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
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
      ) : ReportDetail ? (
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

          {/* Report Details */}
          <div className="col-lg-6" style={{ textAlign: "justify" }}>
            <p>
              Event Type:{" "}
              <span style={{ color: "#008eb0" }}>
                {isAdmin
                  ? reports[selectedReportIndex].eventType
                  : organizerreports[selectedReportIndex].eventType}
              </span>
            </p>
            <p>
              Report Name:{" "}
              {isAdmin
                ? reports[selectedReportIndex].reportName
                : organizerreports[selectedReportIndex].reportName}
            </p>
            {/* date and time to know when was the event being subscribed. */}
            {(isAdmin &&
              reports[selectedReportIndex].eventType === "EventCreated") ||
            (isAdmin &&
              reports[selectedReportIndex].eventType ===
                "OrganizerRegistered") ? (
              <p>
                Created Time:{" "}
                {new Date(
                  reports[selectedReportIndex].reportDetails.currentTime
                ).toLocaleString()}
              </p>
            ) : (isEventOrganizer &&
                organizerreports[selectedReportIndex].eventType ===
                  "EventCreated") ||
              (isEventOrganizer &&
                organizerreports[selectedReportIndex].eventType ===
                  "OrganizerRegistered") ? (
              <p>
                Created Time:{" "}
                {new Date(
                  organizerreports[
                    selectedReportIndex
                  ].reportDetails.currentTime
                ).toLocaleString()}
              </p>
            ) : null}
            {/* {reports[selectedReportIndex].eventType === "TicketPurchased" ||
            reports[selectedReportIndex].eventType === "EventCreated" ? (
              <p>
                Event ID:{" "}
                {parseInt(reports[selectedReportIndex].reportDetails.eventId)}
              </p>
            ) : null} */}
            {(isAdmin &&
              reports[selectedReportIndex].eventType === "EventCreated") ||
            (isEventOrganizer &&
              organizerreports[selectedReportIndex].eventType ===
                "EventCreated") ? (
              <>
                <p>
                  Creater:{" "}
                  {isAdmin
                    ? reports[selectedReportIndex].reportDetails.creator
                    : organizerreports[selectedReportIndex].reportDetails
                        .creator}
                </p>
                <p>
                  Event Name:{" "}
                  {isAdmin
                    ? reports[
                        selectedReportIndex
                      ].reportDetails.eventName.toString()
                    : organizerreports[
                        selectedReportIndex
                      ].reportDetails.eventName.toString()}
                </p>
                <p>
                  Event Date:{" "}
                  {isAdmin
                    ? reports[selectedReportIndex].reportDetails.date +
                      ", " +
                      formatTime(
                        reports[selectedReportIndex].reportDetails.time
                      )
                    : organizerreports[selectedReportIndex].reportDetails.date +
                      ", " +
                      formatTime(
                        organizerreports[selectedReportIndex].reportDetails.time
                      )}
                </p>
                <p>
                  Location:{" "}
                  {isAdmin
                    ? reports[
                        selectedReportIndex
                      ].reportDetails.location.toString()
                    : organizerreports[
                        selectedReportIndex
                      ].reportDetails.location.toString()}
                </p>
                <p>
                  Description:{" "}
                  {isAdmin
                    ? reports[
                        selectedReportIndex
                      ].reportDetails.description.toString()
                    : organizerreports[
                        selectedReportIndex
                      ].reportDetails.description.toString()}
                </p>
              </>
            ) : null}
            {(isAdmin &&
              reports[selectedReportIndex].eventType === "TicketPurchased") ||
            (isEventOrganizer &&
              organizerreports[selectedReportIndex].eventType ===
                "TicketPurchased") ? (
              <>
                <p>
                  Created Time:{" "}
                  {isAdmin
                    ? reports[selectedReportIndex].reportDetails[0].purchaseTime
                    : organizerreports[selectedReportIndex].reportDetails[0]
                        .purchaseTime}
                </p>
                <p>
                  Event Name:{" "}
                  {isAdmin
                    ? reports[selectedReportIndex].details[0].detail.eventName
                    : organizerreports[selectedReportIndex].details[0].detail[0]
                        .eventName}
                </p>
                <p>
                  Ticket Bought:{" "}
                  {isAdmin
                    ? reports[selectedReportIndex].reportDetails[0].ticketsOwned
                    : organizerreports[selectedReportIndex].reportDetails[0]
                        .ticketsOwned}
                </p>
                <p>
                  {" "}
                  Buyer:{" "}
                  {isAdmin
                    ? reports[selectedReportIndex].ticketHolder
                    : organizerreports[selectedReportIndex].ticketHolder}
                </p>
                {/* <p> Buyer: {isAdmin? reports[selectedReportIndex].reportDetails[0].userAddress : organizerreports[selectedReportIndex].reportDetails[0].userAddress}</p> */}
                <p>
                  Price Paid: &nbsp;{" "}
                  {isAdmin
                    ? ethers.utils.formatEther(
                        reports[selectedReportIndex].reportDetails[0].price
                      )
                    : ethers.utils.formatEther(
                        organizerreports[selectedReportIndex].reportDetails[0]
                          .price
                      )}
                  &nbsp;ETH
                </p>
              </>
            ) : null}
            {(isAdmin &&
              reports[selectedReportIndex].eventType ===
                "OrganizerRegistered") ||
            (isEventOrganizer &&
              organizerreports[selectedReportIndex].eventType ===
                "OrganizerRegistered") ? (
              <>
                <p>
                  Organizer Address:{" "}
                  {isAdmin
                    ? reports[selectedReportIndex].reportDetails
                        .organizerAddress
                    : organizerreports[selectedReportIndex].reportDetails
                        .organizerAddress}
                </p>
                <p>
                  Organizer Name:{" "}
                  {isAdmin
                    ? reports[selectedReportIndex].reportDetails.name.toString()
                    : organizerreports[
                        selectedReportIndex
                      ].reportDetails.name.toString()}
                </p>
                <p>
                  Organization Name:{" "}
                  {isAdmin
                    ? reports[
                        selectedReportIndex
                      ].reportDetails.organizationName.toString()
                    : organizerreports[
                        selectedReportIndex
                      ].reportDetails.organizationName.toString()}
                </p>
                <p>
                  Organization Type:{" "}
                  {isAdmin
                    ? reports[
                        selectedReportIndex
                      ].reportDetails.organizationType.toString()
                    : organizerreports[
                        selectedReportIndex
                      ].reportDetails.organizationType.toString()}
                </p>
                <p>
                  Organization Location:{" "}
                  {isAdmin
                    ? reports[
                        selectedReportIndex
                      ].reportDetails.organizationLocation.toString()
                    : organizerreports[
                        selectedReportIndex
                      ].reportDetails.organizationLocation.toString()}
                </p>
                <p>
                  Organization Email:{" "}
                  {isAdmin
                    ? reports[
                        selectedReportIndex
                      ].reportDetails.organizationEmail.toString()
                    : organizerreports[
                        selectedReportIndex
                      ].reportDetails.organizationEmail.toString()}
                </p>
              </>
            ) : null}
            <div className="buttons" style={{ padding: "0px" }}>
              <button
                className="main-button color-white"
                onClick={handleGoBack}
              >
                Go Back
              </button>
              {/* <button
                className="main-button color-white"
                onClick={handletransactionDetails}
              >
                View transaction details
              </button> */}
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
                <p className="mb-0">{`Searched Reports for: ${searchQuery}`}</p>
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
                placeholder="Search Reports"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="search-button" onClick={handleSearchButton}>
                <img src={search} alt="Search" title="Search" />
              </button>
            </div>
          </div>
          {isSearch ? (
            <>
              <div className="event-blocks">
                {filteredReports.length === 0 ? (
                  <p>Searched Reports not available....</p>
                ) : (
                  <div className="row">
                    {filteredReports.map((report, index) => (
                      <div
                        key={index}
                        className="col-12 mb-4 card"
                        style={{ padding: "0px" }}
                      >
                        <div
                          className="insection card-body d-flex justify-content-between align-items-center"
                          onClick={() => handleFilteredReport(index)}
                          style={{ padding: "10px" }}
                        >
                          <div>
                            <h4 style={{ margin: "0px" }}>
                              {report.reportName}
                            </h4>
                            <div className="d-flex align-items-center">
                              <FontAwesomeIcon
                                icon={faClock}
                                className="mr-2"
                                style={{ fontSize: "70%" }}
                              />
                              &nbsp;
                              {report.eventType === "TicketPurchased" ? (
                                <p
                                  className="text-muted mb-0"
                                  style={{ fontSize: "70%" }}
                                >
                                  {report.reportDetails[0].purchaseTime}
                                </p>
                              ) : (
                                <p
                                  className="text-muted mb-0"
                                  style={{ fontSize: "70%" }}
                                >
                                  {new Date(
                                    report.reportDetails.currentTime
                                  ).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            onClick={() => handleFilteredReport(index)}
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
              {isAdmin ? (
                reports.length === 0 ? (
                  <p>No any reports found..</p>
                ) : (
                  <div className="row">
                    {reports.map((report, index) => (
                      <div
                        key={index}
                        className="col-12 mb-4 card"
                        style={{ padding: "0px" }}
                      >
                        <div
                          className="insection card-body d-flex justify-content-between align-items-center"
                          onClick={() => handleSelectReport(index)}
                          style={{ padding: "10px" }}
                        >
                          <div>
                            <h4 style={{ margin: "0px" }}>
                              {report.reportName}
                            </h4>
                            <div className="d-flex align-items-center">
                              <FontAwesomeIcon
                                icon={faClock}
                                className="mr-2"
                                style={{ fontSize: "70%" }}
                              />
                              &nbsp;
                              {report.eventType === "TicketPurchased" ? (
                                <p
                                  className="text-muted mb-0"
                                  style={{ fontSize: "70%" }}
                                >
                                  {report.reportDetails[0].purchaseTime}
                                </p>
                              ) : (
                                <p
                                  className="text-muted mb-0"
                                  style={{ fontSize: "70%" }}
                                >
                                  {new Date(
                                    report.reportDetails.currentTime
                                  ).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            onClick={() => handleSelectReport(index)}
                            style={{ alignSelf: "center" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : organizerreports.length === 0 ? (
                <p>No any reports found..</p>
              ) : (
                <div className="row">
                  {organizerreports.map((report, index) => (
                    <div
                      key={index}
                      className="col-12 mb-4 card"
                      style={{ padding: "0px" }}
                    >
                      <div
                        className="insection card-body d-flex justify-content-between align-items-center"
                        onClick={() => handleSelectReport(index)}
                        style={{ padding: "10px" }}
                      >
                        <div>
                          <h4 style={{ margin: "0px" }}>{report.reportName}</h4>
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="mr-2"
                              style={{ fontSize: "70%" }}
                            />
                            &nbsp;
                            {report.eventType === "TicketPurchased" ? (
                              <p
                                className="text-muted mb-0"
                                style={{ fontSize: "70%" }}
                              >
                                {report.reportDetails[0].purchaseTime}
                              </p>
                            ) : (
                              <p
                                className="text-muted mb-0"
                                style={{ fontSize: "70%" }}
                              >
                                {new Date(
                                  report.reportDetails.currentTime
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          onClick={() => handleSelectReport(index)}
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

export default Reports;
