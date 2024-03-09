import React, { useEffect, useState } from "react";
import { useAppContext } from "./AppContext";
// import logo from "../assets/images/logo/etherTixLogo.png";
import user from "../assets/images/user.png";
import ErrorPage from "./ErrorPage";
import { retrieveFromIPFS } from "../utils/ipfsUtils";

import "../assets/css/MyTickets.css";
import TicketPopup from "./TicketPopup";

const Popup = ({ isOpen, onClose, ticket }) => {
  return isOpen ? (
    <div className="popup popuptop">
      <div className="card position-relative mb-5">
        <button
          className="btn-close position-absolute top-0 end-0 m-3"
          onClick={onClose}
        ></button>
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
    document.body.classList.add("popup-open"); // Prevent scrolling
    document.querySelector(".topnav").style.background =
      "rgba(255,255,255,0.9)";
  };

  const closePopupHandler = () => {
    setSelectedTicket(null);
    setIsPopupOpen(false);
    document.body.classList.remove("popup-open"); // Make scrollable again
    document.querySelector(".topnav").style.background = "transparent";
  };

  const TicketHandle = async () => {
    const userTickets = await ticketsContract.getTicket(account);
    // console.log("userTickets", userTickets);
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
    // console.log("purchasedTickets", purchasedTickets);
    // console.log("ticketDetails", ticketDetails);
  };
  useEffect(() => {
    if (!ticketsContract) return;
    TicketHandle();
  }, [ticketsContract]);
  return (
    <div className="mcontainer mb-5">
      {isEventOrganizer ? (
        <ErrorPage />
      ) : (
        <div className="container mt-5">
          <div className="row">
            {/* Left div */}
            <div className="col-sm-5 pb-4">
              <div className="card">
                <div>
                  <div>
                    <img
                      src={user}
                      className="img-fluid profile-image"
                      width="100"
                    />
                  </div>
                  <p>{account}</p>
                </div>
              </div>
            </div>

            {/* Right div */}
            <div className="col-7 pb-3">
              <ul className="list-group">
                {purchasedTickets.map((ticket, index) => (
                  <li key={index} className="list-group-item">
                    <div className="mb-4">
                      <div className=" d-flex justify-content-between align-items-center">
                        <h5 className="card-title">
                          {ticket.eventName.eventName}
                        </h5>
                        <div>
                          <button
                            onClick={() => OpenPopupHandler(ticket)}
                            className="button justify-content-end"
                          >
                            Ticket Details
                          </button>
                          <Popup
                            isOpen={isPopupOpen}
                            onClose={closePopupHandler}
                            ticket={selectedTicket}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
