<script>
	import { onDestroy, onMount, setContext } from 'svelte';

	import { page } from '$app/stores';
	import { browser } from '$app/env';

	import now from '$lib/modules/now';
	import battles from '$lib/data/battles';
	import Timer from '$lib/components/Timer.svelte';
	import { writable } from 'svelte/store';
	import OnlyConnected from '$lib/components/Network/OnlyConnected.svelte';
	import { getBattleBids, getBattleEndsAt } from '$lib/modules/contracts';
	import { connected } from '$lib/modules/wallet';

	const auctionState = writable({
		state: null,
		timer: 0,
		result: [],
		endsAt: 0,
		reloadData: start,
	});

	setContext('auctionState', auctionState);

	let timeoutStart;
	let ongoing;

	let timer = 0;
	let checked = 0;

	$: id = parseInt($page.params.id);
	$: battle = battles[id];
	$: $connected && getBattleResult(id);

	async function getBattleResult(id) {
		if ($connected) {
			try {
				const result = await getBattleBids(id);

				$auctionState.result = [
					{ bidder: result[0][0], amount: result[1][0] },
					{ bidder: result[0][1], amount: result[1][1] },
				];
			} catch (e) {
				$auctionState.result = [];
			}
		}
	}

	async function getBattleData() {
		if (!$connected) return;
		try {
			await getBattleResult(id);
			await getBattleEndTime(id);
		} catch (e) {
			console.log(e);
		}
	}

	async function getBattleEndTime(id) {
		if (!$connected) return 0;

		$auctionState.endsAt = await getBattleEndsAt(id);
	}

	async function start() {
		clearTimeout(timeoutStart);
		await getBattleData();

		if ($auctionState.state == 'ended') {
			return;
		}

		if ($now >= battle.startsAt) {
			// get real end from chain
			const end = $auctionState.endsAt;
			if (end > $now) {
				ongoing = true;
				$auctionState.timer = timer = end - $now;
				$auctionState.state = 'ongoing';
				timeoutStart = setTimeout(start, 10000);
			} else {
				$auctionState.timer = timer = 0;
				$auctionState.state = 'ended';
				// check again in 15 seconds
				timeoutStart = setTimeout(start, 15000);
			}
		} else if ($auctionState.state != 'coming') {
			timer = battle.startsAt - $now;
			timeoutStart = setTimeout(() => window.location.reload(), timer);
			$auctionState.state = 'coming';
		}
	}

	onMount(start);

	onDestroy(() => {
		clearTimeout(timeoutStart);
	});
</script>

{#if $auctionState}
	<section>
		<header>
			{#if timer}
				{#if ongoing}
					<h1>Auction End</h1>
				{:else}
					<h1>Coming soon!</h1>
				{/if}
				<Timer {timer} />
			{/if}
		</header>
		<section class="auction__content">
			<OnlyConnected>
				{#if $auctionState.state && $auctionState.result.length}
					<slot />
				{/if}
			</OnlyConnected>
		</section>
	</section>
{/if}

<style lang="postcss">
	section {
		@apply flex flex-col;
		height: calc(100vh - 4rem);
	}

	header {
		text-align: center;
	}

	.auction__endsAt {
		@apply flex flex-row items-center justify-center gap-6;
		font-size: var(--font-big);
		font-weight: 600;
	}

	.auction__content {
		height: 100%;
		position: relative;
	}
</style>
