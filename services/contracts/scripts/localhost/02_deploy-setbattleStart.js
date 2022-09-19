// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const auctions = await ethers.getContract("NFTBattles");

  await auctions.setBattleStarts(2, 1649164500, 60 * 45);

  const battle = await auctions.battles(2);

  console.log(battle.startsAt.gte(~~(Date.now() / 1000)));
  console.log(battle.endsAt.gte(~~(Date.now() / 1000)));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
