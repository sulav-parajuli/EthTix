import React, { useEffect, useState } from "react";
import { useAppContext } from "./AppContext";
import logo from "../assets/images/logo/etherTixLogo.png";
import ErrorPage from "./ErrorPage";

const MyTickets = ({ state }) => {
  const { account, events, isEventOrganizer } = useAppContext();
  const { ticketsContract } = state;
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  useEffect(() => {
    if (!ticketsContract) {
      return;
    }
    ticketsContract.on("TicketPurchased", async (eventId, ticketsBought) => {
      setPurchasedTickets((prevTickets) => [
        ...prevTickets,
        events[eventId.toNumber() - 1],
      ]);
    });

    return () => {
      ticketsContract.removeListener("TicketPurchased");
    };
  }, [ticketsContract]);

  return (
    <div className="mcontainer ticketcontainer">
      {isEventOrganizer ? (
        <ErrorPage />
      ) : (
        <>
          <div className="myprofile">
            <p>My Profile</p>
            <hr />
          </div>
          <div className="profile">
            <img src={logo} className="img-fluid profile-image" width="70" />
            <div className="ml-3">
              <input
                type="text"
                placeholder="Input your name"
                className="name"
              />
              <p className="useraddress">{account}</p>
              <hr />
            </div>
          </div>
          <p className="mytickets">My Tickets</p>

          <div className="row">
            {purchasedTickets.map((ticket, index) => (
              <div key={index} className="col-3 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{ticket.eventName}</h5>
                    <p className="card-text">
                      Tickets Bought: {ticket.ticketsBought.toNumber()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyTickets;
