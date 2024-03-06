import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify"; // Import toastify for displaying notifications
import { retrieveFromIPFS } from "../utils/ipfsUtils";
import { ethers } from "ethers"; // Import ethers
// Import the contract addresses from the JSON file
import contractAddresses from "../../../contractAddresses.json";

const AppContext = createContext();

const AppProvider = ({ children, template, accounts, account, state }) => {
  const [reload, setReload] = useState(false); // sets to true when user tries to reload the page
  const [isUserConnected, setUserConnected] = useState(false);
  const [reports, setReports] = useState([]); // State to store reports
  const [isEventOrganizer, setEventOrganizer] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine); // Check if the user is online or not.
  const { signer, ticketsContract } = state;
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [isSelected, setIsSelected] = useState("dashboard"); // Initial selection, you can change it as needed
  const [Loading, setLoading] = useState(false);
  // Function to fetch events from the smart contract
  const fetchEvents = async () => {
    try {
      if (!ticketsContract) {
        return [];
      }

      // Fetch all events when the component mounts
      const allEvents = await ticketsContract.getAllEvents();
      const eventsWithDetails = await Promise.all(
        allEvents.map(async (event, index) => {
          const details = await retrieveFromIPFS(event.eventCID);
          return { ...event, ...details, index };
        })
      );

      return eventsWithDetails;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  };

  // Function to handle the "EventCreated" event from the smart contract
  const handleEventCreated = async () => {
    try {
      if (!ticketsContract) {
        console.error("Contract not found");
        toast.warning("Contract not found", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
        const newToastMessage = {
          notificationName: "Contract not found.",
        };

        createNotification(newToastMessage);
        return;
      }

      // Fetch updated events
      const updatedEvents = await fetchEvents();
      // Update the events state
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error fetching and updating new event:", error);
    }
  };

  function convertUnixTimestampToDateTime(unixTimestamp) {
    try {
      // console.log(unixTimestamp);
      // Ensure that the timestamp is defined and numeric
      if (typeof unixTimestamp !== "undefined" && !isNaN(unixTimestamp)) {
        // Convert the timestamp to a JavaScript number
        const timestampNumber = ethers.BigNumber.from(unixTimestamp).toNumber();

        // Check if the conversion to JavaScript number was successful
        if (!isNaN(timestampNumber)) {
          // Create a Date object using the timestamp
          const date = new Date(timestampNumber * 1000); // Convert seconds to milliseconds

          // Format the date and time
          const formattedDateTime = date.toLocaleString(); // Adjust this based on your formatting preferences

          return formattedDateTime;
        } else {
          throw new Error("Invalid timestamp conversion to JavaScript number");
        }
      } else {
        throw new Error("Invalid or undefined timestamp value");
      }
    } catch (error) {
      console.error("Error converting timestamp:", error.message);
      return ""; // Return an empty string or handle the error case accordingly
    }
  }

  // Example usage
  // const unixTimestamp = "0x65b3afdc"; // Replace with your actual timestamp
  // const formattedDateTime = convertUnixTimestampToDateTime(unixTimestamp);
  // console.log("Formatted Date and Time:", formattedDateTime);

  // Function to get the transaction details
  const getTransactionDetails = async (transactionHash) => {
    try {
      const transactionDetails = await signer.provider.getTransaction(
        transactionHash
      );
      return transactionDetails;
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      return {};
    }
  };

  // Function to get the transaction receipt
  const viewTransactionOnEtherscan = async (transactionHash) => {
    try {
      const network = await signer.provider.getNetwork();
      const networkName = network.name;
      const etherscanUrl = `https://${networkName}.etherscan.io/tx/${transactionHash}`;
      return etherscanUrl;
    } catch (error) {
      console.error("Error fetching network details:", error);
      return "";
    }
  };

  // Function to save transactionHash to localStorage without duplicacy
  const savetransactionHashToLocalStorage = (transactionHash) => {
    let storedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];

    // Check if transactionHash already exists in the array
    if (!storedTransactions.includes(transactionHash)) {
      // Add transactionHash to top of the array
      storedTransactions = [transactionHash, ...storedTransactions];

      // Update localStorage
      localStorage.setItem("transactions", JSON.stringify(storedTransactions));
    }
  };

  // Function to retrieve all transactions hash from localStorage
  const retrieveAllTransactionsFromLocalStorage = () => {
    const storedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || {};
    return storedTransactions;
  };

  // Function to fetch reports using the data from the smart contract and IPFS
  const fetchReports = async () => {
    try {
      const fetchedReports = [];

      //For Event Created
      await fetchEvents().then((initialEvents) => {
        setEvents(initialEvents);
      });

      // Iterate over the array length of events
      for (let i = 0; i < events.length; i++) {
        const eventType = "EventCreated";
        const reportName = "Event Created";
        const reportDetails = events[i];
        const combinedData = { eventType, reportName, reportDetails }; // Combine data
        fetchedReports.push(combinedData);
      }

      //For Ticket Purchased
      const ticketHolderAddress = await ticketsContract.ticketHolderAddress();
      for (let i = 0; i < ticketHolderAddress.length; i++) {
        const ticketDetails = await ticketsContract.getTicket(
          ticketHolderAddress[i]
        );

        const reportDetails = ticketDetails.map((ticket) => ({
          userAddress: ticket.userAddress,
          eventCID: ticket.eventName,
          price: ticket.price.toString(), // Convert BigNumber to string
          purchaseTime: convertUnixTimestampToDateTime(
            ticket.purchaseTime.toNumber()
          ), // Convert BigNumber to number and then to date/time
          ticketsOwned: ticket.ticketsOwned.toNumber(), // Convert BigNumber to number
        }));
        // console.log(reportDetails);
        const details = await Promise.all(
          ticketDetails.map(async (ticket) => {
            const detail = events.filter(
              (event) => event.eventCID === ticket.eventName
            );
            return {
              detail,
            };
          })
        );
        // console.log(details);
        const ticketHolder = ticketHolderAddress[i];
        const eventType = "TicketPurchased";
        const reportName = "Ticket Purchased";
        const combinedData = {
          eventType,
          reportName,
          reportDetails,
          details,
          ticketHolder,
        }; // Combine data
        fetchedReports.push(combinedData);
      }

      // For Organizer Registered
      // retrieve all the organizer CID from the smart contract and store it in organizerCids
      const organizerCids = await ticketsContract.getAllOrganizerCID();
      // console.log(storedCids);

      // Iterate over the array length of organizer storedCids
      for (let i = 0; i < organizerCids.length; i++) {
        const ipfsCid = organizerCids[i];
        const reportDetails = await retrieveFromIPFS(ipfsCid);
        const eventType = "OrganizerRegistered";
        const reportName = "Register Event Organizer";
        const combinedData = { ipfsCid, eventType, reportName, reportDetails }; // Combine data
        fetchedReports.push(combinedData);
      }

      return fetchedReports;
    } catch (error) {
      console.error("Error fetching reports:", error);
      return [];
    }
  };

  const createNotification = (newNotification) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = [...prevNotifications, newNotification];
      localStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
      );
      return updatedNotifications;
    });
  };

  const contextValue = {
    isUserConnected,
    setUserConnected,
    isEventOrganizer,
    setEventOrganizer,
    isAdmin,
    setAdmin,
    formatTime,
    account,
    accounts,
    reports,
    setReports,
    template,
    events,
    setEvents,
    fetchEvents,
    handleEventCreated,
    fetchReports,
    isSelected,
    setIsSelected,
    createNotification,
    setNotifications,
    notifications,
    hasNotifications,
    setHasNotifications,
    getTransactionDetails,
    viewTransactionOnEtherscan,
    savetransactionHashToLocalStorage,
    retrieveAllTransactionsFromLocalStorage,
    convertUnixTimestampToDateTime,
    Loading,
    setLoading,
  };

  const ticketContractAddress = contractAddresses.tickets;
  const contractadd = localStorage.getItem("contractAddress");
  useEffect(() => {
    async function fetchAccount() {
      try {
        if ((await account) !== "Not connected") {
          //console.log(account);
          setUserConnected(true);
          if (contractadd !== ticketContractAddress) {
            localStorage.setItem("contractAddress", ticketContractAddress);
            // console.log("contractAddress:", ticketContractAddress);
            localStorage.removeItem("notifications");
            localStorage.removeItem("transactions");
          }
          // Check if the user address is already registered as an event organizer or not.
          const isAlreadyOrganizer = await ticketsContract.isOrganizers(
            signer.getAddress()
          );
          const isOwner = await ticketsContract.isOwner(signer.getAddress());
          // console.log(isAlreadyOrganizer);
          // console.log(isOwner);
          if (isAlreadyOrganizer) {
            setEventOrganizer(true);
          } else {
            setEventOrganizer(false);
          }
          if (isOwner) {
            setAdmin(true);
          } else {
            setAdmin(false);
          }
          const storedNotifications = localStorage.getItem("notifications");
          const parsedNotifications = JSON.parse(storedNotifications);
          if (parsedNotifications.length > 0) {
            setHasNotifications(true);
          } else {
            setHasNotifications(false);
          }
        } else {
          setUserConnected(false);
        }
      } catch (error) {
        console.error("Error fetching account:", error);
      }
    }
    fetchAccount();
  }, [account, !account]);

  useEffect(() => {
    // Check if the user is online or not.
    if (reload === false) {
      setTimeout(() => {
        setReload(true);
      }, 5000);
    } else {
      localStorage.setItem("isOnline", isOnline);
      if (!isOnline) {
        toast.info("Internet is not connected.Check your connection.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        const newToastMessage = {
          notificationName: "Internet is not connected.Check your connection.",
        };

        createNotification(newToastMessage);
      } else if (isOnline) {
        toast.success("Internet connection reestablished.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        const newToastMessage = {
          notificationName: "Internet connection reestablished.",
        };

        createNotification(newToastMessage);
      }
    }

    const handleOnlineStatusChange = () => {
      setIsOnline(window.navigator.onLine);
    };
    // Event listener for online/offline status changes
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);
    window.addEventListener("beforeunload", setReload(true));

    return () => {
      // Remove event listeners when component unmounts
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
      window.removeEventListener("beforeunload", setReload(false));
    };
  }, [isOnline]);

  // Function to format time to AM/PM format
  function formatTime(time) {
    const formattedTime = new Date(`1970-01-01T${time}`);
    return formattedTime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export { AppProvider, useAppContext };
