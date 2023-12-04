const { ethers } = require("hardhat");

async function main() {
  // Get the account that will deploy the contract
  const [deployer] = await ethers.getSigners();

  // Log the deployer's address
  console.log("Deploying contract with address:", deployer.address);

  // Compile the contract
  const ERC6551Account = await ethers.getContractFactory("ERC6551Account");

  // Deploy the contract
  const erc6551Account = await ERC6551Account.deploy();

  // Wait for the contract to be deployed
  await erc6551Account.deployed();

  console.log("ERC6551Account deployed to:", erc6551Account.address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
