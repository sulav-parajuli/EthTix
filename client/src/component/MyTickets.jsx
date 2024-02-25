import React, { useEffect, useState } from "react";
import { useAppContext } from "./AppContext";
import logo from "../assets/images/logo/etherTixLogo.png";
import ErrorPage from "./ErrorPage";
import { retrieveFromIPFS } from "../utils/ipfsUtils";
import QRCode from "react-qr-code";
import "../assets/css/MyTickets.css";

const MyTickets = ({ state }) => {
  const { account, isEventOrganizer } = useAppContext();
  const { ticketsContract } = state;
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  const TicketHandle = async () => {
    const userTickets = await ticketsContract.getTicket(account);
    console.log("userTickets", userTickets);
    const ticketDetails = await Promise.all(
      userTickets.map(async (ticket) => {
        const detail = await retrieveFromIPFS(ticket.eventName);
        return {
          ...ticket,
          eventName: detail,
        };
      })
    );
    setPurchasedTickets(ticketDetails);
    console.log("purchasedTickets", purchasedTickets);
    console.log("ticketDetails", ticketDetails);
  };
  useEffect(() => {
    if (!ticketsContract) return;
    TicketHandle();
  }, [ticketsContract]);
  return (
    <div className="mcontainer">
      {isEventOrganizer ? (
        <ErrorPage />
      ) : (
        <div className="container">
          <div className="profile-container">
            <div>
              <div>
                <img
                  src={logo}
                  className="img-fluid profile-image"
                  width="70"
                />

                <p>{account}</p>
              </div>
            </div>
          </div>

          <ul className="list-group">
            <li className="list-group-item">
              {purchasedTickets.map((ticket, index) => (
                <div key={index} className="col-3 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        {ticket.eventName.eventName}
                      </h5>
                      <div>
                        <QRCode
                          value={`Event: ${JSON.stringify(
                            ticket.eventName
                          )}, Tickets: ${ticket.ticketsOwned.toNumber()}`}
                          className="image-fluid "
                        />
                      </div>

                      <p className="card-text">
                        Tickets Bought: {ticket.ticketsOwned.toNumber()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
