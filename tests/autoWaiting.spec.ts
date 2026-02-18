import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000)
})

test('auto waiting', async ({ page }) => {
    const successButton = page.locator('.bg-success')

    // await successButton.click()

    //const text = await successButton.textContent()

    // await successButton.waitFor({ state: 'attached' })
    // const text = await successButton.allTextContents()

    // expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 30000 })
})

test('alternative waits', async ({ page }) => {
    const successButton = page.locator('.bg-success')

    //___ wait for element
    // await page.waitForSelector('.bg-success')

    //___ wait for parrticular response
    // await page.waitForResponse('http://uitestingplayground.com/ajax')

    //___ wait for network calls to be completed (NOT RECOMMENDED)
    // await page.waitForLoadState('networkidle')

    //___ wait for element (AJAX may take longer on slow networks)
    await page.locator('.bg-success').waitFor({ state: 'visible', timeout: 30000 });

    const text = await successButton.allTextContents();
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('timeouts', async ({ page }) => {

    // test.setTimeout(16000)
    // test.slow()
    const successButton = page.locator('.bg-success')
    await successButton.click()

    // await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 })
})



//參考：https://playwright.dev/docs/actionability 