<script>
	import { browser } from '$app/env';
	import { getBattleEndsAt } from '$lib/modules/contracts';
	import now from '$lib/modules/now';
	import { connected } from '$lib/modules/wallet';
	import { onDestroy } from 'svelte';

	export let battle;
	export let battleId;

	let endsAt = 0;

	let loaded = false;
	let coming = false;
	let ongoing = false;
	let over = false;

	let timeout;

	$: browser && $connected && checkState();

	async function checkState() {
		clearTimeout(timeout);

		coming = battle.startsAt > $now;
		endsAt = battle.startsAt + battle.duration;
		if (battle.startsAt < $now && !ongoing) {
			endsAt = await getBattleEndsAt(battleId);
			ongoing = endsAt > $now;
		}

		over = !coming && !ongoing;
		timeout = setTimeout(checkState, 5000);
		loaded = true;
	}

	onDestroy(() => clearTimeout(timeout));
</script>

<div class="line">
	<strong class="battle__title">{battle.title}</strong>
	<span class="battle__status" class:coming class:ongoing class:over>
		{#if loaded}
			{#if coming}
				Coming soon
			{:else if ongoing}
				Ongoing
			{:else}
				Over
			{/if}
		{/if}
	</span>
</div>
<div class="line">
	<span class="battle__artists">
		{#if battle.artists.length}
			{battle.artists[0].name} VS {battle.artists[1].name}
		{/if}
	</span>
	{#if browser && loaded}
		<span class="battle__time">
			{#if ongoing}
				ends {moment(endsAt).fromNow()}
			{:else}
				{moment(battle.startsAt).fromNow()}
			{/if}
		</span>
	{/if}
</div>

<style lang="postcss">
	.line {
		@apply flex flex-row items-center justify-between;
	}

	.battle__time,
	.battle__artists {
		font-size: var(--font-small);
		color: var(--grey);
	}

	.over {
		color: var(--yellow);
	}

	.ongoing {
		color: var(--green);
	}

	.coming {
		color: var(--red);
	}
</style>
