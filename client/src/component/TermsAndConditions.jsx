import React from "react";

const TermsAndConditions = () => {
  //this page contains detail information about terms and conditions of this application. if this, then that like rules.
  //example: if a organizer have already created an event then he can't modify created event details by adding number of more tickets etc.
  return (
    <div className="mcontainer container mt-5" style={{ paddingBottom: "5%" }}>
      <h2 className="mb-4">Terms and Conditions</h2>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">1. Introduction</h5>
          <p className="card-text">
            These terms and conditions govern your use of our website. By using
            our website, you accept these terms and conditions in full; if you
            disagree with these terms and conditions or any part of these terms
            and conditions, you must not use our website.
          </p>

          <h5 className="card-title">2. Intellectual Property Rights</h5>
          <p className="card-text">
            Unless otherwise stated, we or our licensors own the intellectual
            property rights in the website and material on the website. Subject
            to the license below, all these intellectual property rights are
            reserved.
          </p>

          {/* Add more sections as needed */}

          <h5 className="card-title">3. Restricted Access</h5>
          <p className="card-text">
            Access to certain areas of our website is restricted. We reserve the
            right to restrict access to other areas of our website, or indeed
            our whole website, at our discretion.
          </p>

          <h5 className="card-title">4. Limitations of Liability</h5>
          <p className="card-text">
            Our liability is limited and excluded to the maximum extent
            permitted under applicable law. We will not be liable for any
            direct, indirect, or consequential loss or damage arising under
            these terms and conditions or in connection with our website,
            whether arising in tort, contract, or otherwise – including, without
            limitation, any loss of profit, contracts, business, goodwill, data,
            income, revenue, or anticipated savings.
          </p>

          {/* Add more sections as needed */}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
