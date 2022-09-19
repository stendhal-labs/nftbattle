// deploy/00_deploy_my_contract.js
module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  let wethAddress = ethers.constants.AddressZero;
  // locally use weth mock
  if (network.live == false) {
    wethAddress = (await deployments.get("WETH")).address;
  }

  await deploy("NFTBattles", {
    from: deployer,
    args: [
      process.env.MODULE_URI || "",
      process.env.BASE_URI || "",
      wethAddress,
      process.env.CONTRACT_OWNER || ethers.constants.AddressZero,
    ],
    log: true,
  });
};
module.exports.tags = ["NFTBattles"];
