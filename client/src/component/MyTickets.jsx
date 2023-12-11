import React from "react";
import { useAppContext } from "./AppContext";

const MyTickets = ({ state }) => {
  const { account } = useAppContext();
  return (
    <div className="mcontainer">
      <div className="myprofile">
        <p>My Profile</p>
        <hr />
      </div>
      <div className="profile">
        <img
          src="https://i.imgur.com/G1pXs7D.jpg"
          className="img-fluid profile-image"
          width="70"
        />
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
