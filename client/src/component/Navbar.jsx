import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
//Import etherTix logo
import etherTixLogo from "../assets/images/logo/etherTixlogooff.png";
import { useAppContext } from "./AppContext";
//Import other components
import Login from "./Login";
import UserIcon from "./UserIcon"; // Import your user icon component

const Popup = ({ isOpen, onClose, state }) => {
  return isOpen ? (
    <div className="popup popuptop">
      <div className="popup-inner">
        <button className="btn-close close m-3" onClick={onClose}></button>
        <Login state={state} />
      </div>
    </div>
  ) : null;
};

//Navbar containaing home , Events, about us and login button
const Navbar = ({ state }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isNavbarOpen, setNavbarOpen] = useState(false);
  const { setUserConnected, account, isUserConnected } = useAppContext();

  useEffect(() => {
    if (isUserConnected) {
      setPopupOpen(false);
      document.body.classList.remove("popup-open"); // Allow scrolling
    }
  }, [isUserConnected]);

  const handleOpenPopup = () => {
    setPopupOpen(true);
    document.body.classList.add("popup-open"); // Prevent scrolling
    document.querySelector(".App").background = "rgba(0,0,0,0.9)";
    // If you want to close the popup after successful connection
    if (isUserConnected) {
      setPopupOpen(false);
    }
  };

  const handleClosePopup = async () => {
    if ((await account) !== "Not connected") {
      setUserConnected(true);
    } else {
      setUserConnected(false);
    }
    setPopupOpen(false);
    document.body.classList.remove("popup-open"); // Allow scrolling
  };

  const handleToggleNavbar = () => {
    setNavbarOpen((prev) => !prev);
  };
  return (
    <>
      <nav className="navbar topnav navbar-expand-lg fixed-top mb-5">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand ms-5 logo">
            <img src={etherTixLogo} alt="EtherTix Logo" />
            {/* <div className="ethtix">EthTix</div> */}
          </Link>
          <button
            className="navbar-toggler navbarmenu"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={handleToggleNavbar}
          >
            {isNavbarOpen ? (
              // <span>&#10006;</span> //bold X
              <span style={{ width: "1.5em", height: "1.5em" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span> //normal X
            ) : (
              <span className="navbar-toggler-icon"></span>
            )}
          </button>
          <div
            className={`collapse navbar-collapse navbaritems ${
              isNavbarOpen ? "show" : ""
            }`}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav item me-auto mb-lg-0">
              <li className="nav-item ms-5">
                <Link to="/" className="nav-link active" aria-current="page">
                  Home
                </Link>
              </li>
              <li className="nav-item ms-5">
                <Link to="/events" className="nav-link active">
                  Browse Event
                </Link>
              </li>
              <li className="nav-item ms-5">
                <Link to="/about" className="nav-link active">
                  About
                </Link>
              </li>
            </ul>
            <div className="logincontainer">
              {isUserConnected ? (
                <UserIcon /> // Render user icon when logged in
              ) : (
                <button
                  className="btn btn-outline-success login-button"
                  onClick={handleOpenPopup}
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
        {isNavbarOpen ? <div className="Menuitem"></div> : null}
      </nav>
      <Popup isOpen={isPopupOpen} onClose={handleClosePopup} state={state} />
    </>
  );
};

export default Navbar;
