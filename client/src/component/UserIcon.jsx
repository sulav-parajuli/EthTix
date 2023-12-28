import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
// import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/UserIcon.css";
import { useAppContext } from "./AppContext";

const UserIcon = () => {
  const { setConnected, setUserConnected, isEventOrganizer } = useAppContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const handleToggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleDisconnect = () => {
    // Your logout logic goes here

    // Disconnect the wallet by clearing the provider
    if (window.ethereum && window.ethereum.removeAllListeners) {
      // Remove all listeners to prevent memory leaks
      window.ethereum.removeAllListeners();
    }

    // Additional cleanup if needed

    setUserConnected(false); // Set isUserConnected to false when logging out
    setConnected(false); // Set isConnected to false when logging out
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setIsSmallScreen(true);
        setDropdownOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setDropdownOpen(true);
  }, [isSmallScreen]);

  return (
    <div
      className={`user-icon-container ${isSmallScreen ? "nav-list" : ""}`}
      onClick={handleToggleDropdown}
    >
      {!isSmallScreen ? (
        <div className="user-icon-image">
          {/* <FontAwesomeIcon icon={faUser} /> */}
          <FontAwesomeIcon icon={faCircleUser} />
        </div>
      ) : null}
      {isDropdownOpen && (
        <div className={"user-dropdown"}>
          <Link to="/mytickets" className="nav-item">
            My Tickets
          </Link>
          {isEventOrganizer ? (
            <Link to="/dashboard" className="nav-item">
              Open Dashboard
            </Link>
          ) : null}
          <div className="nav-item" onClick={handleDisconnect}>
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default UserIcon;
