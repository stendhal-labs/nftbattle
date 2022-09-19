<script>
	import { chainId } from '$lib/modules/wallet';
	import { getNetwork, listNetworks } from '$lib/modules/networks';

	let knownNetwork = false;
	$: changeChain($chainId);

	function changeChain(chainId) {
		knownNetwork = false;
		try {
			getNetwork(chainId);
			knownNetwork = true;
		} catch (e) {
			knownNetwork = false;
		}
	}
</script>

{#if !knownNetwork}
	<div class="unknown">
		<h2>Unknown network.</h2>
		<p>Please change network on MetaMask for one of the following:</p>
		<p>{listNetworks().join(', ')}</p>
	</div>
{:else}
	<slot />
{/if}

<style lang="postcss">
	.unknown {
		@apply text-center py-8;
	}
	p {
		@apply text-center py-4;
	}
</style>
