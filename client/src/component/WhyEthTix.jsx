import React from "react";
import value1 from "../assets/images/whyethtix/Authentication.gif";
import value2 from "../assets/images/whyethtix/Audit-pana.png";
import value3 from "../assets/images/whyethtix/network.png";
import value4 from "../assets/images/whyethtix/Security On-bro.png";
import value5 from "../assets/images/whyethtix/transfer.png";
import value6 from "../assets/images/whyethtix/support.gif";

const WhyEthTix = () => {
  return (
    <section
      id="whyethtix"
      className="wow animate__animated animate__fadeInUp animate__duration-1s values"
    >
      <div className="container">
        <header className="section-header">
          <h2 className="main-text">Why EthTix</h2>
          <p className="sub-text">
            There are several reasons to choose EthTix. Some of them are:.
          </p>
        </header>

        <div className="row">
          <div className="col-lg-4">
            <div className="box">
              <img
                src={value1}
                className="img-fluid"
                alt="Transparency"
                title="Transparency"
              />
              <h3>Authenticity and Transparency</h3>
              <p>
                EthTix leverages blockchain technology to ensure the
                authenticity and transparency of ticket sales, reducing the risk
                of counterfeit tickets and promoting trust among users.
              </p>
            </div>
          </div>

          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="box">
              <img
                src={value2}
                className="img-fluid"
                alt="Immutable Records"
                title="Immutable Records"
              />
              <h3>Immutable Records</h3>
              <p>
                All ticket transactions are recorded on the Ethereum blockchain,
                creating an immutable and tamper-proof record of ownership and
                ticket transfers. This enhances security and prevents fraud.
              </p>
            </div>
          </div>

          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="box">
              <img
                src={value3}
                className="img-fluid"
                alt="Decentralization"
                title="Decentralization"
              />
              <h3>Decentralized Platform</h3>
              <p>
                EthTix operates on a decentralized platform, eliminating the
                need for intermediaries such as ticketing agencies or brokers.
                This results in lower fees for both event organizers and ticket
                buyers.
              </p>
            </div>
          </div>

          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="box">
              <img
                src={value4}
                className="img-fluid"
                alt="Security"
                title="Security"
              />
              <h3>Enhanced Security</h3>
              <p>
                Blockchain technology used by EthTix offers enhanced security
                features, such as cryptographic encryption and decentralized
                storage, protecting user data and ensuring privacy.
              </p>
            </div>
          </div>
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="box">
              <img
                src={value5}
                className="img-fluid"
                alt="Ticket Transfer"
                title="Ticket Transfer"
              />
              <h3>Seamless Ticket Transfer</h3>
              <p>
                EthTix facilitates seamless ticket transfers between users,
                allowing ticket holders to transfer their tickets securely to
                friends or family members without the need for physical tickets
                or manual processes.
              </p>
            </div>
          </div>
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="box">
              <img
                src={value6}
                className="img-fluid"
                alt="EventOrganizer Support"
                title="EventOrganizer Support"
              />
              <h3>Support for Event Organizers</h3>
              <p>
                EthTix provides comprehensive support for event organizers,
                offering tools and resources to streamline ticket management,
                promote events, and engage with attendees effectively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyEthTix;
