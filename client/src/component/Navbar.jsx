import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
//Import etherTix logo
import etherTixLogo from "../assets/images/logo/etherTixlogo3.png";
// import Hamburger from "hamburger-react";
// import { useClickAway } from "react-use";
import { useAppContext } from "./AppContext";
//Import other components
import Login from "./Login";
import UserIcon from "./UserIcon"; // Import your user icon component

const Popup = ({ isOpen, onClose }) => {
  return isOpen ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close" onClick={onClose}>
          Close
        </button>
        <Login />
      </div>
    </div>
  ) : null;
};

//Navbar containaing home , Events, about us and login button
const Navbar = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  // const [isMenuOpen, setMenuOpen] = useState(false);
  // const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { isConnected, setConnected, account } = useAppContext();
  // const ref = useRef(null);

  // useClickAway(ref, () => setMenuOpen(false));

  const handleOpenPopup = () => {
    setPopupOpen(true);
    // If you want to close the popup after successful connection
    if (isConnected) {
      setPopupOpen(false);
    }
  };

  const handleClosePopup = async () => {
    setPopupOpen(false);
    if ((await account) !== "Not connected") {
      setConnected(true);
    } else {
      setConnected(false);
    }
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-light fixed-top mb-5">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand ms-5 logo">
            <img src={etherTixLogo} alt="EtherTix Logo" />
            {/* EthTix */}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
            </ul>
            <div className="logincontainer">
              {isConnected ? (
                <UserIcon /> // Render user icon when logged in
              ) : (
                <button
                  className="btn btn-outline-success login-button"
                  onClick={handleOpenPopup}
                >
                  Connect
                </button>
              )}
              <Popup isOpen={isPopupOpen} onClose={handleClosePopup} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

// useEffect(() => {
//   const handleResize = () => {
//     setIsLargeScreen(window.innerWidth > 768);
//   };

//   handleResize(); // Set initial screen size
//   window.addEventListener("resize", handleResize);

//   return () => {
//     window.removeEventListener("resize", handleResize);
//   };
// }, []);
// useEffect(() => {
//   // Additional logic you may want to execute when isConnected changes
//   // For example, fetching user data, updating UI, etc.
//   const logincontainer = document.querySelector(".logincontainer");
//   if (isConnected) {
//     if (logincontainer) {
//       logincontainer.style.paddingTop = "0px";
//     }
//   }
// }, [isConnected]);

// const handleToggleMenu = () => {
//   setMenuOpen(!isMenuOpen);
// };

// return (
//   <div className="navbar">
//     <div className="logo">

//     </div>

//     <ul
//       className={`nav-list ${isLargeScreen || isMenuOpen ? "open" : ""}`}
//       ref={ref}
//     >
//       {isLargeScreen || isMenuOpen ? (
//         <>
//           <Link to="/" className="nav-item">
//             Home
//           </Link>
//           <Link to="/events" className="nav-item">
//             Events
//           </Link>
//           <Link to="/" className="nav-item">
//             About Us
//           </Link>
//           <Link to="/contact" className="nav-item">
//             Contact
//           </Link>
//           <div className="loginmenu">
//             {isConnected ? (
//               <UserIcon /> // Render user icon when logged in
//             ) : (
//               <button onClick={handleOpenPopup}>Connect</button>
//             )}
//             <Popup
//               isOpen={isPopupOpen}
//               onClose={handleClosePopup}
//               onConnect={handleWalletConnect}
//             />
//           </div>
//         </>
//       ) : null}
//     </ul>

//     <div className="logincontainer">
//       {isConnected ? (
//         <UserIcon /> // Render user icon when logged in
//       ) : (
//         <button className="login-button" onClick={handleOpenPopup}>
//           Connect
//         </button>
//       )}
//       <Popup
//         isOpen={isPopupOpen}
//         onClose={handleClosePopup}
//         onConnect={handleWalletConnect}
//       />
//     </div>
//     <div className="menu-container">
//       <div className="menu" onClick={handleToggleMenu}>
//         <Hamburger toggled={isMenuOpen} size={20} direction="right" />
//       </div>
//     </div>
//   </div>
// );
