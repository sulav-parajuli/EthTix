import axios from "axios"; //js library for making http requests from node.js
import { ethers } from "ethers";
//import signData from "./signerMetamask.js";
async function signData(signer, data) {
  const signature = await signer.signMessage(data);
  return { data, signature };
}

async function uploadToIPFS(Data, signature) {
  const formData = new FormData();

  //COnvert the data to a blob
  const blob = new Blob([Data], { type: "application/octet-stream" });

  //Append the blobl as file
  formData.append("file", blob);

  //Append the signature as a custom field
  formData.append("signature", signature);
  try {
    const pinataMetadata = JSON.stringify({
      name: "UserDetails",
    });
    formData.append("pinataMetadata", pinataMetadata);
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);

    const pinataApiKey = "650c7f4f05a6eaa3640c";
    const pinataSecrestApiKey =
      "61763a9c7d8b68dee951c5e1b22145721613093f59e07d1dbe60d81b0a6e3b67";

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
        headers: {
          "Content-Type": `multipart/form-data; boundary= ${formData._boundary}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecrestApiKey,
        },
      }
    );
    const ipfsCid = response.data.IpfsHash;
    return { ipfsCid, signature };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export { signData, uploadToIPFS };
