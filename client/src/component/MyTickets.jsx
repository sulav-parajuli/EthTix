import React, { useEffect, useState } from "react";
import { useAppContext } from "./AppContext";
import logo from "../assets/images/logo/etherTixLogo.png";
import ErrorPage from "./ErrorPage";
import { retrieveFromIPFS } from "../utils/ipfsUtils";

const MyTickets = ({ state }) => {
  const { account, events, isEventOrganizer } = useAppContext();
  const { ticketsContract } = state;
  const [purchasedTickets, setPurchasedTickets] = useState([]);

  const TotalTicketsBought = async () => {
    if (!ticketsContract || !account) {
      return;
    }
    try {
      const userTickets = await ticketsContract.getTicket(account);
      console.log("User Tickets:", userTickets);

      // Assuming eventName is stored in the "eventName" property
      const ticketsInfo = await Promise.all(
        userTickets.map(async (ticket) => {
          const eventName = await retrieveFromIPFS(ticket.eventName);
          return { ...ticket, eventName };
        })
      );

      console.log("Tickets Info:", ticketsInfo);

      setPurchasedTickets(ticketsInfo);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const handleTicketPurchased = async () => {
      // When "TicketPurchased" event occurs, fetch the updated tickets
      await TotalTicketsBought();
    };

    if (ticketsContract) {
      // Register the event listener
      ticketsContract.on("TicketPurchased", handleTicketPurchased);
    }

    return () => {
      // Unregister the event listener when the component is unmounted
      if (ticketsContract) {
        ticketsContract.removeListener(
          "TicketPurchased",
          handleTicketPurchased
        );
      }
    };
  }, [ticketsContract, TotalTicketsBought]);
  useEffect(() => {
    const handleTicketPurchased = async () => {
      // When "TicketPurchased" event occurs, fetch the updated tickets
      await TotalTicketsBought();
    };

    if (ticketsContract) {
      // Register the event listener
      ticketsContract.on("TicketPurchased", handleTicketPurchased);
    }

    return () => {
      // Unregister the event listener when the component is unmounted
      if (ticketsContract) {
        ticketsContract.removeListener(
          "TicketPurchased",
          handleTicketPurchased
        );
      }
    };
  }, [ticketsContract, TotalTicketsBought]);
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
                      Tickets Bought: {ticket.ticketsOwned.toNumber()}
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
