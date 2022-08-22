import { expect } from "chai";
import { Contract } from "ethers";
import { deployments, ethers } from "hardhat";

describe("DArchive", function () {
  let dArchive: Contract;

  before(async function () {
    await deployments.fixture(["all"]);
    dArchive = await ethers.getContract("DArchive");
  });

  it("Should add new archive", async function () {
    const contentID = "Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu";
    const contentURL = "https://polygon.technology/";
    const title = "Polygon";
    const addTx = await dArchive.addArchive(contentID, contentURL, title);
    await addTx.wait();

    expect(addTx)
      .to.emit(dArchive, "ArchiveAdded")
      .withArgs(contentID, title, contentURL);
  });

  it("Should mint a new soulbound nft for supporter", async function () {
    const [deployer, supporter] = await ethers.getSigners();
    const tx = await dArchive.connect(supporter).support({
      value: ethers.utils.hexStripZeros(
        ethers.utils.parseEther("1").toHexString()
      ),
    });
    await tx.wait();
    const supporterNFT = await ethers.getContract("SupporterNFT");
    expect(await supporterNFT.balanceOf(supporter.address)).to.eq(1);
  });
});
