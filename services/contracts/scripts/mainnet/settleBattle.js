// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const auctions = await ethers.getContract("NFTBattles");

  // await auctions.setBattleStarts(2, 1648804905, 60 * 30);
  // await auctions.settleBattle(1).then((tx) => {
  //   console.log(tx.transactionHash || tx.hash);
  //   return tx.wait();
  // });
  await auctions.settleBattle(2).then((tx) => {
    console.log(tx.transactionHash || tx.hash);
    return tx.wait();
  });
  await auctions.settleBattle(3).then((tx) => {
    console.log(tx.transactionHash || tx.hash);
    return tx.wait();
  });
  await auctions.settleBattle(4).then((tx) => {
    console.log(tx.transactionHash || tx.hash);
    return tx.wait();
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
