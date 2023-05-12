import { expect, test } from '@playwright/test';

test.setTimeout(35e3);

test('send message', async ({ page }) => {
  const randomText =
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .slice(0, 6) || 'nonce';

  await page.goto('/api/auth/signin');
  await page.getByLabel('Name').click();
  await page.getByLabel('Name').fill('Mati');
  await page
    .getByRole('button', { name: 'Sign in with Mocked GitHub' })
    .click();
  await page.getByPlaceholder('Write your message!').click();
  await page.getByPlaceholder('Write your message!').fill(randomText);
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(await page.getByText(randomText)).toBeVisible();
});

export {};
