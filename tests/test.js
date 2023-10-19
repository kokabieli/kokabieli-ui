import { expect, test } from '@playwright/test';


test('index page should show kokabieli', async ({ page }) => {
	await page.goto('/?file=sample.json');
	expect(await page.$('svg')).toBeTruthy();
	await page.screenshot({ path: 'screenshots/show-kokabieli.png', fullPage: true });
	expect(await page.textContent('h3')).toBe('kokabieli');
});

test('index page should show a graph', async ({ page }) => {
	await page.goto('/?file=sample.json');
	expect(await page.$('svg')).toBeTruthy();
	await page.screenshot({ path: 'screenshots/root-index.png', fullPage: true });
	expect(await page.$('id=portfolio_flat')).toBeTruthy();
	await page.screenshot({ path: 'screenshots/root-graphed.png', fullPage: true });
	await page.click('id=portfolio_flat');
	expect(await page.textContent('h2')).toBe('portfolio (flat)');
	await page.screenshot({ path: 'screenshots/root-clicked.png', fullPage: true });
});