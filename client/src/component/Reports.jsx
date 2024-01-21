import React, { useState, useEffect } from "react";
import "../assets/css/Main.css";
import ethtix from "../assets/images/abstract.png";
// import { retrieveFromIPFS, uploadReportToIPFS } from "../utils/ipfsUtils";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";
//Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify"; // Import toastify for displaying notifications

const Reports = ({ state }) => {
  const { formatTime, reports, setReports, fetchReports, createReports } =
    useAppContext();
  const { ticketsContract } = state;
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReportIndex, setSelectedReportIndex] = useState(null);
  const [ReportDetail, setReportDetail] = useState(false);

  const handleSelectReport = (index) => {
    setSelectedReportIndex(index);
    setReportDetail(true);
  };

  const handleGoBack = () => {
    setReportDetail(false);
  };

  useEffect(() => {
    try {
      const initialize = async () => {
        if (ticketsContract) {
          createReports();
          // Fetch initial reports using the fetchReports function
          const initialReports = await fetchReports();
          setReports(initialReports);
          setIsLoading(false); // Set loading to false once reports are fetched
        } else {
          console.error("Contract is not deployed!");
          toast.error("Contract is not deployed!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      };

      initialize();

      return () => {
        if (ticketsContract) {
          try {
            //unsubscribe when component unmounts.
            ticketsContract.removeAllListeners("OrganizerRegistered");
            ticketsContract.removeAllListeners("EventCreated");
            ticketsContract.removeAllListeners("TicketPurchased");
            // Remove other event listeners as needed...
          } catch (error) {
            console.error("Error unsubscribing from events:", error);
          }
        }
      };
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
                {reports[selectedReportIndex].eventType}
              </span>
            </p>
            <p>Report Name: {reports[selectedReportIndex].reportName}</p>
            {/* date and time to know when was the event being subscribed. */}
            <p>
              Date and Time: {/* {reports[selectedReportIndex].organizer} */}
            </p>
            {reports[selectedReportIndex].eventType === "TicketPurchased" ||
            reports[selectedReportIndex].eventType === "EventCreated" ? (
              <p>
                Event ID: {parseInt(reports[selectedReportIndex].eventId.hex)}
              </p>
            ) : null}
            {reports[selectedReportIndex].eventType === "EventCreated" ? (
              <>
                <p>Creater: {reports[selectedReportIndex].organizer}</p>
                <p>
                  Event Name:{" "}
                  {reports[selectedReportIndex].details.eventName.toString()}
                </p>
                <p>
                  Event Date:{" "}
                  {reports[selectedReportIndex].details.date +
                    ", " +
                    formatTime(reports[selectedReportIndex].details.time)}
                </p>
                <p>
                  Location:{" "}
                  {reports[selectedReportIndex].details.location.toString()}
                </p>
              </>
            ) : null}
            {reports[selectedReportIndex].eventType === "TicketPurchased" ? (
              <>
                <p>
                  Ticket Bought:{" "}
                  {parseInt(reports[selectedReportIndex].ticketsBought.hex)}
                </p>
                <p> Buyer: {reports[selectedReportIndex].buyer}</p>
              </>
            ) : null}
            {reports[selectedReportIndex].eventType ===
            "OrganizerRegistered" ? (
              <>
                <p>
                  Organizer Address:{" "}
                  {reports[selectedReportIndex].organizerAddress}
                </p>
                <p>
                  Organizer Name:{" "}
                  {reports[selectedReportIndex].details.name.toString()}
                </p>
                <p>
                  Organization Name:{" "}
                  {reports[
                    selectedReportIndex
                  ].details.organizationName.toString()}
                </p>
                <p>
                  Organization Type:{" "}
                  {reports[
                    selectedReportIndex
                  ].details.organizationType.toString()}
                </p>
                <p>
                  Organization Location:{" "}
                  {reports[
                    selectedReportIndex
                  ].details.organizationLocation.toString()}
                </p>
                <p>
                  Organization Email:{" "}
                  {reports[
                    selectedReportIndex
                  ].details.organizationEmail.toString()}
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
              <button
                className="main-button color-white"
                onClick={handleGoBack}
              >
                View transaction details
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="event-blocks">
            {reports.length === 0 ? (
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
                      className="card-body"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4 style={{ margin: "0px" }}>{report.reportName}</h4>
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
        </>
      )}
    </div>
  );
};

export default Reports;
