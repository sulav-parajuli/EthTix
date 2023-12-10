import { React, useState } from "react";
import { ethers } from "ethers";
import { useAppContext } from "./AppContext";

const CreateEvent = ({ state }) => {
  const [eventName, setEventName] = useState("");
  const [priceInEther, setPriceInEther] = useState("");
  const [date, setDate] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [location, setLocation] = useState("");
  const { account, isConnected } = useAppContext();
  const [confirmationNeeded, setConfirmationNeeded] = useState(false);

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

  const calculateFee = async () => {
    try {
      const { provider } = state;
      const fee =
        (parseFloat(totalTickets) * parseFloat(priceInEther) * 3) / 100;

      const FeeData = await provider.getFeeData(); //retrieve gas related details
      //console.log(FeeData);
      const gasPrice = ethers.utils.formatUnits(FeeData.gasPrice, "wei"); //Get the gas price
      const gasPriceInEth = ethers.utils.formatEther(gasPrice); //convert gas price to ether
      return (parseFloat(fee) + parseFloat(gasPriceInEth)).toFixed(2); //calculate fee with gas fee
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (
      eventName.trim() === "" &&
      priceInEther.trim() === "" &&
      parseFloat(priceInEther) <= 0 &&
      isNaN(parseFloat(priceInEther)) && // Check if priceInEther is a valid number
      isNaN(new Date(date).getTime()) &&
      isNaN(parseInt(totalTickets)) &&
      location.trim() === ""
    ) {
      // Show an alert or handle the validation error
      alert("Please fill in all fields with valid data.");
      return;
    }
    setConfirmationNeeded(true);
  };

  const handleConfirmation = async (event) => {
    event.preventDefault();
    const fee = await calculateFee();
    const confirmationMessage = `You will be charged ${fee} ETH for creating this event. Are you sure you want to continue?`;
    if (window.confirm(confirmationMessage)) {
      createEvent();
      setConfirmationNeeded(false);
    }
  };

  const createEvent = async () => {
    const { contract } = state;
    //event.preventDefault(); //to make sure when submitting form page doesnot get reload

    //console.log("Connected to contract:", contract);

    try {
      if (!contract) {
        alert("Contract is not deployed");
        return;
      }
      //convert ether to wei
      const priceInWei = ethers.utils.parseEther(priceInEther);
      //conver calculatefee value to wei

      const additionalValue = ethers.utils.parseEther(await calculateFee());

      // Send transaction with estimated gas and additional value
      const transaction = await contract.createEvent(
        eventName,
        priceInWei,
        new Date(date).getTime(),
        totalTickets,
        location,
        {
          value: additionalValue.add(10000),
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
            <form
              onSubmit={
                confirmationNeeded ? handleConfirmation : handleFormSubmit
              }
            >
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

              <button type="submit" className="btn btn-danger">
                {confirmationNeeded ? "Confirm Event Creation" : "Create Event"}
              </button>
            </form>
          </div>
        </>
      ) : (
        <div>Connect your wallet first, to get started.</div>
      )}
    </div>
  );
};
export default CreateEvent;
