import { test, expect } from '@playwright/test';

test('home loads and has CHAOS OS header', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'CHAOS OS' })).toBeVisible();
});

test('modules load', async ({ page }) => {
  const paths = ['/wymowki', '/memy', '/paski', '/soundboard', '/wyrocznia', '/pierdolator'];
  for (const p of paths) {
    await page.goto(p);
    await expect(page).toHaveURL(new RegExp(`${p}$`));
  }
});
