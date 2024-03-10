import React from "react";

const UserTerm = ({ onConfirm }) => {
  const handleAcceptTerms = () => {
    onConfirm();
  };

  return (
    <>
      <h2>Understanding Ticket Prices and Gas Fees</h2>
      <div className="card text-start">
        <p>
          Welcome to our platform! To ensure a seamless and transparent
          experience for our users, it's essential to understand how ticket
          prices and gas fees work.
        </p>

        <p>
          <strong>Ticket Price:</strong> The ticket price is the cost you pay to
          attend an event. It covers the value of the event itself, and it's set
          by the event organizer.
        </p>
        <p>
          <strong>Ticket Purchase Limit</strong> The user can purchase a maximum
          of 10 tickets at a time.
        </p>

        <p>
          <strong>Gas Fees:</strong> Gas fees are associated with blockchain
          transactions. When you purchase a ticket, a small gas fee is incurred.
          This fee contributes to the processing and verification of the
          transaction on the blockchain network, ensuring secure and transparent
          transactions.
        </p>

        <p>
          By clicking "I Agree," you acknowledge and accept the terms related to
          ticket prices and gas fees. If you have any questions or need further
          clarification, feel free to reach out to our support team.
        </p>

        <button className="sub-button" onClick={handleAcceptTerms}>
          I Agree
        </button>
      </div>
    </>
  );
};

export default UserTerm;
