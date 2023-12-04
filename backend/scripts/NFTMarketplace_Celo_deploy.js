const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const NFTMarketplace_Celo = await hre.ethers.getContractFactory("NFTMarketplace_Celo");
  const nftMarketplace_Celo = await NFTMarketplace_Celo.deploy();
  await nftMarketplace_Celo.deployed();
  console.log("nftMarketplace deployed to:", nftMarketplace_Celo.address);

  fs.writeFileSync('./config_celo.js', `
  export const marketplaceAddress = "${nftMarketplace_Celo.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });