import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'; // 1

test.describe('homepage', () => {
  // 2
  test('should not have any automatically detectable accessibility issues', async ({
    page
  }) => {
    await page.goto('/'); // 3

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4

    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
});
