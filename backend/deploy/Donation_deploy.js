// deploy.js

const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const DonationContract = await hre.ethers.getContractFactory("DonationContract");

  // Set the platform owner address
  const platformOwner = "0xad96c0b51d5be8c190f2d7cdabbfd4173af2b06c";

  // Deploy the contract with the platform owner as an argument
  const donationContract = await DonationContract.deploy(platformOwner);

  // Wait for the contract to be deployed
  await donationContract.deployed();

  // Log the contract address
  console.log("Donations deployed to:", donationContract.address);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
