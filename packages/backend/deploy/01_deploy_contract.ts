import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, network, run } from "hardhat";

const deployDArchive: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const isDevelopmentNetwork =
    network.name === "hardhat" || network.name === "localhost";
  const supporterNFT = await ethers.getContract("SupporterNFT", deployer);
  const args = [process.env.TRUSTED_FORWARDER_ADDRESS, supporterNFT.address];
  const DArchive = await deploy("DArchive", {
    args,
    from: deployer,
    log: true,
    waitConfirmations: isDevelopmentNetwork ? 0 : 6,
  });
  const tx = await supporterNFT.setSupporterTokenURI(
    "bafkreifpusj4nvbrvibcdib5yaedzqqzjy7o6q2omon7fezbp2zou6fcl4"
  );
  await tx.wait();
  const transferTx = await supporterNFT.transferOwnership(DArchive.address);
  await transferTx.wait();
  log(`Deployed DArchive at ${DArchive.address}`);
  if (!isDevelopmentNetwork) {
    try {
      log(`Waiting for DArchive to be mined for verification...`);
      await run("verify:verify", {
        address: DArchive.address,
        constructorArguments: args,
      });
    } catch (e) {
      log(`DArchive verification failed: ${e}`);
    }
  }
};

export default deployDArchive;
deployDArchive.tags = ["all", "archive"];
