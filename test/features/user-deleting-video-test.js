const {assert} = require('chai');

const {featureVideoCreation} = require('../test-utilities')

describe('Feature Path: /videos/:id/delete', () => {

    it('user deleting video removes the video from the list', () => {
        const video = featureVideoCreation()

        browser.click('input#delete')

        browser.url('/videos')

        assert.notInclude(browser.getText('body'), video.title)
    })



})