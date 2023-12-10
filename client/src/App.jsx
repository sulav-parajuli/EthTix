import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import BrowseEvent from "./component/BrowseEvent.jsx";
import "./App.css";
import abi from "../../artifacts/contracts/Tickets.sol/Tickets.json";
// Import the contract addresses from the JSON file
import contractAddresses from "../../contractAddresses.json";
import { ethers } from "ethers";
//Import bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
//Import other components
import Home from "./component/Home.jsx";
import CreateEvent from "./component/CreateEvent.jsx";
import Navbar from "./component/Navbar.jsx";
import Footer from "./component/footer.jsx";
import { AppProvider, useAppContext } from "./component/AppContext.jsx"; // Import useAppContext

const root = ReactDOM.createRoot(document.getElementById("root"));

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("Not connected");
  //When react app is running this will automatically fetch contract instance
  const template = async (connectWallet) => {
    const contractAddress = contractAddresses.tickets;
    const contractABI = abi.abi;
    //code to connect to metamask wallet
    //if we want to change the state of blockchain then we need to pay certain amount

    try {
      const { ethereum } = window; //metamask inject ethereum object in window
      if (connectWallet) {
        //if connectWallet is true then only user wallet is requested.
        await ethereum.request({
          method: "eth_requestAccounts",
        });
      }
      // Fetch the connected account
      const account = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (account.length !== 0) {
        setAccount(account);
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
      const contract = new ethers.Contract(
        contractAddress,
        contractABI, //abi is the interface of the contract
        signer
      );
      // console.log(contract);
      setState({ provider, signer, contract });
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("Error connecting to wallet.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  useEffect(() => {
    template(false);
  }, []);
  return (
    <BrowserRouter>
      <AppProvider account={account} template={template}>
        <div className="App">
          <Navbar />
          <Routes>
            <>
              <Route path="/" element={<Home />} />
              <Route
                path="/createevent"
                element={<CreateEvent state={state} />}
              />
              <Route path="events" element={<BrowseEvent state={state} />} />
            </>
          </Routes>
          <Footer />
        </div>
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
