import { getNetwork } from '$lib/modules/networks';

import { getSigner, getChainId, getSignerOrProvider } from './wallet';

export function getNFTContract() {
	const contract = getNetwork(getChainId()).nft;
	return new ethers.Contract(contract.address, contract.abi, getSignerOrProvider());
}

export function getAuctionContract() {
	const contract = getNetwork(getChainId()).auctions;
	return new ethers.Contract(contract.address, contract.abi, getSignerOrProvider());
}

export async function getBattleBids(battleId) {
	return await getAuctionContract().getBattleBids(battleId);
}

export async function getBattleEndsAt(battleId) {
	const battle = await getAuctionContract().battles(battleId);
	return battle.endsAt.toNumber() * 1000;
}
