import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objucts/pageManager'   

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200')
})

test('navigate to form page', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
    await page.pause()
})

test('parameterized methods', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectedOption('test@example.com', 'Welcome123', 'Option 1')
    await pm.onFormLayoutsPage().submitInlineWithNameEmailAndCheckbox('John Doe', 'Luka.kuo@example.com', true)
    await pm.navigateTo().datepickerPage()
    await pm.onDatepickerPage().selectCommonDatepickerDateFromToday(90)
    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(10, 20)
    await page.pause()
})
