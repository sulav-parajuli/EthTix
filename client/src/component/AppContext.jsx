import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify"; // Import toastify for displaying notifications
import { retrieveFromIPFS } from "../utils/ipfsUtils";

const AppContext = createContext();

const AppProvider = ({ children, template, account, state }) => {
  const [isConnected, setConnected] = useState(false);
  const [reload, setReload] = useState(false); // sets to true when user tries to reload the page
  const [isUserConnected, setUserConnected] = useState(false);
  const [isEventOrganizer, setEventOrganizer] = useState(false);
  const [rememberme, setRememberme] = useState(false);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine); // Check if the user is online or not.
  const { userContract, eventOrganizerContract } = state;
  const contextValue = {
    isConnected,
    setConnected,
    isUserConnected,
    setUserConnected,
    isEventOrganizer,
    setEventOrganizer,
    rememberme,
    setRememberme,
    account,
    template,
  };

  useEffect(() => {
    async function fetchAccount() {
      try {
        if ((await account) !== "Not connected") {
          //console.log(account);
          setConnected(true);
        } else {
          setConnected(false);
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
      } else if (isOnline) {
        toast.success("Internet connection reestablished.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
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

  useEffect(() => {
    if (isConnected === true) {
      userSession();
    }
  }, [isConnected]);

  async function userSession() {
    try {
      const eventorg = localStorage.getItem("isEventOrganizer");
      const user = localStorage.getItem("isUserConnected");
      const remember = localStorage.getItem("rememberme");
      const username = localStorage.getItem("username");
      const userAddress = localStorage.getItem("userAddress");
      if (eventorg === "true") {
        setEventOrganizer(true);
      }
      if (user === "true") {
        setUserConnected(true);
      }
      if (remember === "true") {
        if (userAddress === account) {
          //check if user is registered or not
          const userCID = await userContract.getUserCID(userAddress);
          const retrievedData = await retrieveFromIPFS(userCID);
          const userAddresss = retrievedData.userAddress;
          const usernamee = retrievedData.username;
          // console.log(userAddresss);
          // console.log(usernamee);
          if (userAddress === userAddresss && username === usernamee) {
            setUserConnected(true); // Set isUserConnected to true when user gets logged in
            localStorage.setItem("isUserConnected", true);
            //check if user is event organizer or not.
            const eventorgCID = await eventOrganizerContract.getOrganizerCID(
              userAddress
            );
            // console.log(eventorgCID);
            if (eventorgCID !== "") {
              setEventOrganizer(true);
            } else {
              setEventOrganizer(false);
            }
          } else {
            toast.error(
              "You are not a valid user. Register first to continue.",
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
            return;
          }
        }
      } else if (remember === "false") {
        localStorage.removeItem("username");
        localStorage.removeItem("userAddress");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isConnected !== true) {
      setUserConnected(false);
      localStorage.setItem("isUserConnected", isUserConnected);
    }
  }, [!isConnected]);

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
