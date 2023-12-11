import React, { useEffect } from "react";
import "./css/Login.css";
import walletImage from "../assets/images/wallet.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
import { useAppContext } from "./AppContext";

const Login = () => {
  const { isConnected, setConnected, account, template } = useAppContext();
  useEffect(() => {
    async function fetchAccount() {
      try {
        if ((await account) !== "Not connected") {
          setConnected(true);
        } else {
          setConnected(false);
        }
      } catch (error) {
        console.error("Error fetching account:", error);
      }
    }
    fetchAccount();
  }, []);

  const connectToWallet = async () => {
    await template(true);
    try {
      if (!isConnected) {
        console.error("User is not connected. Please connect to your wallet.");
        toast.error("User is not connected. Please connect to your wallet.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      } else {
        toast.success("Wallet connected successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error in wallet connection:", error);
      toast.error("Error in wallet connection.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="login-title">Connect</div>
        <div className="sub-title">
          {isConnected
            ? "You're connected"
            : "Connect to get your tickets within a few clicks!"}
        </div>
        <img src={walletImage} alt="Wallet" className="wallet-image" />
      </div>
      <div className="right-section">
        <form className="login-form">
          <hr className="line" />
          {isConnected ? (
            <div className="user-address">{`Connected: ${account}`}</div>
          ) : (
            <button
              className="connect-wallet"
              onClick={connectToWallet}
              disabled={isConnected}
            >
              Connect to your wallet
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
export default Login;
