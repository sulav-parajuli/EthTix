import React, { useState } from "react";
import { ethers } from "ethers";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";
import eventcreation from "../assets/images/eventcreation.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
import { signData, uploadToIPFS } from "../utils/ipfsUtils";

const CreateEvent = ({ state }) => {
  const [eventName, setEventName] = useState("");
  const [priceInEther, setPriceInEther] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [location, setLocation] = useState("");
  const [allvalueverified, setAllvalueverified] = useState(false);
  const {
    isUserConnected,
    isEventOrganizer,
    createNotification,
    savetransactionHashToLocalStorage,
  } = useAppContext();
  const [confirmationNeeded, setConfirmationNeeded] = useState(false);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); //to redirect to another page

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
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const calculateFee = async () => {
    try {
      const { provider } = state;
      const priceInWei = ethers.utils.parseEther(priceInEther);
      const totalTicketsInt = ethers.BigNumber.from(totalTickets);

      // Calculate fee in wei
      const feeWei = priceInWei.mul(totalTicketsInt).mul(3).div(100);

      // Convert gas price to ether
      const FeeData = await provider.getFeeData();
      const gasPrice = ethers.utils.formatUnits(FeeData.gasPrice, "wei");
      //const gasPriceInEth = ethers.utils.formatEther(gasPrice);
      console.log(gasPrice);
      // Calculate total fee in ether
      const totalFeeInWei = feeWei.add(gasPrice);
      const totalFeeInEth = ethers.utils.formatEther(totalFeeInWei);

      return totalFeeInEth;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    //handling eventName validation
    if (eventName.trim() === "") {
      document.querySelector(".errorineventname").innerHTML =
        "event name cannot be empty";
      setAllvalueverified(false);
    } else {
      document.querySelector(".errorineventname").innerHTML = "";
      setAllvalueverified(true);
    }

    //handling price validation
    if (
      priceInEther.trim() === "" ||
      parseFloat(priceInEther) <= 0 ||
      isNaN(parseFloat(priceInEther))
    ) {
      document.querySelector(".errorinprice").innerHTML =
        "price cannot be empty or less than 0 or not a number";
      setAllvalueverified(false);
    } else {
      document.querySelector(".errorinprice").innerHTML = "";
      setAllvalueverified(true);
    }

    //handling date validation
    if (isNaN(new Date(date).getTime()) || new Date(date) < new Date()) {
      document.querySelector(".errorindate").innerHTML =
        "date cannot be empty or less than current date";
      setAllvalueverified(false);
    } else {
      document.querySelector(".errorindate").innerHTML = "";
      setAllvalueverified(true);
    }

    //handling time validation
    if (
      time.trim() === "" ||
      isNaN(new Date(`${date} ${time}`).getTime()) ||
      new Date(`${date} ${time}`) < new Date()
    ) {
      document.querySelector(".errorintime").innerHTML =
        "time cannot be empty or selected time is less than current time";
      setAllvalueverified(false);
    } else {
      document.querySelector(".errorintime").innerHTML = "";
      setAllvalueverified(true);
    }
    //handling description validation
    if (description.length > 100) {
      document.querySelector(".errorindescription").innerHTML =
        "description cannot be greater than 100 characters";
      setAllvalueverified(false);
    } else {
      document.querySelector(".errorindescription").innerHTML = "";
      setAllvalueverified(true);
    }
    //handling location validation
    if (location.trim() === "") {
      document.querySelector(".errorinlocation").innerHTML =
        "location cannot be empty";
      setAllvalueverified(false);
    } else {
      document.querySelector(".errorinlocation").innerHTML = "";
      setAllvalueverified(true);
    }

    //handling totalTickets validation
    if (
      isNaN(parseInt(totalTickets)) ||
      parseInt(totalTickets) <= 0 ||
      totalTickets.trim() === ""
    ) {
      document.querySelector(".errorintotalticket").innerHTML =
        "total tickets cannot be empty or less than 0 or not a number";
      setAllvalueverified(false);
    } else {
      document.querySelector(".errorintotalticket").innerHTML = "";
      setAllvalueverified(true);
    }

    if (allvalueverified) {
      setConfirmationNeeded(true);
    }
  };

  const handleConfirmation = async (event) => {
    event.preventDefault();

    const fee = await calculateFee();
    const confirmationMessage = `Event Name: ${eventName}\nPrice: ${priceInEther} ETH\nDate: ${date}\nTime: ${time}\nLocation: ${location}\nTotal Tickets: ${totalTickets}\n
    You will be charged ${fee} ETH for creating this event. Are you sure you want to continue?`;
    if (window.confirm(confirmationMessage)) {
      createEvent();
      setConfirmationNeeded(false);
    }
  };

  const createEvent = async () => {
    const { signer, ticketsContract } = state;
    //event.preventDefault(); //to make sure when submitting form page doesnot get reload

    //console.log("Connected to ticketsContract:", ticketsContract);

    try {
      setIsLoading(true);
      if (!ticketsContract) {
        // alert("ticketsContract is not deployed");
        console.error("ticketsContract is not deployed");
        toast.warning("Contract is not deployed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        const newToastMessage = {
          notificationName: "ticketsContract is not deployed.",
        };

        createNotification(newToastMessage);
        return;
      }
      const eventData = {
        eventName,
        date,
        time,
        description,
        location,
      };
      //sign Data
      const { data, signature } = await signData(
        signer,
        JSON.stringify(eventData)
      );
      //upload to ipfs
      const { ipfsCid } = await uploadToIPFS(data, signature);

      console.log("IPFS CID:", ipfsCid);
      //convert ether to wei
      const priceInWei = ethers.utils.parseEther(priceInEther);
      //conver calculatefee value to wei

      const additionalValue = ethers.utils.parseEther(await calculateFee());

      //convert date and time to timestamp
      // const eventTimestamp = new Date(${date} ${time}).getTime();

      // Send transaction with estimated gas and additional value
      const transaction = await ticketsContract.createEvent(
        ipfsCid,
        totalTickets,
        priceInWei,

        {
          value: additionalValue,
        }
      );

      // Wait for transaction to finish
      await transaction.wait();
      const TransactionHash = await transaction.hash;
      savetransactionHashToLocalStorage(TransactionHash);
      // console.log("Transaction Hash:", TransactionHash);

      console.log("Event Created");

      toast.success("Event Created Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      const newToastMessage = {
        notificationName: "Event Created Successfully.",
      };

      createNotification(newToastMessage);
      // Redirect to a events route when event created successfully
      navigate("/events");
      document.querySelector(".topnav").style.display = "flex";
      document.querySelector(".footer-container").style.display = "block";
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isUserConnected && isEventOrganizer ? (
        <div className="createevent">
          {isLoading ? (
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#008eb0"
              ariaLabel="triangle-loading"
              wrapperStyle={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh", // 100% of the viewport height
              }}
              wrapperClass=""
            />
          ) : (
            <form
              onSubmit={
                confirmationNeeded ? handleConfirmation : handleFormSubmit
              }
            >
              <div className="mb-4">
                <label htmlFor="eventName" className="form-label">
                  <b>
                    Event Name<span className="required">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="eventName"
                  value={eventName}
                  placeholder="Enter Event Name"
                  onChange={handleEventNameChange}
                />
                <div className="errorineventname"></div>
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  <b>
                    Price per Ticket(ETH)<span className="required">*</span>
                  </b>
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  id="price"
                  value={priceInEther}
                  placeholder="Enter Price in Ether"
                  onChange={handlePriceChange}
                />
                <div className="errorinprice"></div>
              </div>

              <div className="mb-3">
                <label htmlFor="date" className="form-label">
                  <b>
                    Date<span className="required">*</span>
                  </b>
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  value={date}
                  onChange={handleDateChange}
                  onKeyDown={(e) => e.preventDefault()}
                />
                <div className="errorindate"></div>
              </div>

              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  <b>
                    Time<span className="required">*</span>
                  </b>
                </label>
                <input
                  type="time"
                  className="form-control"
                  id="location"
                  value={time}
                  onChange={handleTimeChange}
                  onKeyDown={(e) => e.preventDefault()}
                />
                <div className="errorintime"></div>
              </div>

              <div className="mb-3">
                <label htmlFor="totalTicket" className="form-label">
                  <b>
                    Total Number Of Tickets<span className="required">*</span>
                  </b>
                </label>
                <input
                  type="number"
                  step="1"
                  className="form-control"
                  id="TotalTickets"
                  value={totalTickets}
                  placeholder="Enter Total Number Of Tickets"
                  onChange={handleTotalTicketsChange}
                />
                <div className="errorintotalticket"></div>
              </div>

              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  <b>
                    Location<span className="required">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  value={location}
                  placeholder="Enter Event Location"
                  onChange={handleLocationChange}
                />
                <div className="errorinlocation"></div>
              </div>

              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  <b>Event Description</b>
                </label>
                <textarea
                  rows={1}
                  type="text"
                  className="form-control"
                  id="description"
                  value={description}
                  placeholder="Enter Event Description, Links etc."
                  onChange={handleDescriptionChange}
                  style={{
                    overflow: "hidden",
                    maxHeight: "100px",
                    maxLength: "100",
                  }}
                ></textarea>
                <div className="errorindescription"></div>
              </div>

              <button type="submit" className="btn btn-danger">
                {confirmationNeeded ? "Confirm Event Creation" : "Create Event"}
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="createevent">
          <img src={eventcreation} alt="Event Creation" />
          <div>
            Begin by connecting your wallet as the event organizer to initiate
            the process.
          </div>
        </div>
      )}
    </>
  );
};
export default CreateEvent;
