import * as abis from './abis';

export default {
	1: {
		name: 'Ethereum',
		etherscan: 'https://etherscan.io',
		opensea: 'https://opensea.io/assets/0x3d97aA1E3BFA047C4da5D6Bf76F257337F361860/',
		nft: {
			address: '0x3d97aA1E3BFA047C4da5D6Bf76F257337F361860',
			abi: abis.NFT,
		},
		auctions: {
			address: '0x084c7E7d2FE0F66b4c01154A8f8D15105fB6F7bD',
			abi: abis.Auction,
		},
	},
	4: {
		name: 'Rinkeby',
		test: true,
		etherscan: 'https://rinkeby.etherscan.io',
		opensea: 'https://testnets.opensea.io/assets/0x8943135C2cE283157fD48aB674E847057fBb8F89/',
		nft: {
			address: '0x8943135C2cE283157fD48aB674E847057fBb8F89',
			abi: abis.NFT,
		},
		auctions: {
			address: '0x1b24Cb604f68F517ef1fF6F0A958ED947A4296c4',
			abi: abis.Auction,
		},
	},
	31337: {
		name: 'Hardhat',
		test: true,
		etherscan: 'https://rinkeby.etherscan.io',
		opensea: 'https://testnets.opensea.io/assets/0xD82a26cB592d7691Cb1cc51E7E2Bd31C22DE48Ba/',
		nft: {
			address: '0x75537828f2ce51be7289709686A69CbFDbB714F1',
			abi: abis.NFT,
		},
		auctions: {
			address: '0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6',
			abi: abis.Auction,
		},
	},
};
