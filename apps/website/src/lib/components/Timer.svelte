<script>
	import { onDestroy } from 'svelte';
	export let timer;
	const interval = setInterval(() => (timer -= 1000), 1000);

	const second = 1000;
	const minute = 60 * second;
	const hour = 60 * minute;
	const day = 24 * hour;

	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	$: {
		hours = Math.floor(timer / hour);
		minutes = Math.floor((timer % hour) / minute);
		seconds = Math.floor((timer % minute) / second);
	}

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="timer">
	<span>{hours.toString().padStart(2, '0')}</span>
	<span>:</span>
	<span>{minutes.toString().padStart(2, '0')}</span>
	<span>:</span>
	<span>{seconds.toString().padStart(2, '0')}</span>
</div>

<style lang="postcss">
	.timer {
		@apply flex flex-row items-center justify-center gap-6;
		font-size: var(--font-big);
		font-weight: 600;
	}
</style>
