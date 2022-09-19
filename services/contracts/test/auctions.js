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
    [deployer, random, artist1, artist2] = await ethers.getSigners();

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
    artists = [artist1.address, artist2.address],
    startsAt = ~~(Date.now() / 1000),
    duration = 60 * 60
  ) {
    await auctions.createBattle(artists, startsAt - 10, duration);
  }

  describe("Ownership", async function () {
    it("can transfer ownership", async function () {
      const owner = await auctions.owner();
      // random is not current owner
      expect(random.address).to.not.be.equal(owner);

      // set random new owner
      await auctions.transferOwnership(random.address);
      // expect new owner to be random account
      expect(await auctions.owner()).to.be.equal(random.address);

      // expect to throw on subsequent calls since not owner anymore
      await onlyOwner(auctions.transferOwnership(random.address));

      // expect random to be able to transfer ownership again
      await auctions.connect(random).transferOwnership(deployer.address);
    });
  });

  describe("Battle creation / cancel", async function () {
    it("works only on known battles", async function () {
      await revertWith(auctions.cancelBattle(1), "UnknownBattle()");
    });

    it("only allows owner to create a battle", async function () {
      await onlyOwner(
        auctions
          .connect(random)
          .createBattle(
            [artist1.address, artist2.address],
            ~~(Date.now() / 1000),
            60 * 60
          )
      );

      await createBattle();
    });

    it("can cancel a battle", async function () {
      await createBattle();
      await revertWith(
        auctions.connect(random).cancelBattle(1),
        "Ownable: caller is not the owner"
      );

      await auctions.cancelBattle(1);
    });
  });

  describe("Bidding", async function () {
    it("works only on known battles", async function () {
      await revertWith(auctions.bid(1, 0), "UnknownBattle()");
    });

    it("can not bid before start or after end", async function () {
      await createBattle(undefined, ~~(Date.now() / 1000) + 59 * 60, 60 * 60);

      await revertWith(auctions.bid(1, 0), "BattleInactive()");

      await addHour();
      await addHour();
      await addHour();

      await revertWith(auctions.bid(1, 0), "BattleInactive()");
    });

    it("can bid on ongoing battle", async function () {
      await createBattle();

      await auctions.bid(1, 0, {
        value: ethers.utils.parseEther("1.0"),
      });
    });

    it("can not bid on canceled battle", async function () {
      await createBattle();

      await auctions.cancelBattle(1);

      await revertWith(
        auctions.bid(1, 0, {
          value: ethers.utils.parseEther("1.0"),
        }),
        "AlreadySettled()"
      );
    });

    it("can not do low ball bid", async function () {
      await createBattle();

      await revertWith(
        auctions.bid(1, 0, {
          value: ethers.utils.parseEther("0.0001"),
        }),
        "WrongBidValue()"
      );
    });

    it("can only bid atleast 5% higher than last bid", async function () {
      await createBattle();

      await auctions.bid(1, 0, {
        value: ethers.utils.parseEther("1.0"),
      });

      await revertWith(
        auctions.connect(random).bid(1, 0, {
          value: ethers.utils.parseEther("1.005"),
        }),
        "WrongBidValue()"
      );
    });

    it("can not self outbid", async function () {
      await createBattle();

      await auctions.bid(1, 0, {
        value: ethers.utils.parseEther("1.0"),
      });

      await revertWith(
        auctions.bid(1, 0, {
          value: ethers.utils.parseEther("1.5"),
        }),
        "NoSelfOutbid()"
      );
    });

    it("extends the auction if bid in last 5 minutes", async function () {
      await createBattle();

      // add 57 minutes
      await increaseTime(60 * 57);

      const battle = await auctions.battles(1);

      await auctions.bid(1, 0, {
        value: ethers.utils.parseEther("1.0"),
      });

      const battleAfter = await auctions.battles(1);

      expect(battle.endsAt).to.be.lt(battleAfter.endsAt);
    });

    it("refunds previous bidder when outbidding", async function () {
      await createBattle();

      await auctions.bid(1, 0, {
        value: ethers.utils.parseEther("1.0"),
      });

      const tx = await auctions.connect(random).bid(1, 0, {
        value: ethers.utils.parseEther("1.5"),
      });

      await expect(tx).changeEtherBalances(
        [random, deployer],
        [ethers.utils.parseEther("1.5").mul(-1), ethers.utils.parseEther("1")]
      );
    });

    it("can list bids perfectly", async function () {
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

      const list = await auctions.getBattleBids(1);

      expect(list[0][0]).to.be.equal(random.address);

      expect(list[1][0].toString()).to.be.equal(
        value.mul(105).div(100).toString()
      );

      expect(list[0][1]).to.be.equal(deployer.address);

      expect(list[1][1].toString()).to.be.equal(value.mul("2").toString());
    });
  });

  describe("Battle Settle", async function () {
    it("works only on known battles", async function () {
      await revertWith(auctions.settleBattle(1), "UnknownBattle()");
    });

    it("can not settle a canceled battle", async function () {
      await createBattle();

      await auctions.cancelBattle(1);

      await revertWith(auctions.settleBattle(1), "AlreadySettled()");
    });

    it("can not settle a battle not ended", async function () {
      await createBattle();

      await revertWith(auctions.settleBattle(1), "BattleNotEnded()");
    });

    it("can settle a battle if owner", async function () {
      await createBattle();

      await addHour();

      await onlyOwner(auctions.connect(random).settleBattle(1));
      await auctions.settleBattle(1);
    });

    it("can not settle a battle adlready settled", async function () {
      await createBattle();

      await addHour();

      await auctions.settleBattle(1);
      await revertWith(auctions.settleBattle(1), "AlreadySettled()");
    });

    it("sends the eth to the owner", async function () {
      await createBattle();

      await auctions.bid(1, 0, { value: ethers.utils.parseEther("1.0") });
      await auctions.bid(1, 1, { value: ethers.utils.parseEther("1.0") });

      await addHour();

      const tx = await auctions.settleBattle(1);

      await expect(tx).changeEtherBalances(
        [deployer, auctions],
        [ethers.utils.parseEther("2"), ethers.utils.parseEther("2").mul(-1)]
      );
    });
  });

  describe("Edit Battle", async function () {
    it("works only on known battles", async function () {
      await revertWith(
        auctions.setBattleStarts(1, ~~(Date.now() / 1000), 10),
        "UnknownBattle()"
      );
    });

    it("can edit battle start", async function () {
      await createBattle();
      const startsAt = ~~(Date.now() / 1000) + 60 * 60;

      const battle = await auctions.battles(1);
      expect(battle.startsAt.toNumber()).to.not.equal(startsAt);

      await auctions.setBattleStarts(1, startsAt, 100);

      const battleAfter = await auctions.battles(1);
      expect(battleAfter.startsAt.toNumber()).eq(startsAt);
    });
  });

  describe("Wallets and Shares", async function () {
    it("can edit target wallet", async function () {
      await onlyOwner(
        auctions.connect(random).setWithdrawTarget(random.address)
      );

      await auctions.setWithdrawTarget(random.address);
      expect(await auctions.withdrawTarget()).eq(random.address);
    });

    it("sends the eth to the target if set", async function () {
      await auctions.setWithdrawTarget(random.address);
      await createBattle();

      await auctions.bid(1, 0, { value: ethers.utils.parseEther("1.0") });
      await auctions.bid(1, 1, { value: ethers.utils.parseEther("1.0") });

      await addHour();

      const tx = await auctions.settleBattle(1);

      await expect(tx).changeEtherBalances(
        [random, auctions],
        [ethers.utils.parseEther("2"), ethers.utils.parseEther("2").mul(-1)]
      );
    });
  });

  describe("Weth works on Bad Actors", async () => {
    it("sends WETH if bad actor", async function () {
      await createBattle();

      // then someone else bid
      await badActorMock
        .connect(random)
        .bid(auctions.address, 1, 0, { value: ethers.utils.parseEther("1") });

      const tx = await auctions.connect(random).bid(1, 0, {
        value: ethers.utils.parseEther("1.5"),
      });

      // make sure badActorMock does not get ethereum back
      await expect(tx).to.changeEtherBalance(badActorMock, toBN(0));
      // make sure badActorMock gets WETH back
      expect(await wethMock.balanceOf(badActorMock.address)).to.be.equal(
        ethers.utils.parseEther("1")
      );
    });
  });
});
