import networks from '$lib/data/networks';
import env from './env';

export function getNetwork(networkId) {
	networkId = parseInt(networkId).toString();
	if (!networks[networkId]) throw new Error(`Unknown network ${networkId}`);
	if (networks[networkId].test && env.VITE_ENV !== 'development')
		throw new Error(`Unknown network ${networkId}`);
	if (
		env.VITE_FORCE_CHAIN_ID != undefined &&
		env.VITE_FORCE_CHAIN_ID != '0' &&
		networkId != env.VITE_FORCE_CHAIN_ID
	)
		throw new Error(`Unknown network ${networkId}`);

	return networks[networkId];
}

export function listNetworks() {
	return (
		Object.keys(networks)
			// filter network ids
			.filter((networkId) => env.VITE_FORCE_CHAIN_ID == '0' || networkId == env.VITE_FORCE_CHAIN_ID)
			// mep networks
			.map((networkId) => networks[networkId])
			// filter on vite env
			.filter((network) => env.VITE_ENV == 'development' || !network.test)
			// map name
			.map((network) => network.name)
	);
}

export function getNetworkName(chainId) {
	return {
		1: 'Ethereum',
		4: 'Rinkeby',
		5: 'Görli',
		137: 'Matic',
		80001: 'Mumbai',
		31337: 'Hardhat',
	}[parseInt(chainId)];
}
