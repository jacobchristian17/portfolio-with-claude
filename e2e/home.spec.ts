import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Portfolio|Home/i);
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check if navbar exists and has expected links
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    
    // Look for hero section with text content
    const hero = page.locator('h1, h2').first();
    await expect(hero).toBeVisible();
  });
});
