// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Tickets = await hre.ethers.getContractFactory("Tickets");
  const tickets = await Tickets.deploy();

  await tickets.deployed();

  console.log("Tickets deployed to:", tickets.address);

  // Write contract addresses to a JSON file
  const addresses = {
    // user: user.target,
    tickets: tickets.address,
  };

  fs.writeFileSync("contractAddresses.json", JSON.stringify(addresses));

  console.log("Contract addresses written to contractAddresses.json");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
