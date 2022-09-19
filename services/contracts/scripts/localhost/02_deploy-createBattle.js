// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const auctions = await ethers.getContract("NFTBattles");

  await auctions.createBattle(
    [
      "0xbd9f8735980ca642d9a6df8899bb1430c32ebf67",
      "0x098cfb8a80c9cf7d261b207cb8cb126194c4a8ca",
    ],
    Math.floor(Date.now() / 1000),
    60 * 30
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
