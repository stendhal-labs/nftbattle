import { get, writable } from 'svelte/store';
import { connectWallet } from './provider';

export const ethereumProvider = writable(null);
export const signer = writable(null);
export const signerAddress = writable(null);
export const provider = writable(null);
export const chainId = writable(null);
export const connected = writable(false);
export const checkedWallet = writable(false);

ethereumProvider.subscribe((value) => {
	if (value) {
		value.on('accountsChanged', handleAccountsChanged);
		// value.on('chainChanged', (id) => handleChainChanged(id, true));
		value.on('chainChanged', (id) => window.location.reload());
	}
});

async function getInstances() {
	const instances = await connectWallet();
	provider.set(instances.provider);
	ethereumProvider.set(instances.ethereumProvider);

	return instances;
}

export async function connect() {
	try {
		const instances = await getInstances();
		const chainId = await instances.ethereumProvider.request({ method: 'eth_chainId' });
		await handleChainChanged(chainId, false);
		connected.set(true);
		if (localStorage.getItem('wallet:accountConnected')) {
			await connectAccount();
		}
	} catch (e) {
		console.log(e);
	}
	checkedWallet.set(true);
}

export async function connectAccount() {
	await get(ethereumProvider).request({ method: 'eth_requestAccounts' });
	await handleAccountsChanged();
	localStorage.setItem('wallet:accountConnected', 'true');
}

export function disconnect() {
	localStorage.removeItem('wallet:accountConnected');
	signer.set(null);
	signerAddress.set(null);
}

// on account change
async function handleAccountsChanged() {
	try {
		const _signer = getProvider().getSigner();
		signer.set(_signer);

		// get current signer address.
		if (_signer) {
			signerAddress.set(await _signer.getAddress());
		} else {
			// null if disconnected
			signerAddress.set(null);
		}
	} catch (e) {}
}

async function handleChainChanged(_chainId, refresh = true) {
	if (refresh) {
		await getInstances();
		await handleAccountsChanged();
	}
	chainId.set(_chainId);
}

export function getChainId() {
	return get(chainId);
}

export function getSignerOrProvider() {
	return get(signer) || get(provider);
}

export function getSigner() {
	return get(signer);
}

export function getEthereumProvider() {
	return get(ethereumProvider);
}

export function getProvider() {
	return get(provider);
}
