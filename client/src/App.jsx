import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import BrowseEvent from "./component/BrowseEvent.jsx";
import "./App.css";

// Import the contract ABI
import accessControlAbi from "./artifacts/contracts/AccessControl.sol/AccessControl.json";
import userAbi from "./artifacts/contracts/User.sol/User.json";
import eventOrganizerAbi from "./artifacts/contracts/EventOrganizer.sol/EventOrganizer.json";
import ticketAbi from "./artifacts/contracts/Tickets.sol/Tickets.json";

// Import the contract addresses from the JSON file
import contractAddresses from "../../contractAddresses.json";
import { ethers } from "ethers";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import { toast } from "react-toastify"; // Import toastify for displaying notifications
import "react-toastify/dist/ReactToastify.css"; // Import the default styles

//Import bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";

//Import other components
import Home from "./component/Home.jsx";
import MyTickets from "./component/MyTickets.jsx";
import Navbar from "./component/Navbar.jsx";
import Footer from "./component/footer.jsx";
import Admin from "./component/Admin.jsx";
import About from "./component/About.jsx";
import { AppProvider } from "./component/AppContext.jsx"; // Import AppProvider

const root = ReactDOM.createRoot(document.getElementById("root"));

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    accessControlContract: null,
    userContract: null,
    eventOrganizerContract: null,
    ticketsContract: null,
  });
  const [account, setAccount] = useState("Not connected");
  //When react app is running this will automatically fetch contract instance
  const template = async (connectWallet) => {
    //code to connect to metamask wallet
    //if we want to change the state of blockchain then we need to pay certain amount

    try {
      const accessAddress = contractAddresses.accessControl;
      const accessContractABI = accessControlAbi.abi;

      const userContractAddress = contractAddresses.user;
      const userContractABI = userAbi.abi;

      const organizerContractAddress = contractAddresses.eventOrganizer;
      const organizerContractABI = eventOrganizerAbi.abi;

      const ticketContractAddress = contractAddresses.tickets;
      const ticketContractABI = ticketAbi.abi;

      const { ethereum } = window; //metamask inject ethereum object in window
      if (connectWallet == true) {
        //if connectWallet is true then only user wallet is requested.
        await ethereum.request({
          method: "eth_requestAccounts",
        });
      }
      // Fetch the connected account
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length !== 0) {
        setAccount(accounts[0]);
        if (connectWallet == true) {
          toast.success("Wallet connected successfully.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
      //changing account address
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
      //signer will help us in doing transaction that will change the state of blockchain
      //provider will help us in reading the state of blockchain
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      //instance of the contract
      const accessControlInstance = new ethers.Contract(
        accessAddress,
        accessContractABI, //abi is the interface of the contract
        signer
      );

      const userContractInstance = new ethers.Contract(
        userContractAddress,
        userContractABI,
        signer
      );

      const eventOrganizerContractInstance = new ethers.Contract(
        organizerContractAddress,
        organizerContractABI,
        signer
      );

      const ticketsContractInstance = new ethers.Contract(
        ticketContractAddress,
        ticketContractABI,
        signer
      );

      // console.log(contract);
      setState({
        provider,
        signer,
        accessControlContract: accessControlInstance,
        userContract: userContractInstance,
        eventOrganizerContract: eventOrganizerContractInstance,
        ticketsContract: ticketsContractInstance,
      });
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      if (!window.ethereum) {
        toast.error("Please install your wallet to connect wallet.", {
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
  useEffect(() => {
    //Setting parameter to 'false' means to skips wallet connection request but allows fetching the contract instance.
    template(false);
  }, []);

  return (
    <BrowserRouter>
      <AppProvider account={account} template={template}>
        <div className="App">
          <Navbar state={state} />
          <Routes>
            <>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Admin state={state} />} />
              <Route path="events" element={<BrowseEvent state={state} />} />
              <Route path="mytickets" element={<MyTickets state={state} />} />
              <Route path="about" element={<About />} />
            </>
          </Routes>
          <Footer />
        </div>
        <ToastContainer /> {/* Add ToastContainer at the top level */}
      </AppProvider>
    </BrowserRouter>
  );
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
