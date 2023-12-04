const { ethers } = require("hardhat");

async function main() {
  // Get the account that will deploy the contract
  const [deployer] = await ethers.getSigners();

  // Log the deployer's address
  console.log("Deploying contract with address:", deployer.address);

  // Compile the contract
  const ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");

  // Deploy the contract
  const erc6551Registry = await ERC6551Registry.deploy();

  // Wait for the contract to be deployed
  await erc6551Registry.deployed();

  console.log("ERC6551Registry deployed to:", erc6551Registry.address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
