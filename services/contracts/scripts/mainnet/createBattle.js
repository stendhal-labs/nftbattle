// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const auctions = await ethers.getContract("NFTBattles");

  // await auctions
  //   .createBattle(
  //     [
  //       "0x098cfb8a80c9cf7d261b207cb8cb126194c4a8ca",
  //       "0xc48757e7f2166e74DeD006a3EC43a2e44A9f3Aac",
  //     ],
  //     1649154000,
  //     45 * 60
  //   )
  //   .then((tx) => {
  //     console.log(tx.transactionHash);
  //     return tx.wait();
  //   });

  // await auctions
  //   .createBattle(
  //     [
  //       "0x81B11a2042a83F8747F5701c5D4C40DD95e33141",
  //       "0xbd9f8735980ca642d9a6df8899bb1430c32ebf67",
  //     ],
  //     1649170800,
  //     60 * 60
  //   )
  //   .then((tx) => {
  //     console.log(tx.transactionHash);
  //     return tx.wait();
  //   });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
