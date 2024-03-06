import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./App.css"; //Import App css

// Import the contract ABI
import ticketAbi from "./artifacts/contracts/Tickets.sol/Tickets.json";

// Import the contract addresses from the JSON file
import contractAddresses from "../../contractAddresses.json";
import { ethers } from "ethers";
//Import toast
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import { toast } from "react-toastify"; // Import toastify for displaying notifications
import "react-toastify/dist/ReactToastify.css"; // Import the default styles

//Import bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";

//Font Awesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

//Import other components
import Home from "./component/Home.jsx";
import MyTickets from "./component/MyTickets.jsx";
import Navbar from "./component/Navbar.jsx";
import Footer from "./component/footer.jsx";
import Admin from "./component/Admin.jsx";
import BrowseEvent from "./component/BrowseEvent.jsx";
import About from "./component/About.jsx";
import ErrorPage from "./component/ErrorPage.jsx";
import { AppProvider } from "./component/AppContext.jsx"; // Import AppProvider
import PrivacyPolicy from "./component/PrivacyPolicy.jsx";
import TermsAndConditions from "./component/TermsAndConditions.jsx";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,

    ticketsContract: null,
  });
  const [account, setAccount] = useState("Not connected");
  const [accounts, setAccounts] = useState([]); //accounts[0] will be the current account
  const [showToTopButton, setShowToTopButton] = useState(false);
  //When react app is running this will automatically fetch contract instance
  const template = async (connectWallet) => {
    //code to connect to metamask wallet
    //if we want to change the state of blockchain then we need to pay certain amount

    try {
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
        setAccounts(accounts); //Add all the accounts to the accounts array
        setAccount(accounts[0]);
        if (connectWallet == true) {
          toast.success("Wallet Connected Successfully!", {
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
        localStorage.removeItem("notifications");
      });
      //signer will help us in doing transaction that will change the state of blockchain
      //provider will help us in reading the state of blockchain
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      //instance of the contract
      const ticketsContractInstance = new ethers.Contract(
        ticketContractAddress,
        ticketContractABI,
        signer
      );

      // console.log(contract);
      setState({
        provider,
        signer,
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

    // Add a scroll event listener to show/hide the "to the top" button
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // You can adjust the threshold value as needed
      const showButtonThreshold = 300;

      setShowToTopButton(scrollY > showButtonThreshold);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleToTopClick = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <BrowserRouter>
      <AppProvider
        account={account}
        accounts={accounts}
        template={template}
        state={state}
      >
        <div className="App">
          <Navbar state={state} />
          <Routes>
            <>
              <Route path="/" element={<Home state={state} />} />
              <Route path="/dashboard" element={<Admin state={state} />} />
              <Route path="events" element={<BrowseEvent state={state} />} />
              <Route path="mytickets" element={<MyTickets state={state} />} />
              <Route path="about" element={<About />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<TermsAndConditions />} />
              {/* Catch-all other routes for displaying an error page */}
              <Route path="*" element={<ErrorPage />} />
            </>
          </Routes>
          {/* "To the Top" button */}
          {showToTopButton && (
            <button className="btn to-top-button" onClick={handleToTopClick}>
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
          )}
          <Footer />
        </div>
        <ToastContainer /> {/* Add ToastContainer at the top level */}
      </AppProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
