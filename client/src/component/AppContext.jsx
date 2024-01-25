import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify"; // Import toastify for displaying notifications
import { retrieveFromIPFS, uploadReportToIPFS } from "../utils/ipfsUtils";
// Import the contract addresses from the JSON file
import contractAddresses from "../../../contractAddresses.json";

const AppContext = createContext();

const AppProvider = ({ children, template, account, state }) => {
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
        toast.error("Contract not found", {
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

  const createReports = async () => {
    try {
      // Subscribe to the "OrganizerRegistered" event
      ticketsContract.on(
        "OrganizerRegistered",
        async (organizerAddress, CID) => {
          // console.log(
          //   "OrganizerRegistered event triggered:",
          //   organizerAddress,
          //   CID
          // );
          const details = await retrieveFromIPFS(CID);
          // console.log(details);
          // Create a new report for OrganizerRegistered event
          const newReport = {
            eventType: "OrganizerRegistered",
            reportName: "Register Event Organizer",
            details,
            organizerAddress,
            CID,
          };

          const data = JSON.stringify(newReport);
          //upload report to IPFS
          const { ipfsCid } = await uploadReportToIPFS(data);
          // console.log("IPFS CID:", ipfsCid);
          saveIpfsCidToLocalStorage(ipfsCid);
          // console.log("Report Created");
          // Fetch updated reports
          // const updatedReports = await fetchReports();
          // // Update the reports state
          // setReports(updatedReports);
        }
      );

      // Subscribe to the "EventCreated" event
      ticketsContract.on(
        "EventCreated",
        async (eventId, organizer, eventCid) => {
          // console.log("EventCreated event triggered:", eventId.toString(), organizer);

          const details = await retrieveFromIPFS(eventCid);
          // console.log(details);
          // Create a new report for EventCreated event
          const newReport = {
            eventType: "EventCreated",
            reportName: "Event Created",
            eventId,
            organizer,
            details,
            eventCid,
          };

          const data = JSON.stringify(newReport);
          //upload report to IPFS
          const { ipfsCid } = await uploadReportToIPFS(data);
          // console.log("IPFS CID:", ipfsCid);
          saveIpfsCidToLocalStorage(ipfsCid);
          // console.log("Report Created");
          // Fetch updated reports
          // const updatedReports = await fetchReports();
          // // Update the reports state
          // setReports(updatedReports);
        }
      );

      // Subscribe to the "TicketPurchased" event
      ticketsContract.on(
        "TicketPurchased",
        async (eventId, ticketsBought, buyer) => {
          // console.log(
          //   "TicketPurchased event triggered:",
          //   eventId,
          //   ticketsBought,
          //   buyer
          // );

          // Create a new report for TicketPurchased event
          const newReport = {
            eventType: "TicketPurchased",
            reportName: "Ticket Purchased",
            eventId,
            ticketsBought,
            buyer,
          };

          const data = JSON.stringify(newReport);
          //upload report to IPFS
          const { ipfsCid } = await uploadReportToIPFS(data);
          // console.log("IPFS CID:", ipfsCid);
          saveIpfsCidToLocalStorage(ipfsCid);
          // console.log("Report Created");
          // // Fetch updated reports
          // const updatedReports = await fetchReports();
          // // Update the reports state
          // setReports(updatedReports);
        }
      );
    } catch (error) {
      console.error("Error subscribing to events and creating reports:", error);
    }
  };

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

  // Function to save IPFS CIDs to localStorage without duplicacy
  const saveIpfsCidToLocalStorage = (ipfsCid) => {
    let storedCids = JSON.parse(localStorage.getItem("ipfsCids")) || [];

    // Check if ipfsCid already exists in the array
    if (!storedCids.includes(ipfsCid)) {
      // Add ipfsCid to top of the array
      storedCids = [ipfsCid, ...storedCids];

      // Update localStorage
      localStorage.setItem("ipfsCids", JSON.stringify(storedCids));
    }
  };

  // Function to retrieve all IPFS CIDs from localStorage
  const retrieveAllIpfsCidsFromLocalStorage = () => {
    const storedCids = JSON.parse(localStorage.getItem("ipfsCids")) || {};
    return storedCids;
  };

  // Function to retrieve all IPFS CIDs from localStorage
  const retrieveAllTransactionsFromLocalStorage = () => {
    const storedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || {};
    return storedTransactions;
  };

  // Function to fetch reports using IPFS CIDs from localStorage
  const fetchReports = async () => {
    try {
      const fetchedReports = [];

      const storedCids = retrieveAllIpfsCidsFromLocalStorage();
      // console.log(storedCids);

      // Iterate over the array length of storedCids
      for (let i = 0; i < storedCids.length; i++) {
        const ipfsCid = storedCids[i];
        const reportDetails = await retrieveFromIPFS(ipfsCid);
        fetchedReports.push(reportDetails);
      }

      return fetchedReports;
    } catch (error) {
      console.error("Error fetching reports from localStorage:", error);
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
    reports,
    setReports,
    template,
    events,
    setEvents,
    fetchEvents,
    handleEventCreated,
    createReports,
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
  };

  const ticketContractAddress = contractAddresses.tickets;
  const contractadd = localStorage.getItem("contractAddress");
  useEffect(() => {
    async function fetchAccount() {
      try {
        if ((await account) !== "Not connected") {
          //console.log(account);
          setUserConnected(true);
          // Listen to every events emitted by the smart contract.
          createReports();
          if (contractadd !== ticketContractAddress) {
            localStorage.setItem("contractAddress", ticketContractAddress);
            // console.log("contractAddress:", ticketContractAddress);
            localStorage.removeItem("ipfsCids");
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
        toast.error("Internet is not connected.Check your connection.", {
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
