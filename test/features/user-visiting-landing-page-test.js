const {assert} = require('chai');

const {featureVideoCreation} = require('../test-utilities')

describe('Feature Path: /videos', () => {

    describe('index', () => {

        it('should have no videos on first visit', () => {
            browser.url('/videos')

            assert.equal(browser.getText('#videos-container'), '')

        })

        it('user navigates to save video page', () => {
            browser.url('/videos')
            browser.click(`a[href="/videos/create"]`)

            assert.include(browser.getText('.contents-container'), 'Save a Video')
        })

    })

    describe('landing page with video', () => {

        it('renders a user-created video', () => {
            const video = featureVideoCreation()

            browser.url('/videos')

            assert.include(browser.getText('#videos-container'), video.title)
            assert.include(browser.getText('#videos-container'), video.description)
            assert.include(browser.getAttribute('iframe', 'src'), video.url)
        })

        it('can navigate to a video', () => {
            const video = featureVideoCreation()

            browser.url('/videos')
            browser.click(".video-card a")

            assert.equal(browser.getText('.video-title'), video.title)
        })

        it('can navigate from show page to index page', () => {
            featureVideoCreation()

            browser.url('/videos')
            browser.click("#videos-container a")

            browser.click('a[href="/"]')

            assert.include(browser.getUrl(), '/video')
        })

    })

})