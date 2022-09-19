import { readable } from 'svelte/store';

function getNow() {
	return Date.now();
}

export default readable(getNow(), function start(set) {
	const interval = setInterval(() => {
		set(getNow());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});
