import React, { useState } from "react";

import QRCode from "react-qr-code";
const TicketPopup = ({ ticket }) => {
  const eventName = JSON.stringify(ticket.eventName.eventName);
  const eventDate = JSON.stringify(ticket.eventName.date);
  const eventLocation = JSON.stringify(ticket.eventName.location);
  const description = JSON.stringify(ticket.eventName.description);
  return (
    <div className="mb-5">
      <div>
        <h3>{eventName.replace(/"/g, "")}</h3>
        <div className="text-justify">
          <p>{`Date: ${eventDate.replace(/"/g, "")}`}</p>
          <p>{`Location: ${eventLocation.replace(/"/g, "")}`}</p>
          <p>Tickets Owned:{ticket.ticketsOwned.toNumber()}</p>
          {ticket.eventName.description ? (
            <p>{`Description: ${description.replace(/"/g, "")}`}</p>
          ) : (
            <p>{`Description: No description `}</p>
          )}
          <QRCode
            value={`Event: ${JSON.stringify(
              ticket.eventName
            )}, Tickets: ${ticket.ticketsOwned.toNumber()}`}
            className="card-img-top "
          />
        </div>
      </div>
    </div>
  );
};
export default TicketPopup;
