import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
});

// 跑完此檔的 test 後不關瀏覽器，要關請自己關或按 UI 的 Stop
// test.afterAll(async () => {
//     await new Promise(() => {});
// });

test.describe('Form Layouts page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card').filter({ hasText: 'Using the Grid'}).getByRole('textbox', { name: 'Email' })
        await usingTheGridEmailInput.fill('test@example.com')
        await expect(usingTheGridEmailInput).toHaveValue('test@example.com')
        await usingTheGridEmailInput.clear()
        await expect(usingTheGridEmailInput).toHaveValue('')
        await usingTheGridEmailInput.pressSequentially('test2@example.com', { delay: 100 })

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@example.com')

        //locator assertions
        await expect(usingTheGridEmailInput).toHaveValue('test2@example.com')
    })

    test('radio buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card').filter({ hasText: 'Using the Grid'})

        // await usingTheGridForm.getByLabel('Option 1').check({force: true})
        await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).check({force: true})
        const radioButtonValue = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()
        expect(radioButtonValue).toBeTruthy()
        await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked()

        await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force: true})
        expect(await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy()
        expect(await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy()
    })

})

test.describe('checkboxes / toaster', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()
    })
    test('checkboxes', async ({ page }) => {
        await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true })
        await expect(page.getByRole('checkbox', { name: 'Hide on click' })).not.toBeChecked()

        await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({ force: true })
        expect(await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).isChecked()).toBeTruthy()

        const allboxes = page.getByRole('checkbox')
        for (const box of await allboxes.all()) {
            await box.check({ force: true })
            expect(await box.isChecked()).toBeTruthy()
        }

        for (const box of await allboxes.all()) {
            await box.uncheck({ force: true })
            expect(await box.isChecked()).toBeFalsy()
        }
    })
})

test('lists and dropdowns', async ({ page }) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole('list') // When the list has a UL tag
    page.getByRole('listitem') // When the list has a LI tag

    // const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({ hasText: "Cosmic" }).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(34, 43, 69)',
        cosmic: 'rgb(50, 50, 89)',
        corporate: 'rgb(255, 255, 255)',
    }

    await dropDownMenu.click()
    for(const color in colors) {
        await optionList.filter({ hasText: color }).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color !== 'corporate') {
            await dropDownMenu.click()
        }   
    }

})

test('tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card').filter({ hasText: 'Tooltip Placements' });
    await expect(toolTipCard).toBeVisible();

    // Hover 到 Top 按鈕，確認 tooltip 顯示 "This is a tooltip"
    await toolTipCard.getByRole('button', { name: 'Top' }).hover();
    await expect(page.locator('nb-tooltip')).toContainText('This is a tooltip');
});

test('dialog', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Dialog').click();

    // 找到「Open Without Backdrop」那張 nb-card（用「Open Dialog without backdrop」按鈕區分，避免匹配到「Open Without Backdrop Click」）
    const openWithoutBackdropCard = page.locator('nb-card').filter({ hasText: 'Open Without Backdrop' }).filter({ hasText: 'Open Dialog without backdrop' });
    await expect(openWithoutBackdropCard).toBeVisible();
    await openWithoutBackdropCard.getByRole('button', { name: 'Open Dialog with backdrop' }).click();

    // 彈窗出現：DOM 實際是 nb-dialog-container → ngx-showcase-dialog → nb-card（沒有 nb-dialog 標籤）
    const dialog = page.locator('nb-dialog-container');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('nb-card-header')).toHaveText('This is a title passed to the dialog component');
    await expect(dialog.locator('nb-card-body')).toContainText('Lorem ipsum dolor sit amet');
    await expect(dialog.getByRole('button', { name: 'Dismiss Dialog' })).toBeVisible();

    // 點擊 Dismiss Dialog，確認彈窗關閉
    await dialog.getByRole('button', { name: 'Dismiss Dialog' }).click();
    await expect(dialog).not.toBeVisible();
});

test('dialog box', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // defult will cancel the dialog box so we need to confirm it
    page.on('dialog', async dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?');
        await dialog.accept();
    });
    
    await page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash').click();
    await expect(page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com' })).not.toBeVisible();

})

test('web table', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //1 get the row by any test in this row
    const targetRow = page.getByRole('table').locator('tr', { hasText: 'twitter@outlook.com' })
    await targetRow.locator('.nb-edit').click()
    // 因為點選編輯後，原本是 targetRow 的子元素，現在變成 input-editor 的子元素，所以需要重新定位(text 都變成 value)
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('77')
    await page.locator('.nb-checkmark').click()

    //2 get the row based on the value in the specific column
    const pageRow = page.locator('.ng2-smart-pagination')
    await pageRow.getByText('2', { exact: true }).click()

    const targetRowById = page.getByRole('row', {name: '11'}).filter({ has: page.locator('td').nth(1).getByText('11') })
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('Luka@gmail.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toContainText('Luka@gmail.com')

    //3 test filter of the table
    const ages = ['20', '30', '77', '200']

    const ageRows = page.locator('tbody tr');
    for (const age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear();
        await page.locator('input-filter').getByPlaceholder('Age').fill(age);
        await page.waitForTimeout(3000);


        for ( let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent()

            if(age == '200') {
                expect(await page.locator('tbody').textContent()).toContain('No data found')
            } else {
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('table filter', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    const table = page.locator('ng2-smart-table table');
    // Age 篩選：鎖定 thead 內 placeholder="Age" 的 input（唯一）
    await table.locator('thead').getByPlaceholder('Age').fill('20');

    // 應篩出 5 筆
    const dataRows = table.locator('tbody tr.ng2-smart-row');
    await expect(dataRows).toHaveCount(5);
    // check the age of the row
    const rowCount = await dataRows.count();
    for (let i = 0; i < rowCount; i++) {
        const cellValue = await dataRows.nth(i).locator('td').last().textContent()
        expect(cellValue).toEqual('20')
    }
})

test('datepicker', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 90)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('default', { month: 'short' })
    const expectedMonthLong = date.toLocaleString('default', { month: 'long' })
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    // 若日曆視窗左上角顯示的月份與目標不同，則點「下一月」直到一致（最多 24 次防無限迴圈）
    const calendarTitle = page.locator('nb-calendar-view-mode')
    const btnNextMonth = page.locator('button.next-month')
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
    let calendarMonthAndYear = (await calendarTitle.textContent())?.trim() ?? ''
    let clicks = 0
    while (calendarMonthAndYear !== expectedMonthAndYear && clicks < 24) {
        await btnNextMonth.click()
        calendarMonthAndYear = (await calendarTitle.textContent())?.trim() ?? ''
        clicks++
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async ({ page }) => {
    // Update attribute
    // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    // await tempGauge.evaluate( node => {
    //     node.setAttribute('cx', '232.630')
    //     node.setAttribute('cy', '232.630')
    // })
    // await tempGauge.click()

    // Mouse movement（加延遲方便在 UI 模式看清動作）
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempBox.scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.waitForTimeout(500)
    await page.mouse.down()
    await page.waitForTimeout(300) 

    // 分多步拖曳，讓滑動過程肉眼可見
    const steps = 20
    for (let i = 1; i <= steps; i++) {
        await page.mouse.move(x + (100 * i) / steps, y)
        await page.waitForTimeout(50)
    }
    await page.mouse.up()
    await page.waitForTimeout(500)

})