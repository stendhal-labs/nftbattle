<script>
	import { createEventDispatcher, getContext } from 'svelte';
	import Button from './Button.svelte';

	import { send } from '$lib/transitions/sendReceive';
	import { shortenAddress } from '$lib/modules/utils';

	export let artist;
	export let bid;

	const dispatchEvent = createEventDispatcher();

	const auctionState = getContext('auctionState');

	let transitionFn = (a) => {
		return { duration: 0 };
	};

	function clickedOn() {
		// @ts-ignore
		transitionFn = send;
		dispatchEvent('bid');
	}
</script>

<figure out:transitionFn={{ key: artist.image }}>
	<div class="image__wrapper">
		<img src={artist.image} alt={artist.name} />
	</div>
	<figcaption><a href={artist.social} target="_blank">{artist.name}</a></figcaption>
</figure>
<div class="data__holder">
	{#if $auctionState.state != 'coming' && bid != undefined && bid?.bidder && bid?.bidder != ethers.constants.AddressZero}
		<div class="artist__data current_bid">
			<strong class="current_bid__label">Current bid</strong>
			<span class="current_bid__value">{bid.amount / 10 ** 18} ETH</span>
		</div>
		<div class="artist__data highest_bid">
			<span class="highest_bid__label">Highest bidder</span>
			<span class="highest_bid__value">{shortenAddress(bid?.bidder ?? '0x0')}</span>
		</div>
	{/if}
	{#if artist.title}
		<div class="artist__data">
			<span class="data__label">Title</span>
			<span class="data__value">{artist.title}</span>
		</div>
	{/if}
	{#if artist.awards}
		<div class="artist__data">
			<span class="data__label">Awards</span>
			<span class="data__value">{@html artist.awards}</span>
		</div>
	{/if}
	{#if artist.nationality}
		<div class="artist__data">
			<span class="data__label">Nationality</span>
			<span class="data__value">{artist.nationality}</span>
		</div>
	{/if}
	{#if artist.category}
		<div class="artist__data">
			<span class="data__label">Category</span>
			<span class="data__value">{artist.category}</span>
		</div>
	{/if}
</div>
{#if $auctionState.state == 'ongoing'}
	<div class="buttons" out:transitionFn={{ key: 'bidbutton' }}>
		<Button on:click={clickedOn}>Bid</Button>
	</div>
{/if}

<style lang="postcss">
	.data__holder {
		flex: 1 1 0;
		overflow: auto;
	}

	.image__wrapper {
		width: 100px;
		height: 100px;
		margin: 0 auto;
		border-radius: 50%;
		overflow: hidden;
	}

	figcaption {
		@apply text-center mt-4;
		font-weight: 600;
	}

	.current_bid__label,
	.highest_bid__label {
		color: var(--yellow);
	}

	.current_bid__value {
		font-size: var(--font-medium);
		font-weight: 600;
	}

	.artist__data {
		@apply flex flex-col mt-6 px-4;
	}

	.data__value {
		color: var(--grey);
		font-size: var(--font-small);
	}

	.buttons {
		@apply flex flex-row justify-center pt-8;
	}
</style>
