<script>
	import OnlyConnected from '$lib/components/Network/OnlyConnected.svelte';

	import { connect } from '$lib/modules/wallet';
	import { onMount } from 'svelte';

	import '../app.css';

	onMount(connect);
</script>

<OnlyConnected>
	<slot />
</OnlyConnected>
