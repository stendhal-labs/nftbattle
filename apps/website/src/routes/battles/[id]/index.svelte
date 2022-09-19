<script>
	import { page } from '$app/stores';

	import battles from '$lib/data/battles';
	import ArtistVs from '$lib/components/ArtistVS.svelte';
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';
	import ResultScreen from '$lib/components/ResultScreen.svelte';
	import Loader from '$lib/components/Loader.svelte';

	let transitioning;

	const auctionState = getContext('auctionState');

	$: id = parseInt($page.params.id);
	$: battle = battles[id];

	function transitionTo(index) {
		transitioning = true;
		goto(`/battles/${id}/${index}`);
	}
</script>

<section class:transitioning>
	{#if battle}
		{#if $auctionState.state == 'ended'}
			{#if $auctionState.result.length}
				<ResultScreen {battle} {auctionState} />
			{:else}
				<Loader />
			{/if}
		{:else if $auctionState.state && battle.artists.length}
			<div class="vs">
				<div class="side left">
					<ArtistVs
						artist={battle.artists[0]}
						bid={$auctionState.result?.[0]}
						on:bid={() => transitionTo(0)}
					/>
				</div>
				<div class="side right">
					<ArtistVs
						artist={battle.artists[1]}
						bid={$auctionState.result?.[1]}
						on:bid={() => transitionTo(1)}
					/>
				</div>
				<div class="decoration">
					<strong>VS</strong>
				</div>
			</div>
		{/if}
	{/if}
</section>

<style lang="postcss">
	.transitioning {
		opacity: 0;
	}
	.vs {
		@apply flex flex-row gap-16 pt-16 relative;
		height: 100%;
	}

	.side {
		@apply flex flex-col;
		overflow: auto;
		width: 50%;
	}

	.decoration {
		position: absolute;
		top: calc(4rem + 28px);
		left: 50%;
		transform: translateX(-50%);
		width: 2px;
		background-color: var(--foreground);
		height: 100%;
	}

	.decoration strong {
		@apply p-2 px-3;
		position: absolute;
		left: 50%;
		top: 0;
		transform: translateX(-50%);
		font-size: var(--font-large);
		background-color: var(--foreground);
		color: var(--background);
		border-radius: 4px;
	}

	section {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
