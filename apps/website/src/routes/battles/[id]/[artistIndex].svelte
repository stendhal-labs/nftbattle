<script>
	import { getContext, onDestroy, onMount } from 'svelte';

	import { page } from '$app/stores';
	import { receive } from '$lib/transitions/sendReceive';

	import battles from '$lib/data/battles';
	import Button from '$lib/components/Button.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { base } from '$app/paths';
	import OnlySigner from '$lib/components/Network/OnlySigner.svelte';
	import { getAuctionContract, getBattleBids } from '$lib/modules/contracts';
	import { browser } from '$app/env';
	import { provider, signerAddress } from '$lib/modules/wallet';
	import ErrorComponent from '$lib/components/ErrorComponent.svelte';
	import { goto } from '$app/navigation';

	const auctionState = getContext('auctionState');

	let error;

	let amount;
	let amountBN;

	let balance;

	let canBid;
	let minBid;
	let currentBid;
	let currentBidder;

	let isBidding;
	let isWaiting;
	let isConfirming;

	let timeout;

	$: id = parseInt($page.params.id);
	$: battle = battles[id];
	$: artistIndex = parseInt($page.params.artistIndex);
	$: artist = battle.artists[artistIndex];
	$: amountBN = amount && ethers.utils.parseEther(amount.toString());
	$: canBid = amountBN && amountBN.gte(minBid) && currentBidder != $signerAddress;
	$: {
		if (browser && $auctionState.endsAt <= Date.now()) {
			goto(`/battles/${id}`);
		}
	}

	$: checkBalance($signerAddress);

	const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

	async function checkBids() {
		clearTimeout(timeout);

		const bidList = await getBattleBids(id);

		currentBidder = bidList[0][artistIndex];
		currentBid = bidList[1][artistIndex];

		const theBid = currentBid.gt(0)
			? currentBid.mul(105).div(100)
			: ethers.utils.parseEther('0.001');

		// force a math.ceil at 3 digit after .
		const temp = parseFloat(ethers.utils.formatEther(theBid.mul(1000)));
		minBid = ethers.utils.parseEther((Math.ceil(temp) / 1000).toFixed(3));

		if (amount == undefined) {
			amount = ethers.utils.formatEther(minBid.toString());
		}

		await checkBalance($signerAddress);

		timeout = setTimeout(checkBids, 10000);
	}

	async function checkBalance(address) {
		if (address) {
			balance = await $provider.getBalance(address);
		}
	}

	async function onBid() {
		isBidding = true;
		isWaiting = true;
		error = null;
		try {
			await getAuctionContract()
				.bid(id, artistIndex, { value: amountBN })
				.then((tx) => tx.wait());
			isConfirming = true;
			isWaiting = false;
			await checkBids();
			await $auctionState.reloadData();
			await sleep(1000);
		} catch (e) {
			console.log(e);
			error = e;
		}
		isWaiting = false;
		isConfirming = false;
		isBidding = false;
	}

	onMount(() => {
		if ($auctionState.endsAt > Date.now()) {
			checkBids();
		} else {
			goto(`/battles/${id}`);
		}
	});

	onDestroy(() => {
		clearTimeout(timeout);
	});
</script>

{#if $auctionState.endsAt > Date.now()}
	{#if isBidding}
		<div class="is-bidding">
			{#if isWaiting}
				<div class="is-waiting">
					<div class="icon__wrapper">
						<Loader revert={true} size={48} />
					</div>
					<strong class="label">Submitting bid...</strong>
				</div>
			{:else if isConfirming}
				<div class="is-confirming">
					<div class="icon__wrapper">
						<div class="icon__mask">
							<img width="50" height="35" src="{base}/images/icons/confirm.svg" alt="" />
						</div>
					</div>
					<strong class="label">Success!</strong>
				</div>
			{/if}
		</div>
	{/if}
	<section>
		<figure in:receive={{ key: artist.image }}>
			<div class="image__wrapper">
				<img src={artist.image} alt={artist.name} />
			</div>
			<figcaption><a href={artist.social} target="_blank">{artist.name}</a></figcaption>
		</figure>
		<div class="content">
			{#if currentBid && currentBid.gt(0)}
				<h2>Current Bid</h2>
				<strong class="current">
					{parseFloat(ethers.utils.formatEther(currentBid.toString())).toFixed(3)} ETH
				</strong>
			{/if}
			<h2>Place a bid</h2>
			{#if minBid}
				<span class="bid__minimum"
					>You must bid at least <button
						on:click={() => (amount = ethers.utils.formatEther(minBid))}
						><strong>{minBid ? ethers.utils.formatEther(minBid) : ''} ETH</strong></button
					></span
				>
			{/if}
			<div class="form__line">
				<div class="input__wrapper">
					<input type="number" bind:value={amount} />
					<strong class="input__label__end">ETH</strong>
				</div>
			</div>
			<div class="balance">
				<span class="balance__label">You balance is </span>
				{#if balance}
					<span class="balance__value"
						>{parseFloat(ethers.utils.formatEther(balance)).toFixed(3)} ETH</span
					>
				{:else}
					<span class="balance__value">... ETH</span>
				{/if}
			</div>
		</div>
		<ErrorComponent {error} />
		<div class="buttons" in:receive={{ key: 'bidbutton' }}>
			<OnlySigner>
				{#if currentBidder && currentBidder == $signerAddress}
					<strong>You are the current highest bidder</strong>
				{:else}
					<Button props={{ reversed: true, disabled: !canBid }} on:click={onBid}>Place a bid</Button
					>
				{/if}
			</OnlySigner>
		</div>
		<!-- <footer><a href="#">Terms and conditions</a></footer> -->
	</section>
{/if}

<style lang="postcss">
	section {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		@apply pt-10;
	}

	.image__wrapper {
		width: 142px;
		height: 142px;
		margin: 0 auto;
	}

	.image__wrapper img {
		width: 100%;
		height: auto;
	}

	figcaption {
		@apply text-center mt-4;
		font-weight: 600;
	}

	h2 {
		font-size: var(--font-large);
		@apply mt-8;
	}

	.bid__minimum {
		@apply mt-4;
	}

	.form__line {
		@apply mt-8;
	}

	.balance {
		@apply mt-2;
	}

	.balance__label {
		color: var(--grey);
	}

	input {
		appearance: textfield;
	}

	.buttons {
		@apply flex flex-row justify-center pt-8;
	}
	footer {
		@apply mt-8;
		text-align: center;
	}

	.is-bidding {
		@apply flex flex-col items-center justify-center;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 100;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.is-bidding .icon__wrapper {
		@apply p-4;
		background-color: var(--foreground);
		border-radius: 10px;
	}

	.is-bidding .label {
		font-size: var(--font-large);
	}

	.is-waiting,
	.is-confirming {
		@apply flex flex-col items-center justify-center gap-8;
	}

	.icon__mask img {
		width: 50px;
		height: 35px;
		animation: appear 1s forwards;
	}

	button:hover {
		text-decoration: underline;
	}

	@keyframes appear {
		0% {
			clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
		}
		100% {
			clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
		}
	}

	.is-waiting {
	}

	.is-confirming {
	}

	.current {
		@apply mt-8;
		text-align: center;
		font-weight: bold;
	}
</style>
