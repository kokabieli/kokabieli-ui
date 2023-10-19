import { expect, test } from "@playwright/test";


async function sampleConstellation(page) {
    await page.route("/constellation-data/*", async route => {
        const file = route.request().url().split("/").pop();
        await route.fulfill({
            path: `static/sample-constellation-data/${file}`
        });
    });
}

test("index page should show kokabieli", async ({ page }) => {
    sampleConstellation(page).then(r => console.log(r));
    await page.goto("/?file=sample.json");
    expect(await page.$("svg")).toBeTruthy();
    await page.screenshot({ path: "screenshots/show-kokabieli.png", fullPage: true });
    expect(await page.textContent("h3")).toBe("kokabieli");
});

test("index page should show a graph", async ({ page }) => {
    sampleConstellation(page).then(r => console.log(r));
    await page.goto("/?file=sample.json");
    expect(await page.$("svg")).toBeTruthy();
    await page.screenshot({ path: "screenshots/root-index.png", fullPage: true });
    expect(await page.$("id=portfolio_flat")).toBeTruthy();
    await page.screenshot({ path: "screenshots/root-graphed.png", fullPage: true });
    await page.click("id=portfolio_flat");
    expect(await page.textContent("h2")).toBe("portfolio (flat)");
    await page.screenshot({ path: "screenshots/root-clicked.png", fullPage: true });
});