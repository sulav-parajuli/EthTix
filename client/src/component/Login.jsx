import React, { useEffect, useState } from "react";
import "../assets/css/Login.css";
import walletImage from "../assets/images/wallet.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
import { useAppContext } from "./AppContext";
import { signData, uploadToIPFS, retrieveFromIPFS } from "../utils/ipfsUtils";
const Login = ({ state }) => {
  const {
    isConnected,
    setConnected,
    setUserConnected,
    isEventOrganizer,
    setEventOrganizer,
    account,
    template,
  } = useAppContext();
  const { signer, userContract, eventOrganizerContract } = state;
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
          toast.error("Please enter username.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }
        const userData = {
          userAddress,
          username,
        };
        //upload to ipfs only if user wants to register.
        if (isRegister) {
          //sign data
          const { data, signature } = await signData(
            signer,
            JSON.stringify(userData)
          );

          //upload to ipfs
          const { ipfsCid } = await uploadToIPFS(data, signature, false);
          //console.log(data);
          //console.log(ipfsCid);
          //Sending ipfsCid to smart contract
          if (!userContract) {
            alert("Contract is not deployed");
            return;
          }
          const transaction = await userContract.registerUser(ipfsCid);
          await transaction.wait();
          // console.log(transaction);
          toast.success(
            "User Registered successfully. Login now to get started.",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        } else {
          //check if user is registered or not
          const userCID = await userContract.getUserCID(userAddress);
          // console.log(userCID);
          if (!userCID) {
            toast.error("User is not registered. Register first to continue.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            return;
          } else {
            const retrievedData = await retrieveFromIPFS(userCID);
            const userAddresss = retrievedData.userAddress;
            const usernamee = retrievedData.username;
            // console.log(userAddresss);
            // console.log(usernamee);
            if (userAddress === userAddresss && username === usernamee) {
              setUserConnected(true); // Set isUserConnected to true when user gets logged in
              localStorage.setItem("isUserConnected", true);
              if (isEventOrganizer) {
                //check if user is event organizer or not.
                const eventorgCID =
                  await eventOrganizerContract.getOrganizerCID(userAddress);
                // console.log(eventorgCID);
                if (eventorgCID !== "") {
                  setEventOrganizer(true);
                } else {
                  setEventOrganizer(false);
                }
              }
            } else {
              toast.error(
                "You are not a valid user. Register first to continue.",
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
          }
        }
      }
    } catch (error) {
      console.error("Error Occured!:", error);
      toast.error("Error Occured!.", error, {
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
