import React, { useEffect, useState } from "react";
import "../assets/css/Login.css";
import walletImage from "../assets/images/wallet.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
import { useAppContext } from "./AppContext";
import { ethers } from "ethers";
import { signData, uploadToIPFS } from "../utils/ipfsUtils";
const Login = ({ state }) => {
  const {
    isConnected,
    setConnected,
    setUserConnected,
    // setEventOrganizer,
    account,
    template,
  } = useAppContext();
  const { signer, userContract } = state;
  const [isRegister, setRegister] = useState(false);
  const [username, setUsername] = useState("");
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

  const handlelink = () => {
    setRegister((prev) => !prev);
  };

  const connectToWallet = async (event) => {
    event.preventDefault();
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
        //Write your logic here when user clicks on submit button
        //user validation logic
        // fetch if user is registered or not, eventorganizer or not from contract and set it's state.
        // setEventOrganizer(true);

        const userAddress = account;
        if (!username.trim()) {
          alert("Please enter username");
          return;
        }
        const userData = {
          userAddress,
          username,
        };
        //hash and sign data
        const { data, signature } = await signData(
          signer,
          JSON.stringify(userData)
        );
        //upload to ipfs only if user wants to register.
        // if (isRegister) {
        //upload to ipfs
        const { ipfsCid } = await uploadToIPFS(data, signature);
        console.log(data);
        console.log(ipfsCid);
        // }
        //localStorage.setItem("isEventOrganizer", true);

        setUserConnected(true); // Set isUserConnected to true when user gets logged in
        localStorage.setItem("isUserConnected", true);
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
        {!isConnected ? (
          <div className="login-title">Connect Wallet</div>
        ) : isRegister ? (
          <div className="login-title">Register</div>
        ) : (
          <div className="login-title">Login</div>
        )}
        <div className="sub-title">
          {isConnected
            ? "You're connected"
            : "Connect your wallet first to get started"}
        </div>
        <img src={walletImage} alt="Wallet" className="wallet-image" />
      </div>
      <div className="right-section">
        <form className="login-form">
          {isConnected ? (
            <div className="mb-3">
              <input
                type="text"
                placeholder="Username"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          ) : null}
          {/* <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              id="password"
            />
          </div>
          {isRegister ? (
            <div className="mb-3">
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-control"
                id="password"
              />
            </div>
          ) : null} */}
          <hr className="line" />
          {isConnected ? (
            <>
              <div className="user-address">{`Connected Wallet: ${account}`}</div>
              {isRegister ? (
                <p>
                  <b>Already have an account?</b>
                  <a onClick={handlelink} className="link">
                    Login
                  </a>
                </p>
              ) : (
                <p>
                  <b>Don't have an account?</b>
                  <a onClick={handlelink} className="link">
                    Register
                  </a>
                </p>
              )}
            </>
          ) : null}
          <button className="login-button" onClick={connectToWallet}>
            {isConnected ? "Submit" : "Connect Wallet"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
