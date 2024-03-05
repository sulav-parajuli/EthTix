import React from "react";

const OrganizerTerms = ({ onConfirm }) => {
  const handleAcceptTerms = () => {
    onConfirm();
  };
  return (
    <>
      <h2> Event Organizer Registration and Event Creation Fees</h2>
      <div className="card text-start">
        <p>
          By using our platform as an event organizer, you agree to the
          following fees:
        </p>

        <ul>
          <li>
            <strong>Event Organizer Registration Fee:</strong> A one-time gas
            fee is required for organizer registration. The gas fee varies
            according to the current gas price and network congestion.
          </li>
          <li>
            <strong>Event Creation Fee:</strong> When creating an event, a fee
            equivalent to 3% of the total ticket price will be charged.
            Additionally, a gas fee will be incurred for processing the
            transaction.
          </li>
        </ul>

        <p>
          If you are comfortable with these fees and would like to proceed,
          please click "I agree" button to continue with the registration
          process.
        </p>

        <button className="sub-button" onClick={handleAcceptTerms}>
          I Agree
        </button>
      </div>
    </>
  );
};

export default OrganizerTerms;
