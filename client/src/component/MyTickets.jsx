import React, { useEffect, useState } from "react";
import { useAppContext } from "./AppContext";
import logo from "../assets/images/logo/etherTixLogo.png";

const MyTickets = ({ state }) => {
  const { account, events } = useAppContext();
  const { ticketsContract } = state;
  useEffect(() => {
    if (!ticketsContract) {
      return;
    }
    ticketsContract.on("TicketPurchased", async (eventId, ticketsBought) => {
      console.log(events[eventId.toNumber() - 1]);
    });
  });
  return (
    <div className="mcontainer">
      <div className="myprofile">
        <p>My Profile</p>
        <hr />
      </div>
      <div className="profile">
        <img src={logo} className="img-fluid profile-image" width="70" />
        <div className="ml-3">
          <input type="text" placeholder="Input your name" className="name" />
          <p className="useraddress">{account}</p>
          <hr />
        </div>
      </div>
      <p className="mytickets">My Tickets</p>
      <div> Other ticket logics goes here.</div>
    </div>
  );
};

export default MyTickets;
