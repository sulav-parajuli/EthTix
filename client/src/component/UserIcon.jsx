import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
// import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import "./css/UserIcon.css";
import { useAppContext } from "./AppContext";

const UserIcon = () => {
  const { setConnected } = useAppContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

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

    setConnected(false); // Set isConnected to false when logging out
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    if (isSmallScreen) {
      setDropdownOpen(true);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`user-icon-container ${isSmallScreen ? "nav-list" : ""}`}
      onClick={handleToggleDropdown}
    >
      <div className="user-icon-image">
        {/* <FontAwesomeIcon icon={faUser} /> */}
        <FontAwesomeIcon icon={faCircleUser} />
      </div>
      {isDropdownOpen && (
        <div className={"user-dropdown"}>
          <Link to="/mytickets" className="nav-item">
            My Tickets
          </Link>
          <Link to="/createevent" className="nav-item">
            Create Events
          </Link>
          <button className="nav-item" onClick={handleDisconnect}>
            Disconnect Wallet
          </button>
        </div>
      )}
      {isSmallScreen && (
        <>
          <Link to="/mytickets" className="nav-item">
            My Tickets
          </Link>
          <Link to="/createevent" className="nav-item">
            Create Events
          </Link>
          <button className="nav-item" onClick={handleDisconnect}>
            Disconnect Wallet
          </button>
        </>
      )}
    </div>
  );
};

export default UserIcon;
