import React from "react";
import { Link } from "react-router-dom";

const MainAbout = () => {
  return (
    <div className="wow animate__animated animate__fadeInUp animate__duration-1s aboutcontainer">
      <div
        className="text-container"
        style={{
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            padding: "20px",
          }}
        >
          <p className="main-text">About EthTix</p>
          <hr />
          <p
            className="sub-text"
            style={{
              paddingBottom: "20px",
            }}
          >
            EthTix is a decentralized application (dApp) that allows event
            organizers to create, manage, and sell event tickets on the Ethereum
            blockchain. EthTix leverages the Ethereum blockchain to provide a
            secure, transparent, and trustless platform for event ticketing. The
            Ethereum blockchain ensures that event tickets are secure, cannot be
            counterfeited, and are easily transferable. EthTix also provides a
            user-friendly interface for event organizers to create and manage
            events, and for event attendees to purchase and transfer tickets.
            <br />
            EthTix is a fully decentralized application (dApp) that is built on
            the Ethereum blockchain. Lorem ipsum, dolor sit amet consectetur
            adipisicing elit. Recusandae ipsam tenetur eius? Maiores a corrupti
            quaerat vel dignissimos velit facere, assumenda fuga laudantium
            beatae blanditiis error, fugit quibusdam dolor! Ipsum?
          </p>
          <Link to="/about" className="main-button">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainAbout;
