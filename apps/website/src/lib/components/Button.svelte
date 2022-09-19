<script>
	export let href;
	export let target;

	export let props = {
		reversed: false,
		disabled: undefined,
	};
</script>

{#if !href}
	<button
		class="button"
		class:reversed={props.reversed}
		disabled={props.disabled ? true : undefined}
		on:click><slot /></button
	>
{:else}
	<a class="button" class:reversed={props.reversed} {href} {target}><slot /></a>
{/if}

<style lang="postcss">
	.button {
		@apply py-2 px-8 font-medium inline-block;
		text-decoration: none;
		background-color: var(--foreground);
		border: 1px solid var(--foreground);
		color: var(--background);
		transition: all 0.35s;
		font-weight: 600;
		min-width: 61px;
	}

	.button:hover,
	.button.reversed {
		background-color: var(--background);
		border-color: var(--foreground);
		color: var(--foreground);
	}

	.button.reversed:hover {
		background-color: var(--foreground);
		border-color: var(--foreground);
		color: var(--background);
	}

	[disabled] {
		filter: grayscale(0.5);
		pointer-events: none;
	}
</style>
