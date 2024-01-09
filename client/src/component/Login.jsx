import React, { useEffect, useState } from "react";
import "../assets/css/Login.css";
import walletImage from "../assets/images/wallet.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
import { useAppContext } from "./AppContext";
import { signData, uploadToIPFS, retrieveFromIPFS } from "../utils/ipfsUtils";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye } from "@fortawesome/free-solid-svg-icons";
const Login = ({ state }) => {
  const {
    isConnected,
    setConnected,
    setUserConnected,
    setEventOrganizer,
    isEventOrganizer,
    account,
    template,
    rememberme,
    setRememberme,
  } = useAppContext();
  const {
    // userContract,
    signer,
    eventOrganizerContract,
  } = state;
  const [isLogin, setLogin] = useState(false);
  const [name, setName] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmpassword, setConfirmPassword] = useState("");
  const [email, setmail] = useState("");
  const [agreetermsconditions, setagreetermsconditions] = useState(false);
  useEffect(() => {
    async function fetchAccount() {
      try {
        if ((await account) !== "Not connected") {
          setConnected(true);
          //check if user is registered or not and show the login or register page accordingly.
          const userAddresss = localStorage.getItem("userAddress");
          const ipfsCid = localStorage.getItem("ipfsCid");
          if (userAddresss === account && ipfsCid !== "") {
            setLogin(true);
          } else {
            setLogin(false);
          }
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
    setLogin((prev) => !prev);
  };

  const connectToWallet = async (event) => {
    event.preventDefault();
    await template(true);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
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
        //Write your logic here when user clicks on login or register button
        //user validation logic
        // fetch if user is registered or not, eventorganizer or not from contract and set it's state.

        const userAddress = account;
        if (!name.trim()) {
          toast.error("Please enter name.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }
        // if (!password.trim()) {
        //   toast.error("Please enter Password.", {
        //     position: "top-right",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //   });
        //   return;
        // }
        // // Function to check if a password is strong
        // const isStrongPassword = (password) => {
        //   // Define your password strength criteria
        //   const minLength = 8;
        //   const hasUpperCase = /[A-Z]/.test(password);
        //   const hasLowerCase = /[a-z]/.test(password);
        //   const hasNumber = /\d/.test(password);
        //   const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(
        //     password
        //   );

        //   // Check if the password meets the criteria
        //   return (
        //     password.length >= minLength &&
        //     hasUpperCase &&
        //     hasLowerCase &&
        //     hasNumber &&
        //     hasSpecialChar
        //   );
        // };

        // // Inside your handleLogin function
        // if (!isStrongPassword(password)) {
        //   toast.error(
        //     "Password should contains 8+ characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
        //     {
        //       position: "top-right",
        //       autoClose: 5000,
        //       hideProgressBar: false,
        //       closeOnClick: true,
        //       pauseOnHover: true,
        //       draggable: true,
        //     }
        //   );
        //   return;
        // }

        if (isLogin) {
          //check if user is registered or not
          // const userCID = await userContract.getUserCID(userAddress);
          const ipfsCid = localStorage.getItem("ipfsCid");
          // console.log(ipfsCid);
          if (!ipfsCid) {
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
            const retrievedData = await retrieveFromIPFS(ipfsCid);
            const userAddresss = retrievedData.userAddress;
            const usernamee = retrievedData.name;
            // console.log(rememberme);
            // console.log(userAddresss);
            // console.log(usernamee);
            if (userAddress === userAddresss && name === usernamee) {
              if (rememberme) {
                localStorage.setItem("rememberme", rememberme);
                localStorage.setItem("username", name);
                localStorage.setItem("userAddress", userAddress);
              }
              setUserConnected(true); // Set isUserConnected to true when user gets logged in
              localStorage.setItem("isUserConnected", true);
              //check if user is event organizer or not.
              const eventorgCID = await eventOrganizerContract.getOrganizerCID(
                userAddress
              );
              // console.log(eventorgCID);
              if (!eventorgCID) {
                setEventOrganizer(false);
              } else {
                setEventOrganizer(true);
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
        } else {
          if (!email.trim()) {
            toast.error("Please enter Email.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            return;
          }
          // if (!confirmpassword.trim()) {
          //   toast.error("Please enter confirm password.", {
          //     position: "top-right",
          //     autoClose: 5000,
          //     hideProgressBar: false,
          //     closeOnClick: true,
          //     pauseOnHover: true,
          //     draggable: true,
          //   });
          //   return;
          // }
          // if (password !== confirmpassword) {
          //   toast.error("Password and Confirm Password should match.", {
          //     position: "top-right",
          //     autoClose: 5000,
          //     hideProgressBar: false,
          //     closeOnClick: true,
          //     pauseOnHover: true,
          //     draggable: true,
          //   });
          //   return;
          // }
          const isValidEmail = (email) => {
            // Regular expression for a simple email pattern
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
          };

          // Inside your handleLogin function
          if (!isValidEmail(email)) {
            toast.error("Please enter a valid email address.", {
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
            name,
            email,
            // password,
          };
          //sign data
          const { data, signature } = await signData(
            signer,
            JSON.stringify(userData)
          );

          //upload to ipfs only if user wants to register.
          const { ipfsCid } = await uploadToIPFS(data, signature);
          localStorage.setItem("ipfsCid", ipfsCid);
          //console.log(data);
          //console.log(ipfsCid);
          //Sending ipfsCid to smart contract
          // if (!userContract) {
          //   alert("Contract is not deployed");
          //   return;
          // }
          // const transaction = await userContract.registerUser(ipfsCid);
          // await transaction.wait();
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
        }
      }
    } catch (error) {
      if (!isEventOrganizer) {
      } else {
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
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        {isConnected ? (
          isLogin ? (
            <div className="login-title">Login</div>
          ) : (
            <div className="login-title">Register</div>
          )
        ) : (
          <div className="login-title">Connect Wallet</div>
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
            <>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {isLogin ? null : (
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Your Email Address"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setmail(e.target.value)}
                  />
                </div>
              )}
              {/* <div className="mb-3">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control"
                  value={password}
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FontAwesomeIcon icon={faEye} />
              </div> */}
              {isLogin ? (
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={rememberme}
                    id="flexCheckDefault"
                    onChange={(e) => setRememberme(e.target.checked)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Remember me
                  </label>
                </div>
              ) : (
                <>
                  {/* <div className="mb-3">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="form-control"
                      value={confirmpassword}
                      id="password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <FontAwesomeIcon icon={faEye} className="showhide" />
                  </div> */}
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
                </>
              )}
            </>
          ) : null}
          <hr className="line" />
          {isConnected ? (
            <>
              <div className="user-address">{`Connected Wallet: ${account}`}</div>
              {isLogin ? (
                <p>
                  <b>Don't have an account?</b>
                  <a onClick={handlelink} className="link">
                    Register
                  </a>
                </p>
              ) : (
                <p>
                  <b>Already have an account?</b>
                  <a onClick={handlelink} className="link">
                    Login
                  </a>
                </p>
              )}
            </>
          ) : null}
          {isConnected ? (
            isLogin ? (
              <button className="login-button" onClick={handleLogin}>
                Login
              </button>
            ) : (
              <button
                className="login-button"
                disabled={!agreetermsconditions}
                onClick={handleLogin}
              >
                Register
              </button>
            )
          ) : (
            <button className="login-button" onClick={connectToWallet}>
              Connect Wallet
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
export default Login;
