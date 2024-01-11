import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify"; // Import toastify for displaying notifications

const AppContext = createContext();

const AppProvider = ({ children, template, account, state }) => {
  const [reload, setReload] = useState(false); // sets to true when user tries to reload the page
  const [isUserConnected, setUserConnected] = useState(false);
  const [isEventOrganizer, setEventOrganizer] = useState(false);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine); // Check if the user is online or not.
  const { signer, ticketsContract } = state;
  const contextValue = {
    isUserConnected,
    setUserConnected,
    isEventOrganizer,
    setEventOrganizer,
    formatTime,
    account,
    template,
  };

  useEffect(() => {
    async function fetchAccount() {
      try {
        if ((await account) !== "Not connected") {
          //console.log(account);
          setUserConnected(true);
          // Check if the user address is already registered as an event organizer or not.
          const isAlreadyOrganizer = await ticketsContract.isOrganizers(
            signer.getAddress()
          );
          // console.log(isAlreadyOrganizer);
          if (isAlreadyOrganizer) {
            setEventOrganizer(true);
          } else {
            setEventOrganizer(false);
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
