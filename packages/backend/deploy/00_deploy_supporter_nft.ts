import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { network, run } from "hardhat";

const deploySupporterNFT: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const isDevelopmentNetwork =
    network.name === "hardhat" || network.name === "localhost";
  const args: never[] = [];
  const SupporterNFT = await deploy("SupporterNFT", {
    args,
    from: deployer,
    log: true,
    waitConfirmations: isDevelopmentNetwork ? 0 : 6,
  });

  log(`Deployed SupporterNFT at ${SupporterNFT.address}`);
  if (!isDevelopmentNetwork) {
    try {
      log(`Waiting for SupporterNFT to be mined for verification...`);
      await run("verify:verify", {
        address: SupporterNFT.address,
        constructorArguments: args,
      });
    } catch (e) {
      log(`SupporterNFT verification failed: ${e}`);
    }
  }
};

export default deploySupporterNFT;
deploySupporterNFT.tags = ["all", "nft"];
