import preprocess from 'svelte-preprocess';
// import adapter from '@sveltejs/adapter-auto';
// import adapter from '@sveltejs/adapter-static';
import adapter from '@sveltejs/adapter-node';
/** @type {import('@sveltejs/kit').Config} */

const dev = process.env.NODE_ENV === 'development';

const config = {
	kit: {
		prerender: {
			default: true,
		},
		adapter: adapter(),
	},

	preprocess: [
		preprocess({
			postcss: true,
		}),
	],
};

export default config;
