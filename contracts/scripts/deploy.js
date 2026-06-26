import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy ITP
  const ITP = await ethers.getContractFactory("ITP");
  const itp = await ITP.deploy();
  await itp.waitForDeployment();
  console.log("ITP Token deployed to:", await itp.getAddress());

  // Deploy WION
  const WION = await ethers.getContractFactory("WION");
  const wion = await WION.deploy();
  await wion.waitForDeployment();
  console.log("WION Engine deployed to:", await wion.getAddress());

  // Deploy IvoryVault
  const IvoryVault = await ethers.getContractFactory("IvoryVault");
  const ivoryVault = await IvoryVault.deploy();
  await ivoryVault.waitForDeployment();
  console.log("Ivory Vault deployed to:", await ivoryVault.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
