const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
    test('should load the homepage', async ({ page }) => {
        await page.goto('/');
        // Check for common homepage elements
        // Based on page.js, it might have "Weekly Deals" or "Value Deals"
        await expect(page).toHaveTitle(/.*Baksho.*/i); // Adjust based on actual title if known, or use a generic check
        
        // Wait for some content to be visible
        const hero = page.locator('text=Weekly Deals').first();
        // Since it's a dev server, it might take a moment to load
        await expect(hero).toBeVisible({ timeout: 10000 });
    });

    test('should navigate to products page', async ({ page }) => {
        await page.goto('/');
        const shopNow = page.locator('text=Shop Now').first();
        await shopNow.click();
        await expect(page).toHaveURL(/.*products.*/);
    });
});
