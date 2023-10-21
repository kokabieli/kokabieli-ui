import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		proxy: {
			'/constellation-data': {
				target: 'http://localhost:5173/sample-constellation-data',
				rewrite: (path) => path.replace(/^\/constellation-data/, '\/'),
			},
		},
	},

};

export default config;
