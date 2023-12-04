const hre = require("hardhat");

async function main() {
	const Contract = await hre.ethers.getContractFactory("EnergyToken");
	const contract = await Contract.deploy();

	await contract.deployed();

	console.log("EnergyToken deployed to:", contract.address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});