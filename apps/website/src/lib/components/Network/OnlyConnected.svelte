<script>
	import { checkedWallet, connected } from '$lib/modules/wallet';
	import Loader from '../Loader.svelte';

	import OnlySupportedNetwork from './OnlySupportedNetwork.svelte';
</script>

{#if !$checkedWallet}
	<div class="loader">
		<Loader />
	</div>
{:else if !$connected}
	<div class="only-connected">
		<slot name="only-connected">
			<p>You need a browser wallet (like Metamask) to access this feature.</p>
		</slot>
	</div>
{:else}
	<OnlySupportedNetwork>
		<slot />
	</OnlySupportedNetwork>
{/if}

<style lang="postcss">
	.only-connected {
		@apply flex flex-col items-center justify-center py-8 gap-8;
	}

	.loader {
		margin: 0 auto;
	}
</style>
