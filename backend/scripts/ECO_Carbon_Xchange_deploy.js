
const hre = require("hardhat");
const fs = require('fs');


async function main() {

    const ECO_Carbon_Xchange = await hre.ethers.getContractFactory("ECO_Carbon_Xchange");
    const eco_Carbon_Xchange = await eco_Carbon_Xchange.deploy();
    await nftMarketplace.deployed();
    console.log("eco_Carbon_Xchange deployed to:", eco_Carbon_Xchange.address);
  
    fs.writeFileSync('./configECO_token.js', `
    export const eco_Carbon_Xchange = "${eco_Carbon_Xchange.address}"
    `)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });