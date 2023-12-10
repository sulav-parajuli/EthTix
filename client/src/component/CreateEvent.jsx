import { React, useState } from "react";
import { ethers } from "ethers";
import { useAppContext } from "./AppContext";
import eventcreation from "../assets/images/eventcreation.png";

const CreateEvent = ({ state }) => {
  const [eventName, setEventName] = useState("");
  const [priceInEther, setPriceInEther] = useState("");
  const [date, setDate] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [location, setLocation] = useState("");
  const { account, isConnected } = useAppContext();

  const handleEventNameChange = (event) => {
    setEventName(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPriceInEther(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTotalTicketsChange = (event) => {
    setTotalTickets(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const createEvent = async (event) => {
    const { contract } = state;
    event.preventDefault(); //to make sure when submitting form page doesnot get reload

    //console.log("Connected to contract:", contract);
    try {
      if (!contract) {
        alert("Contract is not deployed");
        return;
      }
      //convert ether to wei
      const priceInWei = ethers.utils.parseEther(priceInEther);

      const additionalValue = ethers.utils.parseEther(
        (
          (parseFloat(totalTickets) * parseFloat(priceInEther) * 3) /
          100
        ).toString()
      );

      // Send transaction with estimated gas and additional value
      const transaction = await contract.createEvent(
        eventName,
        priceInWei,
        new Date(date).getTime(),
        totalTickets,
        location,
        {
          value: priceInWei.add(additionalValue),
        }
      );

      // Wait for transaction to finish
      await transaction.wait();

      console.log("Event Created");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mcontainer">
      {isConnected ? (
        <>
          <div className="createevent">
            <h1>Create Event</h1>
            <p className="connected"> ConnectedAccount:{account}</p>
            <form onSubmit={createEvent}>
              <div className="mb-3">
                <label htmlFor="eventName" className="form-label">
                  Event Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="eventName"
                  value={eventName}
                  onChange={handleEventNameChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price per Ticket
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  id="price"
                  value={priceInEther}
                  onChange={handlePriceChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  value={date}
                  onChange={handleDateChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="totalTicket" className="form-label">
                  Total number of Tickets
                </label>
                <input
                  type="number"
                  step="1"
                  className="form-control"
                  id="TotalTickets"
                  value={totalTickets}
                  onChange={handleTotalTicketsChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  value={location}
                  onChange={handleLocationChange}
                />
              </div>

              {/* <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Check me out
          </label>
        </div> */}
              <button type="submit" className="btn btn-danger">
                Create Event
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="createevent">
          <img src={eventcreation} alt="Event Creation" />
          <div>Connect your wallet first, to get started.</div>
        </div>
      )}
    </div>
  );
};
export default CreateEvent;
