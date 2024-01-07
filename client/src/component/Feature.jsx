import React from "react";
import features from "../assets/images/features.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const Feature = () => {
  return (
    <section
      id="features"
      className="wow animate__animated animate__fadeInUp animate__duration-1s features"
    >
      <div className="container" data-aos="fade-up">
        <header className="section-header">
          <h2 className="main-text">Features</h2>
          <p className="sub-text">Key features of this dapp include:</p>
        </header>

        <div className="row">
          <div className="col-lg-6">
            <img src={features} className="img-fluid" alt="features" />
          </div>

          <div className="col-lg-6 mt-5 mt-lg-0 d-flex">
            <div className="row align-self-center gy-4">
              <div
                className="col-md-6"
                data-aos="zoom-out"
                data-aos-delay="200"
              >
                <div className="feature-box d-flex align-items-center">
                  <FontAwesomeIcon icon={faCheck} />
                  &nbsp;
                  <h3>Event Creation</h3>
                </div>
              </div>

              <div
                className="col-md-6"
                data-aos="zoom-out"
                data-aos-delay="300"
              >
                <div className="feature-box d-flex align-items-center">
                  <FontAwesomeIcon icon={faCheck} />
                  &nbsp;
                  <h3>Dashboard</h3>
                </div>
              </div>

              <div
                className="col-md-6"
                data-aos="zoom-out"
                data-aos-delay="400"
              >
                <div className="feature-box d-flex align-items-center">
                  <FontAwesomeIcon icon={faCheck} />
                  &nbsp;
                  <h3>Currency Conversion Tools</h3>
                </div>
              </div>

              <div
                className="col-md-6"
                data-aos="zoom-out"
                data-aos-delay="500"
              >
                <div className="feature-box d-flex align-items-center">
                  <FontAwesomeIcon icon={faCheck} />
                  &nbsp;
                  <h3>Sales and Analytics</h3>
                </div>
              </div>

              <div
                className="col-md-6"
                data-aos="zoom-out"
                data-aos-delay="600"
              >
                <div className="feature-box d-flex align-items-center">
                  <FontAwesomeIcon icon={faCheck} />
                  &nbsp;
                  <h3>Buy and Share Tickets</h3>
                </div>
              </div>

              <div
                className="col-md-6"
                data-aos="zoom-out"
                data-aos-delay="700"
              >
                <div className="feature-box d-flex align-items-center">
                  <FontAwesomeIcon icon={faCheck} />
                  &nbsp;
                  <h3>High End Security</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*row */}
      </div>
    </section>
  );
};

export default Feature;
