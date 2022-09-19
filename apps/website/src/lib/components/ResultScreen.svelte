<script>
	import { browser } from '$app/env';
	import { shortenAddress } from '$lib/modules/utils';

	import { receive } from '$lib/transitions/sendReceive';
	import { onDestroy, onMount } from 'svelte';
	export let battle;
	export let auctionState;

	let winner;

	$: {
		if (
			ethers.BigNumber.from($auctionState.result[0]?.amount ?? 0).gt(
				ethers.BigNumber.from($auctionState.result[1]?.amount),
			)
		) {
			winner = 0;
		} else if (
			ethers.BigNumber.from($auctionState.result[1]?.amount ?? 0).gt(
				ethers.BigNumber.from($auctionState.result[0].amount),
			)
		) {
			winner = 1;
		}
	}

	onMount(() => {
		browser && document.body.classList.add('winner');
	});

	onDestroy(() => {
		browser && document.body.classList.remove('winner');
	});
</script>

<div class="result">
	<header>
		<h2>THE WINNER IS</h2>
		<div class="winner-name">
			{#if winner === 0}
				{battle.artists[0].name}
			{:else if winner === 1}
				{battle.artists[1]?.name}
			{:else}
				Tie!
			{/if}
		</div>
	</header>
	<div class="artists">
		<figure in:receive={{ key: battle.artists[0].image }}>
			<div class="image__wrapper">
				<img src={battle.artists[0].image} alt={battle.artists[0].name} />
			</div>
			<figcaption>{battle.artists[0].name}</figcaption>
		</figure>
		<figure in:receive={{ key: battle.artists[1]?.image }}>
			<div class="image__wrapper">
				<img src={battle.artists[1]?.image} alt={battle.artists[1]?.name} />
			</div>
			<figcaption>{battle.artists[1]?.name}</figcaption>
		</figure>
	</div>
	<div class="bids">
		{#if $auctionState.result && $auctionState.result.length}
			{#if $auctionState.result[0]}
				<div class="bid" class:won={winner === undefined || winner === 0}>
					<div class="bid__result">
						<strong>Auctioned</strong>
						<span class="bid__amount">
							{#if $auctionState.result[0]?.amount.gt(0)}
								{ethers.utils.formatEther($auctionState.result[0]?.amount)} ETH
							{:else}N/A
							{/if}
						</span>
					</div>
					<div class="bid__bidder">
						<span class="bid__bidder__label">Owner</span>
						<span class="bid__bidder__address">
							{shortenAddress(
								$auctionState.result[0] &&
									$auctionState.result[0]?.bidder != ethers.constants.AddressZero
									? $auctionState.result[0]?.bidder
									: battle.artists[0]?.address,
							)}
						</span>
					</div>
				</div>
			{/if}
			{#if $auctionState.result[1]}
				<div class="bid" class:won={winner === undefined || winner === 1}>
					<div class="bid__result">
						<strong>Auctioned</strong>
						<span class="bid__amount">
							{#if $auctionState.result[1]?.amount.gt(0)}
								{ethers.utils.formatEther($auctionState.result[1]?.amount)} ETH
							{:else}
								N/A
							{/if}
						</span>
					</div>
					<div class="bid__bidder">
						<span class="bid__bidder__label">Owner</span>
						<span class="bid__bidder__address"
							>{shortenAddress(
								$auctionState.result[1] &&
									$auctionState.result[1]?.bidder != ethers.constants.AddressZero
									? $auctionState.result[1]?.bidder
									: battle.artists[1]?.address,
							)}</span
						>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style lang="postcss">
	header,
	.artists,
	.bids {
		position: absolute;
		transform: translateY(-50%);
		width: 100%;
	}

	header {
		top: 15%;
		@apply text-center;
		font-size: var(--font-large);
		font-weight: 600;
	}

	.winner-name {
		color: var(--yellow);
	}

	.artists {
		@apply grid grid-cols-2 gap-16;
		top: 45%;
	}

	.bids {
		@apply grid grid-cols-2 gap-16;
		top: 75%;
	}

	.bid,
	.bid__result,
	.bid__bidder {
		@apply flex flex-col items-center justify-center;
	}

	.bid {
		@apply gap-6;
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

	.bid.won .bid__amount {
		color: var(--green);
	}

	.bid__amount {
		font-size: var(--font-medium);
		font-weight: 600;
	}

	.bid__result strong,
	.bid__bidder__label {
		color: var(--yellow);
	}
	.bid__bidder__address {
		font-size: var(--font-small);
	}
</style>
