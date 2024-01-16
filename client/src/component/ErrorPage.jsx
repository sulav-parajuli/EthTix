import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import error from "../assets/images/404.png";

const ErrorPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    // document.title = "404: Page Not Found";
  }, []);

  const handleGoBack = () => {
    // Use the navigate function to go back to the previous page
    navigate(-1); // or navigate("back")
  };

  return (
    <div className="mcontainer" style={{ paddingBottom: "5%" }}>
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
        <>
          <img src={error} alt="404" style={{ width: "20%" }} />
          <h1>Page Not Found</h1>
          <p>Sorry, the page you are looking for does not exist.</p>
          <button
            className="icon-move-right main-button color-white"
            onClick={handleGoBack}
          >
            Go Back
            {/* <i className="fas fa-arrow-right text-xs ms-1" aria-hidden="true"></i> */}
          </button>
        </>
      )}
    </div>
  );
};

export default ErrorPage;
