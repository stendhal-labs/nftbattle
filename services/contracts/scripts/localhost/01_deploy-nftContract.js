// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const forgeMaster = await ethers.getContract("ForgeMaster");

  const auctions = await ethers.getContract("NFTBattles");

  const tx = await forgeMaster.createERC721(
    "NFTBattles",
    "FIGHT",
    "ipfs://QmYxUtFnPFntZsrxRTCT3rJZUWC7ti949f1hxnnfnzNB2u", // contractURI
    "", // baseURI
    ethers.constants.AddressZero,
    [{ module: auctions.address, minter: true, enabled: true }],
    ethers.constants.AddressZero,
    0,
    "nft-battles",
    ""
  );

  const receipt = await tx.wait();

  console.log(receipt.logs);

  console.log(await auctions.nftContract());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
