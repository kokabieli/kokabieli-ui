/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		timeout: 120000
	},
	testDir: 'tests',
	timeout: 120000,
	globalTimeout: 120000,
};

export default config;
