const { assert } = require('chai')

const {featureVideoCreation} = require('../test-utilities')

describe('Feature Path: /videos/create', () => {

    describe('fills out form', () => {

        it('should have a title, description, and url', () => {
            const video = featureVideoCreation()

            assert.include(browser.getText('body'), video.title)
            assert.include(browser.getText('body'), video.description)
            assert.include(browser.getAttribute('.video-player', 'src'), video.url)

        })

        it('should post to /videos', () => {
            browser.url('/videos/create')
            assert.equal(browser.getAttribute('form', 'method'), 'post')
            assert.include(browser.getAttribute('form', 'action'), '/videos')
        })

    })

})