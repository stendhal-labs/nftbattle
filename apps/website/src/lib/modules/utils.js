export function shortenAddress(addr) {
	if (addr.length > 6) {
		return addr.substr(0, 6) + '...' + addr.substr(-3);
	}
}

export function debounce(func, wait = 100) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(this, args);
		}, wait);
	};
}
