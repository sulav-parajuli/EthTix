import { ethers } from "ethers";
async function signData(signer, data) {
  const signature = await signer.signMessage(data);
  return signature;
}
