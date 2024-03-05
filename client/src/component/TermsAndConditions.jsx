import React from "react";

import "../App.css";

const TermsAndConditions = () => {
  return (
    <div className="mcontainer">
      <h2>
        <strong>Terms of Service</strong>
      </h2>
      <div className="container text-start">
        <ol>
          <p className="card">
            These terms and conditions govern your use of our website. By using
            our website, you accept these terms and conditions in full; if you
            disagree with these terms and conditions or any part of these terms
            and conditions, you must not use our website. Unless otherwise
            stated, we or our licensors own the intellectual property rights in
            the website and material on the website. Subject to the license
            below, all these intellectual property rights are reserved. Access
            to certain areas of our website is restricted. We reserve the right
            to restrict access to other areas of our website, or indeed our
            whole website, at our discretion. Our liability is limited and
            excluded to the maximum extent permitted under applicable law. We
            will not be liable for any direct, indirect, or consequential loss
            or damage arising under these terms and conditions or in connection
            with our website, whether arising in tort, contract, or otherwise –
            including, without limitation, any loss of profit, contracts,
            business, goodwill, data, income, revenue, or anticipated savings.
          </p>
          <p className="card">
            We utilize blockchain technology to ensure transparency in all
            transactions. Every transaction is recorded on the blockchain,
            providing a secure and transparent record of all activities related
            to events and ticket purchases.
          </p>
          <p className="card">
            Users purchasing tickets must pay the ticket price along with any
            applicable gas fees. The gas fees contribute to the blockchain
            network's processing and verification of the transaction.
          </p>

          <p className="card">
            By using our platform as an event organizer, you agree to the
            following fees:
            <br />
            <br />
            <ol>
              <li>
                Event Organizer Registration Fee: A one-time gas fee is required
                for organizer registration. The gas fee varies according to the
                current gas price and network congestion.
              </li>

              <br />
              <li>
                Event Creation Fee:When creating an event, a fee equivalent to
                3% of the total ticket price will be charged. Additionally, a
                gas fee will be incurred for processing the transaction.
              </li>
            </ol>
          </p>
        </ol>
      </div>
    </div>
  );
};

export default TermsAndConditions;
