import React, { useState } from "react";
import { ethers } from "ethers";
import { useAppContext } from "./AppContext";
import eventcreation from "../assets/images/eventcreation.png";
import { useNavigate } from "react-router-dom";
import { signData, uploadToIPFS } from "../utils/ipfsUtils";
//import axios from "axios";

const CreateEvent = ({ state }) => {
  const [eventName, setEventName] = useState("");
  const [priceInEther, setPriceInEther] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [location, setLocation] = useState("");
  const [allvalueverified, setAllvalueverified] = useState(false);
  const { isUserConnected } = useAppContext();
  const [confirmationNeeded, setConfirmationNeeded] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); //to redirect to another page

  // const handleEventNameChange = (event) => {
  //   setEventName(event.target.value);
  // };

  // const handlePriceChange = (event) => {
  //   setPriceInEther(event.target.value);
  // };

  // const handleDateChange = (event) => {
  //   setDate(event.target.value);
  // };

  // const handleTotalTicketsChange = (event) => {
  //   setTotalTickets(event.target.value);
  // };

  // const handleLocationChange = (event) => {
  //   setLocation(event.target.value);
  // };

  // const handleTimeChange = (event) => {
  //   setTime(event.target.value);
  // };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setImage(event.target.files[0]);
    };
    // Get the first selected file
    if (!file) {
      document.querySelector(".errorinimage").innerHTML =
        "image cannot be empty";
      setAllvalueverified(false);
    }
    if (file.type !== "image/png") {
      document.querySelector(".errorinimage").innerHTML = "image must be png";
      setAllvalueverified(false);
    }
    //Check file size (limit to 1MB)
    const maxSizeInBytes = 1 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      document.querySelector(".errorinimage").innerHTML =
        "Please select image of size less than 1MB";
      setAllvalueverified(false);
    }
    setImage(file);
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

    //handling image validation
    // if(!image){
    //   document.querySelector(".errorinimage").innerHTML = "image cannot be empty";
    //   setAllvalueverified(false);
    // }else{
    //   document.querySelector(".errorinimage").innerHTML = "";
    //   setAllvalueverified(true);
    // }

    if (allvalueverified) {
      setConfirmationNeeded(true);
    }
  };

  const handleConfirmation = async (event) => {
    event.preventDefault();

    const fee = await calculateFee();
    const confirmationMessage = `You will be charged ${fee} ETH for creating this event and you can't alter the event details once created. Are you sure you want to continue?`;
    if (window.confirm(confirmationMessage)) {
      createEvent();
      setConfirmationNeeded(false);
    }
  };

  const createEvent = async () => {
    const { signer, ticketsContract } = state;
    //event.preventDefault(); //to make sure when submitting form page doesnot get reload

    //console.log("Connected to contract:", contract);

    try {
      if (!ticketsContract) {
        alert("Contract is not deployed");
        return;
      }
      const eventData = {
        eventName,
        date,
        time,
        location,
      };
      const imageData = {
        image,
      };

      //sign data
      const { data, signature } = await signData(
        signer,
        JSON.stringify(eventData)
      );
      //upload to ipfs
      const { ipfsCid } = await uploadToIPFS(data, signature);
      //sign image
      const { data1, signature1 } = await signData(
        signer,
        JSON.stringify(imageData)
      );
      //upload image to ipfs
      const { ipfsCid: imageIpfsCid } = await uploadToIPFS(
        data1,
        signature1,
        true
      );

      //convert ether to wei
      const priceInWei = ethers.utils.parseEther(priceInEther);
      //conver calculatefee value to wei

      const additionalValue = ethers.utils.parseEther(await calculateFee());

      //convet date and time to timestamp
      //const eventTimestamp = new Date(`${date} ${time}`).getTime();

      // Send transaction with estimated gas and additional value
      const transaction = await ticketsContract.createEvent(
        ipfsCid,
        totalTickets,
        priceInWei,
        imageIpfsCid,

        {
          value: additionalValue.add(10000),
        }
      );

      // Wait for transaction to finish
      await transaction.wait();

      console.log("Event Created");
      console.log(data);
      console.log(ipfsCid);
      console.log(transaction);
      // Redirect to a events route when event created successfully
      navigate("/events");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isUserConnected ? (
        <div className="createevent">
          <form
            onSubmit={
              confirmationNeeded ? handleConfirmation : handleFormSubmit
            }
          >
            <div className="mb-4">
              <label htmlFor="eventName" className="form-label">
                Event Name
              </label>
              <input
                type="text"
                className="form-control"
                id="eventName"
                value={eventName || ""}
                onChange={(e) => setEventName(e.target.value)}
              />
              <div className="errorineventname"></div>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Price per Ticket(ETH)
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                id="price"
                value={priceInEther || ""}
                onChange={(e) => setPriceInEther(e.target.value)}
              />
              <div className="errorinprice"></div>
            </div>

            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                value={date || ""}
                onChange={(e) => setDate(e.target.value)}
                onKeyDown={(e) => e.preventDefault()}
              />
              <div className="errorindate"></div>
            </div>

            <div className="mb-3">
              <label htmlFor="time" className="form-label">
                Time
              </label>
              <input
                type="time"
                className="form-control"
                id="time"
                value={time || ""}
                onChange={(e) => setTime(e.target.value)}
                onKeyDown={(e) => e.preventDefault()}
              />
              <div className="errorintime"></div>
            </div>

            <div className="mb-3">
              <label htmlFor="totalTicket" className="form-label">
                Total Number Of Tickets
              </label>
              <input
                type="number"
                step="1"
                className="form-control"
                id="TotalTickets"
                value={totalTickets || ""}
                onChange={(e) => setTotalTickets(e.target.value)}
              />
              <div className="errorintotalticket"></div>
            </div>

            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                className="form-control"
                id="location"
                value={location || ""}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div className="errorinlocation"></div>
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Image
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                value={image || ""}
                onChange={handleImageChange}
              />
              <div className="errorinimage"></div>
            </div>

            <button type="submit" className="btn btn-danger">
              {confirmationNeeded ? "Confirm Event Creation" : "Create Event"}
            </button>
          </form>
        </div>
      ) : (
        <div className="createevent">
          <img src={eventcreation} alt="Event Creation" />
          <div>Connect your wallet first, to get started.</div>
        </div>
      )}
    </>
  );
};
export default CreateEvent;
