import { expect, test } from '@playwright/test';

async function apiInfo(page) {
	await page.route('/api/info', async route => {
		await route.fulfill({ body: 'playwright mock'});
	});
}
async function sampleConstellation(page) {
	await page.route('/api/constellation', async route => {
		const json = {"interfaces":[{"id":"bp","name":"BP","type":"topic","color":"","kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"bp_flat","name":"BP (flat)","type":"topic","color":"","kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"asset","name":"Asset","type":"topic","color":"","kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"topic_asset_flat","name":"Asset (flat)","type":"topic","color":"","kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"doc_xxx","name":"doc_XXX","type":"topic","color":"","kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"doc_xxx_flat","name":"doc_XXX (flat)","type":"topic","color":"","kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"code","name":"code_tab","type":"topic","color":"","kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"users","name":"users","type":"topic","color":"","kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"codedb","name":"code_tab db","type":"db","color":"","kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"coderest","name":"code_tab rest","type":"rest","color":"","kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"cont","name":"Container","type":"topic","color":"","kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"cont_flat","name":"Container (flat)","type":"topic","color":"","kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"bpcont","name":"BP \u0026 Container merged","type":"topic","color":"","kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""}],"processes":[{"id":"acomaze-persistor","name":"acomaze persistor","type":"spring-boot","color":"","inputs":[{"source":"code","info":"Code Tables","trigger":true},{"source":"asset","info":"Currencies","trigger":true},{"source":"users","info":"Users","trigger":true}],"outputs":[{"target":"codedb","info":"persist","trigger":true}],"kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"acomaze-rest","name":"acomaze rest","type":"spring-boot","color":"","inputs":[{"source":"codedb","info":"Code Tables / Users / etc."}],"outputs":[{"target":"coderest","info":"serve"}],"kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"bp_flatter","name":"data miner - bp","type":"spring-boot","color":"","inputs":[{"source":"bp","info":"","trigger":true},{"source":"coderest","info":"fetch codes"}],"outputs":[{"target":"bp_flat","info":"BP","trigger":true}],"kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"cont_flatter","name":"data miner - cont","type":"spring-boot","color":"","inputs":[{"source":"cont","info":"","trigger":true},{"source":"coderest","info":"fetch codes"}],"outputs":[{"target":"cont_flat","info":"Cont","trigger":true}],"kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"asset_flat","name":"data miner - asset","type":"spring-boot","color":"","inputs":[{"source":"asset","info":"","trigger":true},{"source":"coderest","info":"fetch codes"}],"outputs":[{"target":"topic_asset_flat","info":"Asset","trigger":true}],"kubernetesInfo":null,"labels":{"kokabie.li":"sample"},"description":""},{"id":"bp_cont_combiner","name":"bp cont combiner","type":"spring-boot","color":"","inputs":[{"source":"cont_flat","info":"","trigger":true},{"source":"bp_flat","info":"","trigger":true}],"outputs":[{"target":"bpcont","info":"Combined","trigger":true}],"kubernetesInfo":null,"labels":null,"description":""},{"id":"doc_xxx_processor","name":"data miner - doc_xxx","type":"spring-boot","color":"","inputs":[{"source":"doc_xxx","info":"","trigger":true},{"source":"coderest","info":"fetch codes"}],"outputs":[{"target":"doc_xxx_flat","info":"doc_xxx","trigger":true}],"kubernetesInfo":null,"labels":{"doc":"xxx"},"description":""}]};
		await route.fulfill({ json });
	});
}


test('index page should show kokabieli', async ({ page }) => {
	apiInfo(page).then(r => console.log(r));
	sampleConstellation(page).then(r => console.log(r));
	await page.goto('/');
	expect(await page.$('svg')).toBeTruthy();
	expect(await page.textContent('h3')).toBe('kokabieli');
});

test('load index page grah', async ({ page }) => {
	apiInfo(page).then(r => console.log(r));
	sampleConstellation(page).then(r => console.log(r));
	await page.goto('/');
	expect(await page.$('svg')).toBeTruthy();
	expect(await page.$('id=asset_flat')).toBeTruthy();
});

test('index page should show a graph', async ({ page }) => {
	apiInfo(page).then(r => console.log(r));
	sampleConstellation(page).then(r => console.log(r));
	await page.goto('/');
	expect(await page.$('svg')).toBeTruthy();
	expect(await page.$('id=asset_flat')).toBeTruthy();
	await page.click('id=asset_flat');
	expect(await page.textContent('h2')).toBe('data miner - asset');
});