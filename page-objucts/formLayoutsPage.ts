import { Page } from "@playwright/test";

export class FormLayoutsPage {
    
    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async submitUsingTheGridFormWithCredentialsAndSelectedOption(email: string, password: string, optionText: string) {
        const usingTheGridForm = this.page.locator('nb-card').filter({ hasText: 'Using the Grid'})
        await usingTheGridForm.getByRole('textbox', { name: 'Email' }).fill(email)
        await usingTheGridForm.getByRole('textbox', { name: 'Password' }).fill(password)
        await usingTheGridForm.getByRole('radio', { name: optionText }).check({force: true})
        await usingTheGridForm.getByRole('button', { name: 'Sign in' }).click()
    }

    /**
     * Submit the inline form with the given name, email, and checkbox
     * @param name - The name to use for the form
     * @param email - The email address to use for the form
     * @param rememberMe - Whether to remember the user after login or not
     */
    async submitInlineWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean) {
        const inlineForm = this.page.locator('nb-card').filter({ hasText: 'Inline form'})
        await inlineForm.getByRole('textbox', { name: 'Jane Doe' }).fill(name)
        await inlineForm.getByRole('textbox', { name: 'Email' }).fill(email)
        if (rememberMe) {   // 若 rememberMe 為 true，則勾選 Remember me
            await inlineForm.getByRole('checkbox', { name: 'Remember me' }).check({force: true})
        }
        await inlineForm.getByRole('button', { name: 'Submit' }).click()
    }   
}