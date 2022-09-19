const env = {
	VITE_ENV: import.meta.env.VITE_ENV,
	VITE_FORCE_CHAIN_ID: import.meta.env.VITE_FORCE_CHAIN_ID,
};

for (let key in env) {
	if (env[key] == undefined) {
		throw new Error(`env.${key} not set`);
	}
}

export default env;
