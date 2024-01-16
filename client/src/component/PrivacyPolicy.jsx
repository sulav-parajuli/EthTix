import React from "react";

const PrivacyPolicy = () => {
  //this page contains detail information about users cookies, data security and information about user data collection. how we or this application use them.
  return (
    <div className="mcontainer container mt-5" style={{ paddingBottom: "5%" }}>
      <h2 className="mb-4">Privacy Policy</h2>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">1. Information We Collect</h5>
          <p className="card-text">
            We collect information that you provide directly to us, such as when
            you create an account, submit a contact form, or otherwise interact
            with our services.
          </p>

          <h5 className="card-title">2. Use of Information</h5>
          <p className="card-text">
            We may use the information we collect for various purposes,
            including to provide and improve our services, personalize your
            experience, and send you promotional content.
          </p>

          {/* Add more sections as needed */}

          <h5 className="card-title">3. Data Security</h5>
          <p className="card-text">
            We implement security measures to protect your information from
            unauthorized access and maintain data accuracy. However, no method
            of transmission over the internet or electronic storage is 100%
            secure, and we cannot guarantee absolute security.
          </p>

          <h5 className="card-title">4. Cookies</h5>
          <p className="card-text">
            Our website uses cookies to enhance your experience. By continuing
            to use our website, you consent to the use of cookies in accordance
            with our Privacy Policy.
          </p>

          {/* Add more sections as needed */}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
