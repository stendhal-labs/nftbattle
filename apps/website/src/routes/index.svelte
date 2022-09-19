<script>
	import { base } from '$app/paths';

	import BattleLine from '$lib/components/BattleLine.svelte';

	import battles from '$lib/data/battles';
</script>

<header>
	<div class="brand"><img src="{base}/images/nfc-logo.png" alt="NFC Logo" /> NFT Battle</div>
	<h1>Battle list</h1>
</header>
<ul class="list">
	{#each Object.keys(battles) as battleId, index}
		<li>
			<a href={battles[battleId].artists.length ? `/battles/${battleId}` : '#'}>
				<BattleLine battle={battles[battleId]} {battleId} />
			</a>
		</li>
	{/each}
</ul>

<style lang="postcss">
	.brand {
		@apply flex flex-row items-center justify-center gap-3;
		font-size: var(--font-large);
		font-weight: bold;
	}
	h1 {
		@apply mt-16;
	}

	ul {
		@apply mt-4;
		flex: 1 1 0;
		overflow: auto;
	}

	li {
		@apply pt-2 pb-4;
		border-top: 1px solid var(--foreground);
	}

	li:last-child {
		border-bottom: 1px solid var(--foreground);
	}
</style>
