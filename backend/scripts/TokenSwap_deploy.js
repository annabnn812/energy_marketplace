

async function main() {
  // Get the contract factory
  const TokenSwap = await hre.ethers.getContractFactory("TokenSwap");

  // Replace 'YOUR_PLATFORM_OWNER_ADDRESS' with the actual platform owner's Ethereum address
  const platformOwner = "0xad96c0b51d5be8c190f2d7cdabbfd4173af2b06c";

  // Deploy the contract with the platform owner's address
  const tokenSwap = await TokenSwap.deploy(platformOwner);
  await tokenSwap.deployed();

  // Log the contract address
  console.log("TokenSwap deployed to:", tokenSwap.address);
}

// Execute the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
