const {assert} = require('chai');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {videoObj} = require('../test-utilities')
const Video = require('../../models/video')

describe('Video model', () => {

    beforeEach(connectDatabase)

    afterEach(disconnectDatabase)


    it('saves title as a string', () => {
        const title = 123

        const doc = new Video({title})

        assert.strictEqual(doc.title, title.toString())
    })

    it('requires title', () => {
        const video = videoObj()
        delete video.title

        const obj = new Video({video})

        obj.validateSync()

        assert.equal(obj.errors.title.message, 'a title is required')
    })

    it('saves description as a string', () => {
        const description = 543

        const doc = new Video({description})

        assert.strictEqual(doc.description, description.toString())
    })

    it('saves a url as a string', () => {
        const url = 9876

        const doc = new Video({url})

        assert.strictEqual(doc.url, url.toString())
    })

    it('requires url', () => {
        const video = videoObj()
        delete video.url

        const obj = new Video({video})

        obj.validateSync()

        assert.equal(obj.errors.url.message, 'a URL is required.')
    })

})