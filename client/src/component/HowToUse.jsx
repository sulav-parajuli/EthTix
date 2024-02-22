import React from "react";
import userflow from "../assets/images/userflow.gif";

const HowToUse = () => {
  return (
    <section
      id="howtouse"
      className="wow animate__animated animate__fadeInUp animate__duration-1s howtouse"
    >
      <div className="container">
        <header className="section-header">
          <h2 className="main-text">How to Use</h2>
          <p className="sub-text">
            Here are some general ideas for effectively using EthTix:
          </p>
        </header>

        <div className="row feature-icons">
          <div className="row">
            <div className="col-xl-4 text-center">
              <img src={userflow} className="img-fluid p-4" alt="" />
            </div>

            <div className="col-xl-8 d-flex content">
              <div className="row align-self-center gy-4">
                <div className="col-md-6 icon-box">
                  {/* <i className="ri-line-chart-line"></i> */}
                  <div>
                    <h4>Connect Wallet</h4>
                    <p>
                      Connect your ethereum wallet such as "Metamask" to
                      securely manage your event tickets.
                    </p>
                  </div>
                </div>

                <div className="col-md-6 icon-box">
                  {/* <i className="ri-stack-line"></i> */}
                  <div>
                    <h4>Browse Events</h4>
                    <p>
                      Once connected, head to the "Browse Event" section to
                      discover events and filter them to find your match.
                    </p>
                  </div>
                </div>

                <div className="col-md-6 icon-box">
                  {/* <i className="ri-brush-4-line"></i> */}
                  <div>
                    <h4>Purchase Tickets</h4>
                    <p>
                      Buy your tickets and enjoy hassle-free entry at the venue!
                    </p>
                  </div>
                </div>

                <div className="col-md-6 icon-box">
                  {/* <i className="ri-magic-line"></i> */}
                  <div>
                    <h4>Become an Event Organizer</h4>
                    <p>
                      To host events, click "Host Event" on the homepage, then
                      fill out the form.
                    </p>
                  </div>
                </div>

                <div className="col-md-6 icon-box">
                  {/* <i className="ri-command-line"></i> */}
                  <div>
                    <h4>Register as an Organizer</h4>
                    <p>
                      After filling out the form, click "Next" to complete
                      registration. You'll then be directed to your dashboard.
                    </p>
                  </div>
                </div>

                <div className="col-md-6 icon-box">
                  {/* <i className="ri-radar-line"></i> */}
                  <div>
                    <h4>Explore Dashboard Features</h4>
                    <p>
                      Explore event analytics and manage ticket sales
                      effectively on your dashboard. Monitor event performance
                      with ease.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToUse;
