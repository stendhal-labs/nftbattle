# NFTBattles contracts

## hardhat & hardhat-deploy

uses hardhat and hardhat-deploy to manage deployments

## Contracts

### NFTContract

The NFTContract uses [NiftyForge](https://github.com/niftyforge/contracts/) to deploy a contract for the NFTs

### NFTBattles.sol

Contains all auction mechanisms for the battles

It is a NiftyForge Module, attached to the NFT contract, that will manage the mintings of each NFTs and the URIs for the tokens