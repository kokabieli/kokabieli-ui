/** @type {import("@playwright/test").PlaywrightTestConfig} */
const config = {
  webServer: {
    command: "npm run build && npm run preview",
    port: 4173,
    timeout: 120 * 1000
  },
  testDir: "tests",
  timeout: 120 * 1000,
  globalTimeout: 60 * 60 * 1000,
  expect: {
    timeout: 10 * 1000
  },
  trace: "on-first-retry",
  use: {
    screenshot: "on",
    video: "on"
  },
  screenshot: "only-on-failure"
};

export default config;
