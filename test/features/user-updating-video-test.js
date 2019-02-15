const {assert} = require('chai');

const {featureVideoCreation} = require('../test-utilities')

describe('Feature path: /videos/:id/edit', () => {

    it('user updating video changes the values', () => {
        featureVideoCreation()
        const newTitle = 'fly so high'

        browser.click('#edit')
        browser.setValue('input#title-input', newTitle)
        browser.click('button[type="submit"]')

        assert.include(browser.getText('body'), newTitle)
    })

    it('updates an existing video and doesn\'t create a new one', () => {
        const original = featureVideoCreation()
        const newTitle = 'fly so high'

        browser.click('#edit')
        browser.setValue('input#title-input', newTitle)
        browser.click('button[type="submit"]')

        browser.url('/videos')

        assert.include(browser.getText('body'), newTitle)
        assert.notInclude(browser.getText('body'), original.title)
    })

})