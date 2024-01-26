import axios from "axios"; //js library for making http requests from node.js
import { toast } from "react-toastify"; // to notify users of axios network errors.
import "react-toastify/dist/ReactToastify.css"; //toastify css

//import signData from "./signerMetamask.js";
async function signData(signer, data) {
  const signature = await signer.signMessage(data);
  return { data, signature };
}

async function getPinataKeys() {
  try {
    const pinataApiKey = import.meta.env.VITE_PINATA_KEY;
    const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_KEY;
    return { pinataApiKey, pinataSecretApiKey };
  } catch (error) {
    console.error("Error getting Pinata keys:", error);
    throw error;
  }
}

async function uploadToIPFS(Data, signature) {
  try {
    const { pinataApiKey, pinataSecretApiKey } = await getPinataKeys();

    const formData = new FormData();
    //COnvert the data to a blob
    const blob = new Blob([Data], { type: "application/octet-stream" });
    //Append the blobl as file
    formData.append("file", blob);
    if (signature) {
      formData.append("signature", signature);
    }

    formData.append("pinataMetadata", pinataMetadata);
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
        headers: {
          "Content-Type": `multipart/form-data; boundary= ${formData._boundary}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );
    // Check if the request was successful
    if (response.status === 200) {
      const ipfsCid = response.data.IpfsHash;
      return { ipfsCid, signature };
    } else {
      console.error("Failed to pin file. Status code:", response.status);
      console.error("Response:", response.data);
      toast.error("Failed to pin file. See console for details.");
      throw new Error("Failed to pin file.");
    }
  } catch (error) {
    handleUploadError(error);
  }
}

async function retrieveFromIPFS(ipfsCid) {
  try {
    // Use the Pinata IPFS gateway URL
    const ipfsGatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsCid}`;

    // Make a GET request to the IPFS gateway to retrieve the data
    const response = await axios.get(ipfsGatewayUrl);

    // Check if the request was successful
    if (response.status === 200) {
      // The retrieved data is in the response.data
      const retrievedData = response.data;
      return retrievedData;
    } else {
      console.error("Failed to retrieve data. Status code:", response.status);
      return null;
    }
  } catch (error) {
    // Check if the error is a network error
    if (error.message === "Network Error") {
      // Network error occurred, show toast message
      toast.error("Internet is not connected. Check your connection.");
    } else {
      // Handle other errors or show a generic error message
      console.error("Error retrieving data from IPFS:", error);
      toast.error("An unexpected error occurred.");
    }
    throw error;
  }
}

// Helper function to handle upload errors
function handleUploadError(error) {
  if (error.message === "Network Error") {
    toast.error("Internet is not connected. Check your connection.");
  } else {
    console.error(error);
    toast.error("An unexpected error occurred.");
  }
  throw error;
}

export { signData, uploadToIPFS, retrieveFromIPFS, uploadReportToIPFS };
