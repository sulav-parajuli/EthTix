import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//Import css
import "../assets/css/Admin.css";
import "../assets/css/UserIcon.css";
//Import etherTix logo
import etherTixLogo from "../assets/images/logo/etherTixlogooff.png";
//Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import {
  faGauge,
  faCalendarPlus,
  faScrewdriverWrench,
  // faBook,
  faBell,
  faRightFromBracket,
  faUsers,
  faCalendarCheck,
  faChartLine,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import report from "../assets/images/reports.png";
//Import Other Components
import { useAppContext } from "./AppContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
import CreateEvent from "./CreateEvent";
import AdminEvents from "./AdminEvents";
import Login from "./Login";
import ErrorPage from "./ErrorPage";
import Reports from "./Reports";
import Users from "./Users";
import Dashboard from "./Dashboard";
import MyTickets from "./MyTickets";
import NotificationDropdown from "./NotificationDropdown";

const Popup = ({ isOpen, onClose, state }) => {
  return isOpen ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close" onClick={onClose}>
          Close
        </button>
        <Login state={state} />
      </div>
    </div>
  ) : null;
};

const Admin = ({ state }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isSidenavOpen, setSidenavOpen] = useState(false);
  const {
    account,
    isUserConnected,
    isEventOrganizer,
    setUserConnected,
    isAdmin,
    isSelected,
    setIsSelected,
    createNotification,
    hasNotifications,
  } = useAppContext();
  const navigate = useNavigate();
  useEffect(() => {
    //hide top navbar and footer while dashboard component is opened.
    document.querySelector(".topnav").style.display = "none";
    document.querySelector(".footer-container").style.display = "none";
  }, []);

  useEffect(() => {
    const handleBackButton = () => {
      //show top navbar and footer while dashboard component is not opened.
      //this function gets invoked when user press back button on their browser from dashboard component.
      document.querySelector(".topnav").style.display = "flex";
      document.querySelector(".footer-container").style.display = "block";
    };

    const handlePopState = (event) => {
      if (event.state && event.state.backButtonPressed) {
        handleBackButton();
      }
    };

    // Add the event listener when the component mounts
    window.addEventListener("popstate", handlePopState);

    // Push a state object onto the history stack
    navigate({ state: { backButtonPressed: false } });

    // Modify the state object when the user presses the back button
    navigate({ state: { backButtonPressed: true } });

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    if (isUserConnected) {
      setPopupOpen(false);
      document.body.classList.remove("popup-open"); // Allow scrolling
    }
  }, [isUserConnected]);

  useEffect(() => {
    if (isSelected === "mytickets") {
      document.querySelector(".ticketcontainer").classList.remove("mcontainer");
    }
  }, [isSelected === "mytickets"]);

  const handleToggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const handleToggleNotification = () => {
    setNotificationOpen(!isNotificationOpen);
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
    toast.info("disconnecting...", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
    });
    const newToastMessage = {
      notificationName: "Wallet disconnected, redirecting to home page.",
    };

    createNotification(newToastMessage);
    setTimeout(() => {
      toast.error("You are not event organizer.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
      window.open("/", "_self"); // Redirect to home page
    }, 1000);
  };

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

  const handleSelectItem = (item) => {
    setIsSelected(item);
    setSidenavOpen(false);
    document.querySelector(".nav-link.active").classList.remove("active");
  };

  const handleOpenSidenav = () => {
    setSidenavOpen((prev) => !prev);
  };

  const handleOpenSetting = () => {
    setSettingsOpen((prev) => !prev);
  };

  return (
    <>
      {(isEventOrganizer && isUserConnected) || (isAdmin && isUserConnected) ? (
        <div
          className={`g-sidenav-show ${
            isSidenavOpen ? "g-sidenav-pinned" : ""
          }`}
        >
          <aside
            className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3"
            id="sidenav-main"
          >
            <div className="sidenav-header">
              <i
                className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
                aria-hidden="true"
                id="iconSidenav"
              ></i>
              <a className="navbar-brand m-0" href="/" target="_blank">
                <img
                  src={etherTixLogo}
                  className="navbar-brand-img h-100"
                  alt="main_logo"
                />
                {/*<span className="ms-1 font-weight-bold text-white"
        >EthTix</span
      >*/}
              </a>
            </div>

            <hr className="horizontal light mt-0 mb-2" />

            <div
              className="collapse navbar-collapse w-auto"
              id="sidenav-collapse-main"
            >
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a
                    className={`nav-link text-white ${
                      isSelected === "dashboard" ? "active" : ""
                    }`}
                    onClick={() => handleSelectItem("dashboard")}
                  >
                    <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                      <FontAwesomeIcon icon={faGauge} />
                    </div>

                    <span className="nav-link-text ms-1">Dashboard</span>
                  </a>
                </li>

                {isEventOrganizer && isUserConnected && !isAdmin ? (
                  <li className="nav-item">
                    <a
                      className={`nav-link text-white ${
                        isSelected === "createevent" ? "active" : ""
                      }`}
                      onClick={() => handleSelectItem("createevent")}
                    >
                      <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon icon={faCalendarPlus} />
                      </div>
                      <span className="nav-link-text ms-1">Create Event</span>
                    </a>
                  </li>
                ) : null}

                {/* <li className="nav-item">
                  <a
                    className={`nav-link text-white ${
                      isSelected === "tools" ? "active" : ""
                    }`}
                    onClick={() => handleSelectItem("tools")}
                  >
                    <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                      <FontAwesomeIcon icon={faScrewdriverWrench} />
                    </div>

                    <span className="nav-link-text ms-1">Tools</span>
                  </a>
                </li> */}

                {/* <li className="nav-item">
                  <a
                    className={`nav-link text-white ${
                      isSelected === "notification" ? "active" : ""
                    }`}
                    onClick={() => handleSelectItem("notification")}
                  >
                    <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                      <FontAwesomeIcon icon={faBell} />
                    </div>

                    <span className="nav-link-text ms-1">Notifications</span>
                  </a>
                </li> */}

                <li className="nav-item mt-3">
                  <h6 className="ps-4 ms-2 text-xs font-weight-bold text-start opacity-8">
                    Insight
                  </h6>
                </li>

                <li className="nav-item">
                  <a
                    className={`nav-link text-white ${
                      isSelected === "reports" ? "active" : ""
                    }`}
                    onClick={() => handleSelectItem("reports")}
                  >
                    <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                      {/* <FontAwesomeIcon icon={faBook} /> */}
                      <img
                        src={report}
                        style={{ height: "1.3em", alignSelf: "center" }}
                      />
                    </div>

                    <span className="nav-link-text ms-1">Reports</span>
                  </a>
                </li>

                {/* <li className="nav-item">
                  <a
                    className={`nav-link text-white ${
                      isSelected === "analytics" ? "active" : ""
                    }`}
                    onClick={() => handleSelectItem("analytics")}
                  >
                    <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                      <FontAwesomeIcon icon={faChartLine} />
                    </div>

                    <span className="nav-link-text ms-1">Analytics</span>
                  </a>
                </li> */}

                <li className="nav-item">
                  <a
                    className={`nav-link text-white ${
                      isSelected === "users" ? "active" : ""
                    }`}
                    onClick={() => handleSelectItem("users")}
                  >
                    <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>

                    <span className="nav-link-text ms-1">Users</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className={`nav-link text-white ${
                      isSelected === "events" ? "active" : ""
                    }`}
                    onClick={() => handleSelectItem("events")}
                  >
                    <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                      <FontAwesomeIcon icon={faCalendarCheck} />
                    </div>

                    <span className="nav-link-text ms-1">Events</span>
                  </a>
                </li>
                {isUserConnected ? (
                  <li className="nav-item">
                    <a
                      className="nav-link text-white"
                      onClick={() => handleDisconnect()}
                    >
                      <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon icon={faRightFromBracket} />
                      </div>

                      <span className="nav-link-text ms-1">Disconnect</span>
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          </aside>
          <main className="main-content border-radius-lg">
            {/* Navbar*/}
            <nav
              className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
              id="navbarBlur"
              data-scroll="true"
            >
              <div className="container-fluid py-1 px-3">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                    <li className="breadcrumb-item text-sm">
                      {isSelected === "createevent" ? (
                        <>
                          <FontAwesomeIcon icon={faCalendarPlus} />
                          &nbsp; Create Event
                        </>
                      ) : isSelected === "dashboard" ? (
                        <>
                          <FontAwesomeIcon icon={faGauge} />
                          &nbsp; Dash Board
                        </>
                      ) : isSelected === "tools" ? (
                        <>
                          <FontAwesomeIcon icon={faScrewdriverWrench} />
                          &nbsp; Tools
                        </>
                      ) : isSelected === "reports" ? (
                        <>
                          {/* <FontAwesomeIcon icon={faBook} /> */}
                          <img
                            src={report}
                            style={{ height: "1.3em", alignSelf: "center" }}
                          />
                          &nbsp; Reports
                        </>
                      ) : isSelected === "notification" ? (
                        <>
                          <FontAwesomeIcon icon={faBell} />
                          &nbsp; Notifications
                        </>
                      ) : isSelected === "analytics" ? (
                        <>
                          <FontAwesomeIcon icon={faChartLine} />
                          &nbsp; Analytics
                        </>
                      ) : isSelected === "users" ? (
                        <>
                          <FontAwesomeIcon icon={faUsers} />
                          &nbsp; Users
                        </>
                      ) : isSelected === "events" ? (
                        <>
                          <FontAwesomeIcon icon={faCalendarCheck} />
                          &nbsp; Events
                        </>
                      ) : (
                        ""
                      )}
                    </li>
                  </ol>
                </nav>
                <div
                  className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
                  id="navbar"
                >
                  {/*Search Bar*/}
                  {/*<div className="ms-md-auto pe-md-3 d-flex align-items-center">
              <div className="input-group input-group-outline">
                <label className="form-label">Type here...</label>
                <input type="text" className="form-control" />
              </div>
            </div>*/}
                  <ul className="navbar-nav justify-content-end">
                    <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                      <a
                        className="nav-link text-body p-0"
                        id="iconNavbarSidenav"
                        onClick={handleOpenSidenav}
                      >
                        <div className="sidenav-toggler-inner">
                          <i className="sidenav-toggler-line"></i>
                          <i className="sidenav-toggler-line"></i>
                          <i className="sidenav-toggler-line"></i>
                        </div>
                      </a>
                    </li>
                    <li className="nav-item px-3 d-flex align-items-center">
                      <a
                        className="nav-link text-body p-0"
                        onClick={handleOpenSetting}
                      >
                        <FontAwesomeIcon icon={faGear} />
                      </a>
                    </li>
                    <li className="nav-item dropdown pe-2 d-flex align-items-center">
                      <a
                        className="nav-link text-body p-0"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="true"
                        onClick={handleToggleNotification}
                      >
                        <FontAwesomeIcon icon={faBell} />
                        {/* Display small dot if there are notifications */}
                        {hasNotifications && (
                          <div className="notification-dot" />
                        )}
                      </a>
                      {isNotificationOpen && <NotificationDropdown />}
                    </li>
                    <li className="nav-item dropdown pe-2 d-flex align-items-center">
                      <div className="logincontainer">
                        {isUserConnected ? (
                          <div
                            className="user-icon-container"
                            onClick={handleToggleDropdown}
                          >
                            <div className="usericonimage">
                              {/* <FontAwesomeIcon icon={faUser} /> */}
                              <FontAwesomeIcon icon={faCircleUser} />
                            </div>
                            {isDropdownOpen && (
                              <div className="userdropdown">
                                {isEventOrganizer || isAdmin ? null : (
                                  <div
                                    className="nav-item"
                                    onClick={() =>
                                      handleSelectItem("mytickets")
                                    }
                                  >
                                    My Tickets
                                  </div>
                                )}
                                <div
                                  className="nav-item"
                                  onClick={() => {
                                    window.open("/", "_self");
                                  }}
                                >
                                  Open Home Page
                                </div>
                                <div
                                  className="nav-item"
                                  onClick={handleDisconnect}
                                >
                                  Disconnect
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            className="btn btn-outline-success login-button"
                            onClick={handleOpenPopup}
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
            <hr className="horizontal dark mt-4" />
            <Popup
              isOpen={isPopupOpen}
              onClose={handleClosePopup}
              state={state}
            />

            {/*End Navbar*/}

            <div className="container-fluid py-4">
              <div className="row">
                <div className=" position-relative z-index-2">
                  {isSelected === "createevent" && (
                    /* Render CreateEvent component when isSelected is 'createEvent' */
                    <CreateEvent state={state} />
                  )}
                  {isSelected === "events" && (
                    /* Render AdminEvents component when isSelected is 'Events' */
                    <AdminEvents state={state} />
                  )}
                  {isSelected === "reports" && (
                    /* Render Reports component when isSelected is 'reports' */
                    <Reports state={state} />
                  )}
                  {isSelected === "users" && (
                    /* Render Reports component when isSelected is 'reports' */
                    <Users state={state} />
                  )}
                  {isSelected === "dashboard" && (
                    /* Render Reports component when isSelected is 'reports' */
                    <Dashboard state={state} />
                  )}
                  {isSelected === "mytickets" && (
                    /* Render Reports component when isSelected is 'reports' */
                    <MyTickets state={state} />
                  )}

                  {/* Add more conditions for other components as needed */}

                  {/* ... (rest of your code) */}
                </div>
              </div>
            </div>
          </main>
          {isSettingsOpen ? (
            <div className="fixed-plugin">
              <a className="fixed-plugin-button text-dark position-fixed px-3 py-2">
                <i className="fa fa-cog fixed-plugin-button-nav cursor-pointer"></i>
              </a>
              <div className="card shadow-lg">
                <div className="card-header pb-0 pt-3">
                  <div className="float-start">
                    <h5 className="mt-3 mb-0">Settings</h5>
                  </div>
                  <div className="float-end mt-4">
                    <button
                      className="btn btn-link text-dark p-0 fixed-plugin-close-button"
                      onClick={handleOpenSetting}
                    >
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
                      </span>
                    </button>
                  </div>
                  {/* <!-- End Toggle Button --> */}
                </div>
                <hr className="horizontal dark my-1" />
                <div className="card-body pt-sm-3 pt-0">
                  {/* <!-- Sidebar Backgrounds --> */}
                  <div>
                    <h6 className="mb-0">Sidebar Colors</h6>
                  </div>

                  {/* <!-- Sidenav Type --> */}

                  <div className="mt-3">
                    <h6 className="mb-0">Sidenav Type</h6>
                    <p className="text-sm">
                      Choose between 2 different sidenav types.
                    </p>
                  </div>

                  <div className="d-flex">
                    <button
                      className="btn bg-gradient-dark px-3 mb-2 active"
                      data-class="bg-gradient-dark"
                    >
                      Dark
                    </button>
                    <button
                      className="btn bg-gradient-dark px-3 mb-2 ms-2"
                      data-class="bg-transparent"
                    >
                      Transparent
                    </button>
                    <button
                      className="btn bg-gradient-dark px-3 mb-2 ms-2"
                      data-class="bg-white"
                    >
                      White
                    </button>
                  </div>

                  <p className="text-sm d-xl-none d-block mt-2">
                    You can change the sidenav type just on desktop view.
                  </p>

                  {/* <!-- Navbar Fixed --> */}

                  <div className="mt-3 d-flex">
                    <h6 className="mb-0">Navbar Fixed</h6>
                    <div className="form-check form-switch ps-0 ms-auto my-auto">
                      <input
                        className="form-check-input mt-1 ms-auto"
                        type="checkbox"
                        id="navbarFixed"
                        // onClick={(e) => navbarFixed(e.target.checked)}
                      />
                    </div>
                  </div>

                  <hr className="horizontal dark my-3" />
                  <div className="mt-2 d-flex">
                    <h6 className="mb-0">Light / Dark</h6>
                    <div className="form-check form-switch ps-0 ms-auto my-auto">
                      <input
                        className="form-check-input mt-1 ms-auto"
                        type="checkbox"
                        id="dark-version"
                      />
                    </div>
                  </div>
                  <hr className="horizontal dark my-sm-4" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <ErrorPage />
      )}
    </>
  );
};

export default Admin;
