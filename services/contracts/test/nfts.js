const { expect } = require("chai");
const { deployments, ethers } = require("hardhat");

const toBN = ethers.BigNumber.from;

async function revertWith(promise, reason) {
  await expect(promise).to.be.revertedWith(reason);
}

async function onlyOwner(promise) {
  await revertWith(promise, "Ownable: caller is not the owner");
}

describe("NFTBattles", () => {
  beforeEach(async () => {
    [deployer, random, artist1, artist2, artist3] = await ethers.getSigners();

    await deployments.fixture();

    auctions = await ethers.getContract("NFTBattles", deployer);

    const NF721Mock = await ethers.getContractFactory("NF721Mock", deployer);
    nftContract = await NF721Mock.deploy();
    await nftContract.initialize(
      "NF721Mock",
      "NF721Mock",
      "",
      "",
      ethers.constants.AddressZero,
      [{ module: auctions.address, minter: true, enabled: true }],
      ethers.constants.AddressZero,
      0
    );

    wethMock = await ethers.getContract("WETH", deployer);

    const BadActorMock = await ethers.getContractFactory(
      "BadActorMock",
      deployer
    );
    badActorMock = await BadActorMock.deploy();
  });

  async function addHour() {
    await increaseTime(60 * 60);
  }

  async function increaseTime(increase = 24 * 60 * 60) {
    await ethers.provider.send("evm_increaseTime", [increase]);
    await ethers.provider.send("evm_mine");
  }

  async function createBattle(
    artists = [artist1.address, artist2.address, artist3.address],
    startsAt = ~~(Date.now() / 1000),
    duration = 60 * 60
  ) {
    await auctions.createBattle(artists, startsAt - 10, duration);
  }

  describe("URIs management", async function () {
    it("can set the group uri if owner", async function () {
      const currentGroupId = await auctions.currentGroupId();
      const baseURI = await auctions.groupBaseURI(currentGroupId);

      await onlyOwner(
        auctions.connect(random).setGroupURI(currentGroupId, "ipfs://")
      );
      await auctions.setGroupURI(currentGroupId, "ipfs://");

      const baseURIAfter = await auctions.groupBaseURI(currentGroupId);

      expect(baseURI).to.not.be.equal(baseURIAfter);
    });
  });

  describe("NFTs", async function () {
    it("are created to the right people", async function () {
      await createBattle();

      const value = ethers.utils.parseEther("1.0");
      await auctions.bid(1, 0, {
        value: value,
      });

      await auctions.connect(random).bid(1, 0, {
        value: value.mul(105).div(100),
      });

      await auctions.connect(random).bid(1, 1, {
        value: value.mul(105).div(100),
      });

      await auctions.bid(1, 1, {
        value: value.mul("2"),
      });

      await addHour();

      await auctions.settleBattle(1);

      expect(await nftContract.ownerOf(1)).to.be.equal(random.address);
      expect(await nftContract.ownerOf(2)).to.be.equal(deployer.address);
      expect(await nftContract.ownerOf(3)).to.be.equal(artist3.address);
    });

    it("have the right URI & royalties", async function () {
      const currentGroupId = await auctions.currentGroupId();
      await auctions.setGroupURI(currentGroupId, "ipfs://");

      await createBattle();

      const value = ethers.utils.parseEther("1.0");
      await auctions.bid(1, 0, {
        value: value,
      });

      await auctions.connect(random).bid(1, 0, {
        value: value.mul(105).div(100),
      });

      await auctions.connect(random).bid(1, 1, {
        value: value.mul(105).div(100),
      });

      await auctions.bid(1, 1, {
        value: value.mul("2"),
      });

      await addHour();

      await auctions.settleBattle(1);

      expect(await nftContract.tokenURI(1)).to.be.equal("ipfs://1.json");
      expect(await nftContract.tokenURI(2)).to.be.equal("ipfs://2.json");
      expect(await nftContract.tokenURI(3)).to.be.equal("ipfs://3.json");

      expect(await nftContract.royaltyInfo(1, 10000)).to.be.deep.equal([
        artist1.address,
        toBN(750),
      ]);
      expect(await nftContract.royaltyInfo(2, 10000)).to.be.deep.equal([
        artist2.address,
        toBN(750),
      ]);
      expect(await nftContract.royaltyInfo(3, 10000)).to.be.deep.equal([
        artist3.address,
        toBN(750),
      ]);

      await onlyOwner(
        auctions.connect(random).incrementGroup("ar://", "https://")
      );
      await auctions.incrementGroup("ar://", "https://");

      expect(await nftContract.tokenURI(1)).to.be.equal("ar://1.json");
      expect(await nftContract.tokenURI(2)).to.be.equal("ar://2.json");
      expect(await nftContract.tokenURI(3)).to.be.equal("ar://3.json");

      await createBattle(undefined, ~~(Date.now() / 1000) + 60 * 60 * 1 - 10);
      await auctions.bid(2, 0, {
        value: value,
      });
      await addHour();
      await auctions.settleBattle(2);
      expect(await nftContract.tokenURI(4)).to.be.equal("https://4.json");
      expect(await nftContract.tokenURI(5)).to.be.equal("https://5.json");
      expect(await nftContract.tokenURI(6)).to.be.equal("https://6.json");
    });
  });
});
