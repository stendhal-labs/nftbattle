// deploy/00_deploy_my_contract.js
module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  if (network.live == false) {
    await deploy("WETH", {
      from: deployer,
      log: true,
    });
  }
};
module.exports.tags = ["WETH"];
