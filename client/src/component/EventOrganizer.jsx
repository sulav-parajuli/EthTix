import { React, useState } from "react";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { signData, uploadToIPFS } from "../utils/ipfsUtils";
import { toast } from "react-toastify";

const EventOrganizer = ({ state }) => {
  const [nextpage, setNextpage] = useState(false);
  const { setEventOrganizer, isEventOrganizer } = useAppContext();
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [organizationType, setOrganizationType] = useState("");
  const [organizationLocation, setOrganizationLocation] = useState("");
  const [organizationEmail, setOrganizationEmail] = useState("");
  const {
    signer,

    ticketsContract,
  } = state;
  const [agreetermsconditions, setagreetermsconditions] = useState(false);
  const navigate = useNavigate(); //to redirect to another page
  //console.log(state);
  const buttonPressed = () => {
    setNextpage(true);
  };

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
        toast.error("Please fill all the fields.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
      // Check if the address is already registered as an event organizer
      try {
        const isAlreadyOrganizer = await ticketsContract.isOrganizers(
          signer.getAddress()
        );
        if (isAlreadyOrganizer) {
          const eventorgCID = await ticketsContract.getOrganizerCID(
            signer.getAddress()
          );
          // console.log(eventorgCID);
          if (!eventorgCID) {
            setEventOrganizer(false);
          } else {
            setEventOrganizer(true);
          }
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
          return;
        }
      } catch (error) {
        console.error("Error checking organizer status:", error);
        toast.error("Error checking organizer status. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
      const eventOrganizerData = {
        name,
        organizationName,
        organizationType,
        organizationLocation,
        organizationEmail,
      };
      // console.log(eventOrganizerData);
      //signdata
      const { data, signature } = await signData(
        signer,
        JSON.stringify(eventOrganizerData)
      );

      //const userAddress = await signer.getAddress();
      //upload to ipfs
      const { ipfsCid } = await uploadToIPFS(data, signature);
      if (!ticketsContract) {
        console.log("Contract not deployed");
        return;
      } else {
        // const userregistered = await userContract.isRegisteredUser(userAddress);
        // console.log(userregistered);
        // console.log(ipfsCid);
        // console.log(ticketsContract);
        //verify if user is registered or not
        // if (userregistered) {
        const transaction = await ticketsContract.registerEventOrganizer(
          ipfsCid
        );
        await transaction.wait();
        console.log(transaction);
        const isOrganizer = await ticketsContract.isOrganizers(
          signer.getAddress()
        );
        // console.log(isOrganizer);
        //console.log("Event Organizer registered successfully");
        // } else {
        //   console.error(
        //     "Only registered users can call this function. Register as a user first."
        //   );
        //   toast.error(
        //     "Only registered users can call this function. Register as a user first.",
        //     {
        //       position: "top-right",
        //       autoClose: 5000,
        //       hideProgressBar: false,
        //       closeOnClick: true,
        //       pauseOnHover: true,
        //       draggable: true,
        //     }
        //   );
        // }

        // console.log(transaction);
        if (isOrganizer) {
          setEventOrganizer(true);
        }
        //You might require local storage or session storage. It helps to set cookies.
        localStorage.setItem("isEventOrganizer", isEventOrganizer);
        document.body.classList.remove("popup-open"); // Allow scrolling
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error("Contract not deployed. Please deploy the contract first.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
              <div>
                <h2 className="text-center mb-4">
                  Enter your organization details.
                </h2>
                <form>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Enter your Name"
                      className="form-control"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Enter your organization name"
                      className="form-control"
                      id="organizationname"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Type of organization"
                      className="form-control"
                      id="organizationname"
                      value={organizationType}
                      onChange={(e) => setOrganizationType(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Organization location"
                      className="form-control"
                      id="organization location"
                      value={organizationLocation}
                      onChange={(e) => setOrganizationLocation(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Organization email"
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
                      onChange={(e) =>
                        setagreetermsconditions(e.target.checked)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      I agree to the terms and conditions
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
            ) : (
              <>
                <h2 className="text-center mb-4">
                  Are you an Event Organizer?
                </h2>
                <div className="text-justify">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nulla nec purus feugiat, quam vitae aliquet orci.
                  </p>
                  <p>
                    Vestibulum ac diam sit amet quam vehicula elementum sed sit
                    amet dui. Proin eget tortor risus.
                  </p>
                  {/* Add more disclaimer content as needed */}
                </div>
                <div className="text-center mt-4">
                  <button className="sub-button" onClick={buttonPressed}>
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventOrganizer;
