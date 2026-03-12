const { test, expect } = require('@playwright/test');

test.describe('API Products', () => {
    test('should fetch products', async ({ request }) => {
        const response = await request.get('/api/products');
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body).toHaveProperty('data');
        expect(Array.isArray(body.data)).toBeTruthy();
    });

    test('should fetch categories', async ({ request }) => {
        const response = await request.get('/api/categories');
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(Array.isArray(body)).toBeTruthy();
    });
});
