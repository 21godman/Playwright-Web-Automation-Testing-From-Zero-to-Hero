import { test, expect } from '@playwright/test';

// test.beforeAll(async ({ page }) => {
//     await page.goto('http://localhost:4200')
// })

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async ({ page }) => {
    //by Tag name
    await page.locator('input').first().click()

    //by ID
    page.locator('#inputEmail1')

    //by Class value
    page.locator('.shape-rectangle')

    //by attribute
    page.locator('[placeholder="Email"]')

    //by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different locators
    page.locator('input[placeholder="Email"][nbinput]')

    // by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    // by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).first().click()
    await page.getByRole('button', { name: 'Sign in' }).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    await page.getByTestId('SignIn').click()

    await page.getByTitle('IoT Dashboard').click()
})

test('Locating children elements', async ({ page }) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Locating parent elements', async ({ page }) => {
    await page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: 'Email' }).click()
    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('textbox', { name: 'Email' }).click()

    await page.locator('nb-card').filter({ hasText: "Basic form"}).getByRole('textbox', { name: 'Email' }).click()
    await page.locator('nb-card').filter({ has: page.locator('.status-danger')}).getByRole('textbox', { name: 'Password' }).click()

    await page.locator('nb-card').filter({ has: page.locator('nb-checkbox')}).filter({ hasText: 'Sign in'}).getByRole('textbox', { name: 'Email' }).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', { name: 'Email' }).click()
})

test('Reusing the locators', async ({ page }) => {
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form"});
    const emailField = basicForm.getByRole('textbox', { name: 'Email' });

    await emailField.fill('test@example.com')
    await basicForm.getByRole('textbox', { name: 'Password' }).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button', { name: 'Submit' }).click()

    await expect(emailField).toHaveValue('test@example.com')
    await expect(basicForm.getByRole('textbox', { name: 'Password' })).toHaveValue('Welcome123')
    await expect(basicForm.getByRole('button', { name: 'Submit' })).toBeEnabled()
})

test('extracting values', async ({ page }) => {
    //single test value
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toBe('Submit')

    //all text contents
    const radioGroupTexts = await page.locator('nb-radio').allTextContents()
    expect(radioGroupTexts).toContain('Option 1')

    //input value
    const emailField = basicForm.getByRole('textbox', { name: 'Email' })
    await emailField.fill('test@example.com')
    const emailValue = await emailField.inputValue() 
    expect(emailValue).toEqual('test@example.com')

    const placeholderText = await emailField.getAttribute('placeholder')
    expect(placeholderText).toEqual('Email')
})

test('assertions', async ({ page }) => {
    const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form"}).locator('button').first()
    //General assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual('Submit')

    //Locator assertions
    await expect(basicFormButton).toHaveText('Submit')

    //Soft assertions (will not fail the test if the assertion is not met)
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()
})

