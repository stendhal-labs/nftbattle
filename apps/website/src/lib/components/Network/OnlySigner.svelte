<script>
	import Button from '$lib/components/Button.svelte';
	import { connectAccount, signerAddress } from '$lib/modules/wallet';

	import OnlySupportedNetwork from './OnlySupportedNetwork.svelte';

	async function onConnect() {
		await connectAccount();
	}
</script>

{#if !$signerAddress}
	<div class="only-connected">
		<Button props={{ rounded: true }} on:click={onConnect}>Connect Wallet</Button>
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
</style>
