import { expect, test } from '@playwright/test';

async function apiInfo(page) {
	await page.route('/api/info', async route => {
		await route.fulfill({ body: 'playwright mock'});
	});
}
async function sampleConstellation(page) {
	await page.route('/api/constellation', async route => {
		const json = {
			"interfaces": [
				{
					"id": "client",
					"name": "client",
					"type": "topic",
					"color": "",
					"kubernetesInfo": null,
					"labels": {
						"kokabie.li": "sample"
					},
					"description": ""
				},
				{
					"id": "client_flat",
					"name": "client (flat)",
					"type": "topic",
					"color": "",
					"kubernetesInfo": null,
					"labels": {
						"kokabie.li": "sample"
					},
					"description": ""
				},
				{
					"id": "portfolio",
					"name": "portfolio",
					"type": "topic",
					"color": "",
					"kubernetesInfo": null,
					"labels": {
						"kokabie.li": "sample"
					},
					"description": ""
				},
				{
					"id": "portfolio_flat",
					"name": "portfolio (flat)",
					"type": "topic",
					"color": "",
					"kubernetesInfo": null,
					"labels": {
						"kokabie.li": "sample"
					},
					"description": ""
				},
				{
					"id": "portfolio_client_merged",
					"name": "Client \u0026 Portfolio merged",
					"type": "topic",
					"color": "",
					"kubernetesInfo": null,
					"labels": {
						"kokabie.li": "sample"
					},
					"description": ""
				}
			],
			"processes": [
				{
					"id": "client_flatter",
					"name": "client flatter",
					"type": "spring-boot",
					"color": "",
					"inputs": [
						{
							"source": "client",
							"info": "",
							"trigger": true
						}
					],
					"outputs": [
						{
							"target": "client_flat",
							"info": "clients",
							"trigger": true
						}
					],
					"kubernetesInfo": null,
					"labels": {
						"kokabie.li": "sample"
					},
					"description": ""
				},
				{
					"id": "portfolio_flatter",
					"name": "portfolio flatter",
					"type": "spring-boot",
					"color": "",
					"inputs": [
						{
							"source": "portfolio",
							"info": "",
							"trigger": true
						}
					],
					"outputs": [
						{
							"target": "portfolio_flat",
							"info": "portfolio",
							"trigger": true
						}
					],
					"kubernetesInfo": null,
					"labels": {
						"kokabie.li": "sample"
					},
					"description": ""
				},
				{
					"id": "client_portfolio_merger",
					"name": "client portfolio merger",
					"type": "spring-boot",
					"color": "",
					"inputs": [
						{
							"source": "client_flat",
							"info": "",
							"trigger": true
						},
						{
							"source": "portfolio_flat",
							"info": "",
							"trigger": true
						}
					],
					"outputs": [
						{
							"target": "portfolio_client_merged",
							"info": "portfolio_client_merged",
							"trigger": true
						}
					],
					"kubernetesInfo": null,
					"labels": null,
					"description": ""
				}
			]
		};
		await route.fulfill({ json });
	});
}

test('index page should show kokabieli', async ({ page }) => {
	apiInfo(page).then(r => console.log(r));
	sampleConstellation(page).then(r => console.log(r));
	await page.goto('/');
	expect(await page.$('svg')).toBeTruthy();
	await page.screenshot({ path: 'screenshots/show-kokabieli.png', fullPage: true });
	expect(await page.textContent('h3')).toBe('kokabieli');
});

test('index page should show a graph', async ({ page }) => {
	apiInfo(page).then(r => console.log(r));
	sampleConstellation(page).then(r => console.log(r));
	await page.goto('/');
	expect(await page.$('svg')).toBeTruthy();
	await page.screenshot({ path: 'screenshots/root-index.png', fullPage: true });
	expect(await page.$('id=portfolio_flat')).toBeTruthy();
	await page.screenshot({ path: 'screenshots/root-graphed.png', fullPage: true });
	await page.click('id=portfolio_flat');
	expect(await page.textContent('h2')).toBe('portfolio (flat)');
	await page.screenshot({ path: 'screenshots/root-clicked.png', fullPage: true });
});
