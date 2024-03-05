import { React, useState, useEffect } from "react";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
import { signData, uploadToIPFS } from "../utils/ipfsUtils";
import OrganizerTerms from "./OrganizerTerms";

const Popup = ({ isOpen, onClose, onConfirm }) => {
  return isOpen ? (
    <div className="popup popuptop">
      <div className="card mb-5">
        <OrganizerTerms onConfirm={onConfirm} />
      </div>
    </div>
  ) : null;
};

const EventOrganizer = ({ state }) => {
  const [nextpage, setNextpage] = useState(false);

  const {
    setEventOrganizer,
    account,
    createNotification,
    savetransactionHashToLocalStorage,
    isAdmin,
  } = useAppContext();
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [organizationType, setOrganizationType] = useState("");
  const [organizationLocation, setOrganizationLocation] = useState("");
  const [organizationEmail, setOrganizationEmail] = useState("");
  const { signer, ticketsContract } = state;
  const [agreetermsconditions, setagreetermsconditions] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  // Define state variables for date and time
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate(); //to redirect to another page
  //console.log(state);
  const buttonPressed = () => {
    setNextpage(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [ticketsContract]);

  const opendashboard = () => {
    document.body.classList.remove("popup-open"); // Allow scrolling
    navigate("/dashboard");
  };
  const handleTermsConditions = () => {
    setShowTerms(true);
  };

  const handlePopupConfirm = () => {
    setShowTerms(false);

    setagreetermsconditions(true);
  };

  function NavigateOrganizerTerms() {
    document.body.classList.remove("popup-open"); // Allow scrolling
    document.querySelector(".topnav").style.background = "transparent";
    navigate("/terms");
  }

  const handleEventOrganizer = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      document.querySelector(".popup-inner").style.backgroundColor =
        "transparent";
      document.querySelector(".close").style.display = "none";
      //Validation of data
      if (
        !name ||
        !organizationName ||
        !organizationType ||
        !organizationLocation ||
        !organizationEmail
      ) {
        toast.info("Please fill all the fields.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        const newToastMessage = {
          notificationName: "Please fill all the fields.",
        };

        createNotification(newToastMessage);
        return;
      }
      // console.log(ticketsContract);
      // Check if the address is already registered as an event organizer
      if (!ticketsContract) {
        console.log("Contract not deployed");
        toast.warning(
          "Contract not deployed. Please deploy the contract first.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        const newToastMessage = {
          notificationName: "Contract not deployed.",
        };

        createNotification(newToastMessage);
      }
      const isAlreadyOrganizer = await ticketsContract.isOrganizers(account);
      // console.log(isAlreadyOrganizer);
      if (isAlreadyOrganizer) {
        // const eventorgCID = await ticketsContract.getOrganizerCID(
        //   userAddress
        // );
        // console.log(eventorgCID);
        // if (!eventorgCID) {
        setEventOrganizer(true);
        setIsLoading(false);
        toast.success(
          "This address is already registered as an event organizer.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        const newToastMessage = {
          notificationName: "This address is already registered.",
        };

        createNotification(newToastMessage);
      } else {
        setEventOrganizer(false);
      }
      const eventOrganizerData = {
        name,
        organizerAddress: account,
        organizationName,
        organizationType,
        organizationLocation,
        organizationEmail,
        currentTime,
      };
      // console.log(eventOrganizerData);
      //signdata
      const { data, signature } = await signData(
        signer,
        JSON.stringify(eventOrganizerData)
      );

      //upload to ipfs
      const { ipfsCid } = await uploadToIPFS(data, signature);
      console.log(ipfsCid);
      const transaction = await ticketsContract.registerEventOrganizer(ipfsCid);
      await transaction.wait();
      const TransactionHash = await transaction.hash;
      savetransactionHashToLocalStorage(TransactionHash);
      // console.log("Transaction Hash:", TransactionHash);
      setEventOrganizer(true);
      toast.success(
        "Successful! You are now registered as an event organizer",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      const newToastMessage = {
        notificationName:
          "Successful! You are now registered as an event organizer",
      };

      createNotification(newToastMessage);
      //You might require local storage or session storage. It helps to set cookies.
      // localStorage.setItem("isEventOrganizer", isEventOrganizer);
      opendashboard();
      // }
      // }
    } catch (error) {
      console.log(error);
      toast.error("Error Occured!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      const newToastMessage = {
        notificationName: "Error Occurred.",
      };

      createNotification(newToastMessage);
    } finally {
      setIsLoading(false);
      document.querySelector(".popup-inner").style.backgroundColor = "white";
      document.querySelector(".close").style.display = "block";
    }
  };

  return (
    <div className="container mt-5">
      {isLoading ? (
        <Triangle
          visible={true}
          height="80"
          width="80"
          color="#008eb0"
          ariaLabel="triangle-loading"
          wrapperStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // 100% of the viewport height
          }}
          wrapperClass=""
        />
      ) : (
        <div className="row">
          <div className="col-md-8 offset-md-2">
            {nextpage ? (
              <>
                {isAdmin ? (
                  <>
                    <h2 className="text-center mb-4">You are the Admin.</h2>
                    <div className="text-justify">
                      <p>
                        As per our privacy policy, Admins cannot create events.
                        If you are an event organizer and wish to create events,
                        please proceed with a different account and register as
                        an event organizer to unlock event creation privileges.
                      </p>
                      {/* Add more disclaimer content as needed */}
                    </div>
                    <div className="text-center mt-4">
                      <button
                        className="sub-button"
                        onClick={() => {
                          setNextpage(false);
                        }}
                      >
                        Back
                      </button>
                      <button className="sub-button" onClick={opendashboard}>
                        Open Dashboard
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <h2 className="text-center mb-4">
                      Enter your organization details.
                    </h2>
                    <form>
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Enter your Name*"
                          className="form-control"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Enter your organization name*"
                          className="form-control"
                          id="organizationname"
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Type of organization*"
                          className="form-control"
                          id="organizationname"
                          value={organizationType}
                          onChange={(e) => setOrganizationType(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Organization location*"
                          className="form-control"
                          id="organization location"
                          value={organizationLocation}
                          onChange={(e) =>
                            setOrganizationLocation(e.target.value)
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Organization email*"
                          className="form-control"
                          id="organization email"
                          value={organizationEmail}
                          onChange={(e) => setOrganizationEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={agreetermsconditions}
                          id="flexCheckDefault"
                          onChange={handleTermsConditions}
                          disabled={agreetermsconditions}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          I agree to the terms and conditions
                          <span className="required">*</span>
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-danger"
                        onClick={handleEventOrganizer}
                        disabled={!agreetermsconditions}
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-center mb-4">
                  Are you ready to proceed with event organization on this
                  platform?
                </h2>
                <div className="text-justify">
                  <p>
                    Before you take the next step, we highly recommend carefully
                    reading our{" "}
                    <strong onClick={NavigateOrganizerTerms}>
                      Terms and Conditions
                    </strong>{" "}
                    . Understanding these guidelines is crucial for a smooth
                    event organization process.
                  </p>
                  {/* <p>
                    Should you encounter any questions or face challenges, don't
                    hesitate to reach out to our support team. We're here to
                    assist you every step of the way.
                  </p> */}
                </div>
                <div className="text-center mt-4">
                  <button className="sub-button" onClick={buttonPressed}>
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
          <Popup
            isOpen={showTerms}
            onClose={() => setShowTerms(false)}
            onConfirm={handlePopupConfirm}
          />
        </div>
      )}
    </div>
  );
};

export default EventOrganizer;
