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

    const addTx = await dArchive.addArchive(contentID);
    await addTx.wait();

    expect(addTx).to.emit(dArchive, "ArchiveAdded").withArgs(contentID);
  });
});
