import { useState, useEffect } from "react";
import "./App.css";
import abi from "../../artifacts/contracts/Tickets.sol/Tickets.json";
// Import the contract addresses from the JSON file
import contractAddresses from "../../contractAddresses.json";
import { ethers } from "ethers";
import CreateEvent from "./component/CreateEvent";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./component/Navbar";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("Not connected");
  //When react app is running this will automatically fetch contract instance
  useEffect(() => {
    const template = async () => {
      const contractAddress = contractAddresses.tickets;
      const contractABI = abi.abi;
      //code to connect to metamask wallet
      //if we want to change the state of blockchain then we need to pay certain amount

      try {
        const { ethereum } = window; //metamask inject ethereum object in window
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(account);
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
        console.log(contract);
        setState({ provider, signer, contract });
      } catch (error) {
        console.log(error);
      }
    };
    template();
  }, []);
  return (
    <>
      <div className="App">
        <Navbar state={state} />
        ConnectedAccount:{account}
        <CreateEvent state={state} />
      </div>
    </>
  );
}

export default App;
