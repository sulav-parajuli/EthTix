import { React, useState } from "react";
import { useAppContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import { signData, uploadToIPFS } from "../utils/ipfsUtils";

const EventOrganizer = ({ state }) => {
  const [nextpage, setNextpage] = useState(false);
  const { setEventOrganizer, isEventOrganizer } = useAppContext();
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [organizationLocation, setOrganizationLocation] = useState("");
  const [organizationEmail, setOrganizationEmail] = useState("");
  const { signer, eventOrganizerContract } = state;
  const navigate = useNavigate(); //to redirect to another page
  //console.log(state);
  const buttonPressed = () => {
    setNextpage(true);
  };

  const handleEventOrganizer = async () => {
    //Validation of data
    if (
      !name ||
      !organizationName ||
      !organizationType ||
      !organizationLocation ||
      !organizationEmail
    ) {
      alert("Please fill all the fields");
      return;
    }
    const eventOrganizerData = {
      name,
      organizationName,
      organizationType,
      organizationLocation,
      organizationEmail,
    };
    console.log(eventOrganizerData);
    //signdata
    const { data, signature } = await signData(
      signer,
      JSON.stringify(eventOrganizerData)
    );
    //upload to ipfs
    const { ipfsCid } = await uploadToIPFS(data, signature);
    if (!eventOrganizerContract) {
      console.log("Contract not deployed");
      return;
    }
    console.log(ipfsCid);
    console.log(eventOrganizerContract);
    const transaction = await eventOrganizerContract.registerEventOrganizer(
      ipfsCid
    );
    await transaction.wait();
    console.log(transaction);

    setEventOrganizer(true);
    //You might require local storage or session storage. It helps to set cookies.
    localStorage.setItem("isEventOrganizer", isEventOrganizer);
    // sessionStorage.setItem("isEventOrganizer", true);
    document.body.classList.remove("popup-open"); // Allow scrolling
    navigate("/dashboard");
  };

  return (
    <div className="container mt-5">
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
                <button
                  type="submit"
                  className="btn btn-danger"
                  onClick={handleEventOrganizer}
                >
                  Submit
                </button>
              </form>
            </div>
          ) : (
            <>
              <h2 className="text-center mb-4">Are you an Event Organizer?</h2>
              <div className="text-justify">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  nec purus feugiat, quam vitae aliquet orci.
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
    </div>
  );
};

export default EventOrganizer;
