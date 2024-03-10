import React, { useEffect, useState } from "react";
import "../assets/css/Login.css";
import walletImage from "../assets/images/wallet.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";
const Login = ({ state }) => {
  const {
    setUserConnected,
    isUserConnected,
    setEventOrganizer,
    account,
    template,
    createNotification,
  } = useAppContext();
  const { signer, ticketsContract } = state;
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchAccount() {
      try {
        if ((await account) !== "Not connected") {
          //check if user is registered or not and show the login or register page accordingly.
          setUserConnected(true);
          // Check if the user address is already registered as an event organizer or not.
          const isAlreadyOrganizer = await ticketsContract.isOrganizers(
            signer.getAddress()
          );
          if (isAlreadyOrganizer) {
            setEventOrganizer(true);
          } else {
            setEventOrganizer(false);
          }
        } else {
          setUserConnected(false);
        }
      } catch (error) {
        console.error("Error fetching account:", error);
      }
    }
    fetchAccount();
  }, [account, !account]);

  const connectToWallet = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      document.querySelector(".popup-inner").style.backgroundColor =
        "transparent";
      document.querySelector(".close").style.display = "none";
      await template(true);
      // Check if the user address is already registered as an event organizer or not.
      const isAlreadyOrganizer = await ticketsContract.isOrganizers(
        signer.getAddress()
      );
      // console.log(isAlreadyOrganizer);
      if (isAlreadyOrganizer) {
        setEventOrganizer(true);
      } else {
        setEventOrganizer(false);
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      // toast.error("Error connecting to wallet.", error, {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      // });
      // const newToastMessage = {
      //   notificationName: "Error connecting to wallet.",
      // };

      // createNotification(newToastMessage);
    } finally {
      setIsLoading(false);
      document.querySelector(".topnav").style.background = "transparent";
      document.querySelector(".popup-inner").style.backgroundColor = "white";
      document.querySelector(".close").style.display = "block";
    }
  };

  return (
    <div className="login-container">
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
          <div className="left-section">
            <div className="login-title">Connect</div>
            <div className="sub-title">
              {isUserConnected
                ? "Wallet connected!"
                : "Connect your wallet to get started"}
            </div>
            <img
              src={walletImage}
              alt="Wallet"
              className="wallet-image"
              title="Wallet Connection"
            />
          </div>
          <div className="right-section">
            <form className="login-form">
              <hr className="line" />
              {isUserConnected ? (
                <div className="user-address">{`Connected Wallet: ${account}`}</div>
              ) : null}
              {isUserConnected ? null : (
                <button className="login-button" onClick={connectToWallet}>
                  Connect Wallet
                </button>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  );
};
export default Login;
