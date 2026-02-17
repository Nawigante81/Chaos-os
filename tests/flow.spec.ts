import { test, expect } from '@playwright/test';

test.describe('kreator-wymowek — real flow', () => {
  test('home search filters modules and keeps CHAOS OS header', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'CHAOS OS' })).toBeVisible();

    const search = page.getByPlaceholder('Szukaj modułu… (np. memy, paski, wymówki)');
    await search.fill('wym');

    await expect(page.getByRole('link', { name: /Kreator Wymówek/i })).toBeVisible();
  });

  test('wymowki: generates excuse, enables actions, and renders batch suggestions', async ({ page }) => {
    await page.goto('/wymowki');

    await expect(page.getByRole('heading', { name: /Kreator Wymówek 5000/i })).toBeVisible();
    await expect(page.locator('button[title="Skopiuj do schowka"]')).toBeDisabled();

    await page.getByRole('button', { name: /Generuj Wymówkę/i }).click();

    await expect(page.getByText('System gotowy. Oczekiwanie na generację kłamstwa.')).toHaveCount(0);
    await expect(page.locator('button[title="Skopiuj do schowka"]')).toBeEnabled();
    await expect(page.locator('button[title="Dodaj/usuń ulubione"]')).toBeEnabled();

    await page.getByRole('button', { name: /Losuj 3 opcje/i }).click();
    await expect(page.getByText(/3 szybkie propozycje/i)).toBeVisible();

    const quickSuggestions = page.locator('button[title="Kliknij, aby ustawić tę wymówkę"]');
    await expect(quickSuggestions).toHaveCount(3);
  });

  test('wymowki: history persists after reload', async ({ page }) => {
    await page.goto('/wymowki');

    await page.getByRole('button', { name: /Generuj Wymówkę/i }).click();
    await expect(page.getByText(/Ostatnie wyniki/i)).toBeVisible();

    await page.reload();

    await expect(page.getByRole('heading', { name: /Kreator Wymówek 5000/i })).toBeVisible();
    await expect(page.getByText(/Ostatnie wyniki/i)).toBeVisible();
  });

  test('chat: empty save does not create history entry', async ({ page }) => {
    await page.goto('/chat');

    await expect(page.getByRole('heading', { name: /Generator screenshota czatu/i })).toBeVisible();

    await page.evaluate(() => window.localStorage.removeItem('chaos:history:chat'));
    await page.reload();

    await page.getByRole('button', { name: /Wyczyść/i }).click();
    await page.getByRole('button', { name: /^Zapisz rozmowę$/i }).click();

    await expect(page.getByText(/Ostatnie/i)).toHaveCount(0);
  });
});
