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
    const contentURI = "https://google.com";
    const id = 1;
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const title = "Google";
    const addTx = await dArchive.addArchive(contentID, contentURI, title);
    await addTx.wait();

    expect(addTx)
      .to.emit(dArchive, "ArchiveAdded")
      .withArgs(id, contentID, contentURI, title, timestamp);
  });
});
