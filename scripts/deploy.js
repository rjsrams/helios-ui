const hre = require("hardhat");

async function main() {
  const HelloHelios = await hre.ethers.getContractFactory("HelloHelios");
  const contract = await HelloHelios.deploy();
  await contract.deployed();

  console.log("Deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

