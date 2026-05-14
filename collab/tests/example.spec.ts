import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://editorial-collaboration-demo.local.dev-gutools.co.uk/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});
