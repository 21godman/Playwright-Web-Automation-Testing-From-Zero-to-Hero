import { test, expect } from '@playwright/test'
import { NavigationPage } from '../page-objucts/navigationPage'
import { FormLayoutsPage } from '../page-objucts/formLayoutsPage'
import { DatepickerPage } from '../page-objucts/datepickerPage'

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200')
})

test('navigate to form page', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    await navigateTo.formLayoutsPage()
    await navigateTo.datepickerPage()
    await navigateTo.smartTablePage()
    await navigateTo.toastrPage()
    await navigateTo.tooltipPage()
})

test('parameterized methods', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    const onFormLayoutsPage = new FormLayoutsPage(page)
    const onDatepickerPage = new DatepickerPage(page)

    await navigateTo.formLayoutsPage()
    await onFormLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectedOption('test@example.com', 'Welcome123', 'Option 1')
    await onFormLayoutsPage.submitInlineWithNameEmailAndCheckbox('John Doe', 'Luka.kuo@example.com', true)

    await navigateTo.datepickerPage()
    await onDatepickerPage.selectCommonDatepickerDateFromToday(90)
    await onDatepickerPage.selectDatepickerWithRangeFromToday(10, 20)
})
