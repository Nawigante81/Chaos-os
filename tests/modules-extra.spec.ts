import { test, expect } from '@playwright/test';

test.describe('extra modules: memy, drake, pierdolator', () => {
  test('memy: empty text save shows validation, then save creates history entry', async ({ page }) => {
    await page.goto('/memy');

    await expect(page.getByRole('heading', { name: /Kreator memów/i })).toBeVisible();

    await page.getByRole('button', { name: /^Wyczyść$/i }).first().click();
    await page.getByRole('button', { name: /^Zapisz tekst$/i }).click();
    await expect(page.getByText(/Ostatnie teksty/i)).toHaveCount(0);

    const memInputs = page.locator('input');
    await memInputs.nth(0).fill('TEST GÓRA');
    await memInputs.nth(1).fill('TEST DÓŁ');
    await page.getByRole('button', { name: /^Zapisz tekst$/i }).click();

    await expect(page.getByText(/Ostatnie teksty/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /TEST GÓRA \/ TEST DÓŁ/i })).toBeVisible();
  });

  test('drake: save text works and clear button clears both inputs', async ({ page }) => {
    await page.goto('/drake');

    await expect(page.getByRole('heading', { name: /Generator mema 2-panelowego/i })).toBeVisible();

    const drakeInputs = page.locator('input');
    const topInput = drakeInputs.nth(0);
    const bottomInput = drakeInputs.nth(1);

    await topInput.fill('NIE ROBIMY QUICK FIXÓW');
    await bottomInput.fill('BUDUJEMY TO RAZ A DOBRZE');

    await page.getByRole('button', { name: /^Zapisz tekst$/i }).click();
    await expect(page.getByText(/Ostatnie teksty/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /NIE ROBIMY QUICK FIXÓW/i })).toBeVisible();

    await page.getByRole('button', { name: /^Wyczyść$/i }).last().click();
    await expect(topInput).toHaveValue('');
    await expect(bottomInput).toHaveValue('');
  });

  test('pierdolator: starts flow, escalates level and can reset to start screen', async ({ page }) => {
    await page.goto('/pierdolator');

    await expect(page.getByRole('heading', { name: /PIERDOLATOR 3000/i })).toBeVisible();

    await page.getByRole('button').filter({ hasText: '?' }).first().click();

    await expect(page.getByText(/POZIOM WKURWIENIA/i)).toBeVisible();

    const escalate = page.getByRole('button', { name: /DOJEB MU BARDZIEJ|ZNISZCZ GO KURWA/i });
    await escalate.click();

    await expect(page.getByText(/POZIOM WKURWIENIA/i)).toBeVisible();

    await page.getByRole('button', { name: /SPIERDALAM/i }).click();
    await expect(page.getByRole('heading', { name: /PIERDOLATOR 3000/i })).toBeVisible();
  });
});
