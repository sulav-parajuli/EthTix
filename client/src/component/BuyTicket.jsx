import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAppContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toastify for displaying notifications

const BuyTicket = ({ eventIndex, event, state }) => {
  const { ticketsContract, signer } = state;
  const [quantity, setQuantity] = useState(1);
  const { savetransactionHashToLocalStorage, isEventOrganizer, isAdmin } =
    useAppContext();
  const navigate = useNavigate();
  // Define state variables for date and time of ticket purchased
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [ticketsContract]);

  const handlequantityChange = (event) => {
    const inputValue = event.target.value;
    const parsedValue = parseInt(inputValue, 10);

    // Check if parsing is successful and the parsed value is within the specified range
    if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 10) {
      setQuantity(parsedValue);
    } else {
      // Handle the case where the input is not a valid number or outside the range
      // You might choose to set the quantity to a default value or show an error message
      setQuantity(1); // Setting a default value of 1
    }
  };

  const handleBuyTicket = async () => {
    try {
      if (isEventOrganizer) {
        toast.info("You are the event organizer. You cannot buy tickets.");
        return;
      }
      if (isAdmin) {
        toast.info("You are the owner. You cannot buy tickets.");
        return;
      }
      // Check the structure of the event being passed
      console.log("Event Structure:", event);

      if (
        !ticketsContract ||
        !signer ||
        !event ||
        !event.price ||
        quantity < 1 ||
        quantity > 10
      ) {
        console.error(
          "Invalid contract, signer, event, event price, or quantity"
        );
        return;
      }

      // Calculate total price
      const totalPrice = event.price.mul(quantity);

      const ticketData = {
        //other data
        currentTime, // Don't forget to add the current time to the ipfs
      };
      //sign Data
      // const { data, signature } = await signData(
      //   signer,
      //   JSON.stringify(ticketData)
      // );
      //upload to ipfs
      // const { ipfsCid } = await uploadToIPFS(data, signature);

      // Call the buyTicket function from the smart contract
      const transaction = await ticketsContract.buyTicket(
        eventIndex + 1,
        quantity,
        {
          value: totalPrice,
        }
      );

      // Wait for the transaction to be mined
      await transaction.wait();
      const TransactionHash = await transaction.hash;
      savetransactionHashToLocalStorage(TransactionHash);
      // console.log("Transaction Hash:", TransactionHash);

      // Handle success or show a confirmation message
      console.log("Ticket purchase successful!");
      navigate("/mytickets");
      document.body.classList.remove("popup-open"); // Remove the class that is added to the body when the popup is open
      document.querySelector(".topnav").style.background = "transparent"; // Change the background color of the topnav
    } catch (error) {
      console.error("Error buying ticket:", error.message);
      // Handle errors or display an error message
    }
  };

  return (
    <div className="container">
      <div className="row py-2">
        {/* Display Ticket Purchase Form */}
        <div className="col-lg-6">
          <h2>Buy Ticket</h2>
          {event ? (
            <>
              <p>
                Event: {event.eventName ? event.eventName.toString() : "N/A"}
              </p>
              <p>
                Price per Ticket:{" "}
                {event.price
                  ? ethers.utils.formatEther(event.price).toString()
                  : "N/A"}{" "}
                ETH
              </p>
            </>
          ) : (
            <p>Event information not available</p>
          )}
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            max="10"
            value={quantity}
            onChange={handlequantityChange}
          />
          <p>
            Total Price:
            {event && event.price
              ? ethers.utils.formatEther(event.price.mul(quantity)).toString()
              : "N/A"}{" "}
            ETH
          </p>
          <button className="main-button color-white" onClick={handleBuyTicket}>
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyTicket;
