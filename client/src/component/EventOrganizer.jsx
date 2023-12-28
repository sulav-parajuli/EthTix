import { React, useState } from "react";
import { useAppContext } from "./AppContext";
import { useNavigate } from "react-router-dom";

const EventOrganizer = () => {
  const [nextpage, setNextpage] = useState(false);
  const { setEventOrganizer, isEventOrganizer } = useAppContext();
  const navigate = useNavigate(); //to redirect to another page

  const buttonPressed = () => {
    setNextpage(true);
  };

  const handleEventOrganizer = () => {
    //When user clicks on submit button, save eventorganizer details in contract.
    // Write other logic here
    // fetch if user is eventorganizer or not from contract and set it's state.
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
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Enter your organization name"
                    className="form-control"
                    id="organizationname"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Type of organization"
                    className="form-control"
                    id="organizationname"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Organization location"
                    className="form-control"
                    id="organization location"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Organization email"
                    className="form-control"
                    id="organization email"
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
