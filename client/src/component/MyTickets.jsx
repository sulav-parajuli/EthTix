import React, { useEffect, useState } from "react";
import { useAppContext } from "./AppContext";
import logo from "../assets/images/logo/etherTixLogo.png";
import ErrorPage from "./ErrorPage";
import { retrieveFromIPFS } from "../utils/ipfsUtils";

import "../assets/css/MyTickets.css";
import TicketPopup from "./TicketPopup";

const Popup = ({ isOpen, onClose, ticket }) => {
  return isOpen ? (
    <div className="popup popuptop">
      <div className="popup_inner">
        <button className="close" onClick={onClose}>
          Close
        </button>
        <TicketPopup ticket={ticket} />
      </div>
    </div>
  ) : null;
};

const MyTickets = ({ state }) => {
  const { account, isEventOrganizer } = useAppContext();
  const { ticketsContract } = state;
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const OpenPopupHandler = (ticket) => {
    setSelectedTicket(ticket);
    setIsPopupOpen(true);
  };

  const closePopupHandler = () => {
    setSelectedTicket(null);
    setIsPopupOpen(false);
  };

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
          <div className="card">
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
                  <div>
                    <div className="card-body">
                      <h5 className="card-title">
                        {ticket.eventName.eventName}
                      </h5>
                      <div>
                        <button
                          onClick={() => OpenPopupHandler(ticket)}
                          className="btn btn-primary"
                        >
                          View Ticket Details
                        </button>
                        <Popup
                          isOpen={isPopupOpen}
                          onClose={closePopupHandler}
                          ticket={selectedTicket}
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
