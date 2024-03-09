import React from "react";

const OrganizerTerms = ({ onConfirm }) => {
  const handleAcceptTerms = () => {
    onConfirm();
  };
  return (
    <>
      <div className="card text-start">
        <h2 class="card-header" style={{ color: "#008eb0" }}>
          {" "}
          Event Organizer Registration and Event Creation Fees
        </h2>
        <div
          class="card-body"
          style={{ color: "#5a5a5a", maxHeight: "400px", overflowY: "auto" }}
        >
          <p class="card-text" style={{ color: "#5a5a5a" }}>
            <b>
              By using our platform as an event organizer, you agree to the
              following fees:
            </b>
          </p>

          <ul class="list-group">
            <li class="list-group-item" style={{ color: "#5a5a5a" }}>
              <strong>Event Organizer Registration Fee:</strong> A one-time gas
              fee is required for organizer registration. The gas fee varies
              according to the current gas price and network congestion.
            </li>
            <li class="list-group-item" style={{ color: "#5a5a5a" }}>
              <strong>Event Creation Fee:</strong> When creating an event, a fee
              equivalent to 3% of the total ticket price will be charged.
              Additionally, a gas fee will be incurred for processing the
              transaction.
            </li>
          </ul>

          <p class="card-text" style={{ color: "#5a5a5a" }}>
            <b>
              If you are comfortable with these fees and would like to proceed,
              please click "I agree" button to continue with the registration
              process.
            </b>
          </p>

          <div className="text-center">
            <button
              className="sub-button text-center"
              onClick={handleAcceptTerms}
            >
              I Agree
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizerTerms;
