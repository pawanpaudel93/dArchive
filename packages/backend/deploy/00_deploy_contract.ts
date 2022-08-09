import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { network, run } from "hardhat";

const deployDArchive: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const isDevelopmentNetwork =
    network.name === "hardhat" || network.name === "localhost";
  const args: never[] = [];
  const DArchive = await deploy("DArchive", {
    args,
    from: deployer,
    log: true,
    waitConfirmations: isDevelopmentNetwork ? 0 : 6,
  });

  log(`Deployed DArchive at ${DArchive.address}`);
  if (!isDevelopmentNetwork) {
    log(`Waiting for DArchive to be mined for verification...`);
    await run("verify:verify", {
      address: DArchive.address,
      constructorArguments: args,
    });
  }
};

export default deployDArchive;
deployDArchive.tags = ["all", "archive"];
