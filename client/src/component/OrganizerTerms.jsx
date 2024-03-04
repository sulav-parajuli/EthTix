import React from "react";

const OrganizerTerms = ({ onConfirm }) => {
  const handleAcceptTerms = () => {
    onConfirm();
  };
  return (
    <div>
      <h5>1. Introduction</h5>
      <p>
        These terms and conditions govern your use of our website. By using our
        website, you accept these terms and conditions in full; if you disagree
        with these terms and conditions or any part of these terms and
        conditions, you must not use our website.
      </p>

      <h5>2. Intellectual Property Rights</h5>
      <p>
        Unless otherwise stated, we or our licensors own the intellectual
        property rights in the website and material on the website. Subject to
        the license below, all these intellectual property rights are reserved.
      </p>

      <h5>3. Restricted Access</h5>
      <p>
        Access to certain areas of our website is restricted. We reserve the
        right to restrict access to other areas of our website, or indeed our
        whole website, at our discretion.
      </p>

      <h5>4. Limitations of Liability</h5>
      <p>
        Our liability is limited and excluded to the maximum extent permitted
        under applicable law. We will not be liable for any direct, indirect, or
        consequential loss or damage arising under these terms and conditions or
        in connection with our website, whether arising in tort, contract, or
        otherwise – including, without limitation, any loss of profit,
        contracts, business, goodwill, data, income, revenue, or anticipated
        savings.
      </p>

      <h5>5. Event Organizer Registration and Event Creation Fees</h5>
      <p>
        By using our platform as an event organizer, you agree to the following
        fees:
      </p>

      <ul>
        <li>
          <strong>Event Organizer Registration Fee:</strong> A one-time gas fee
          is required for organizer registration. The gas fee varies according
          to the current gas price and network congestion.
        </li>
        <li>
          <strong>Event Creation Fee:</strong> When creating an event, a fee
          equivalent to 3% of the total ticket price will be charged.
          Additionally, a gas fee will be incurred for processing the
          transaction.
        </li>
      </ul>

      <p>
        If you are comfortable with these fees and would like to proceed, please
        checkmark "I agree to the terms and conditions" button to continue with
        the registration process.
      </p>

      <button className="sub-button" onClick={handleAcceptTerms}>
        I Agree
      </button>
    </div>
  );
};

export default OrganizerTerms;
