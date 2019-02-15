const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const {connectDatabase, disconnectDatabase, seedVideo} = require('../database-utilities');
const {parseTextFromHTML, videoObj, findElementFromHTML} = require('../test-utilities')
const Video = require('../../models/video')

describe('Server Path: /videos', () => {

    beforeEach(connectDatabase)
    afterEach(disconnectDatabase)

    describe('GET /', () => {

        it('renders an existing video', async () => {
            const { title } = await seedVideo()

            const res = await request(app)
                .get('/videos/')
                .send()

            assert.include(parseTextFromHTML(res.text, 'div.video-title'), title)
        })

    })

    describe('POST /', () => {

        it('responds with 302 redirect to video\'s page', async () => {
            const video = videoObj()
            const res = await request(app)
                .post('/videos')
                .type('form')
                .send(video)

            assert.equal(res.status, 302)
        })

        it('saves a video to the database', async () => {
            const video = videoObj()

            await request(app)
                .post('/videos')
                .type('form')
                .send(video)

            const saved = await Video.findOne({});

            assert.include(saved, video)
        })

        it('won\'t save a video with no title', async () => {
            let video = videoObj()
            delete video.title

            await request(app)
                .post('/videos')
                .type('form')
                .send(video)

            const saved = await Video.findOne({})

            assert.isNull(saved)
        })

        it('sends a 400 if no title', async () => {
            let video = videoObj()
            delete video.title

            const res = await request(app)
                .post('/videos')
                .type('form')
                .send(video)

            assert.equal(res.status, 400)
        })

        it('renders video creation form if no title', async () => {
            let video = videoObj()
            delete video.title

            const res = await request(app)
                .post('/videos')
                .type('form')
                .send(video)

            assert.isNotNull(findElementFromHTML(res.text, '#title-input'))
        })

        it('renders an error on creation form if no title', async () => {
            let video = videoObj()
            delete video.title

            const res = await request(app)
                .post('/videos')
                .type('form')
                .send(video)

            assert.include(parseTextFromHTML(res.text, '#title-error'), 'a title is required')
        })

        it('preserves the other field values when title is missing', async () => {
            let video = videoObj()
            delete video.title

            const res = await request(app)
                .post('/videos')
                .type('form')
                .send(video)

            assert.include(parseTextFromHTML(res.text, 'textarea#description-input'), video.description)
        })

        it('retains url when nothing else sent', async () => {
            let video = videoObj()
            delete video.title
            delete video.description

            const res = await request(app)
                .post('/videos')
                .type('form')
                .send(video)

            assert.equal(findElementFromHTML(res.text, '#url-input').value, video.url)
        })

        it('renders an error on creation form if no url', async () => {
            let video = videoObj()
            delete video.url

            const res = await request(app)
                .post('/videos')
                .type('form')
                .send(video)

            assert.include(parseTextFromHTML(res.text, '#url-error'), 'a URL is required.')
        })

        it('preserves the other field values when url is missing', async () => {
            let video = videoObj()
            delete video.url

            const res = await request(app)
                .post('/videos')
                .type('form')
                .send(video)

            assert.equal(findElementFromHTML(res.text, 'input#title-input').value, video.title)
            assert.equal(parseTextFromHTML(res.text, 'textarea#description-input'), video.description)
        })

    })

    describe('GET /:id', () => {

        it('renders the correct video', async () => {
            const video = await seedVideo()

            const res = await request(app)
                .get(`/videos/${video._id}`)
                .send()

            assert.equal(res.status, 200)
            assert.include(parseTextFromHTML(res.text, '.video-title'), video.title)
            assert.include(parseTextFromHTML(res.text, '.video-description'), video.description)
            assert.include(findElementFromHTML(res.text, '.video-player').src, video.url)
        })

    })

    describe('GET /:id/edit', () => {

        it('renders a filled-out form', async () => {
            const video = await seedVideo()

            const res = await request(app)
                .get(`/videos/${video._id}/edit`)
                .send()

            assert.equal(res.status, 200)
            assert.equal(findElementFromHTML(res.text, 'input#title-input').value, video.title)
            assert.equal(parseTextFromHTML(res.text, 'textarea#description-input'), video.description)
            assert.equal(findElementFromHTML(res.text, "#url-input").value, video.url)
        })

    })

    describe('POST /:id/updates', () => {

        it('updates the record', async () => {
            const video = await seedVideo()
            const toUpdate = {
                title: 'updated title',
                description: 'updated description',
                url: video.url
            }

            await request(app)
                .post(`/videos/${video._id}/updates`)
                .type('form')
                .send(toUpdate)

            const updated = await Video.findOne()

            assert.equal(updated.title, toUpdate.title)
            assert.equal(updated.description, toUpdate.description)
        })

        it('redirects to the show page', async () => {
            const video = await seedVideo()
            const update = {
                title: 'updated title',
                description: 'updated description',
                url: video.url
            }

            const res = await request(app)
                .post(`/videos/${video._id}/updates`)
                .type('form')
                .send(update)

            assert.strictEqual(res.status, 302)
            assert.include(res.header.location, `/videos/${video._id}`)
        })

        it('does not allow invalid updates', async () => {
            const video = await seedVideo()
            const toUpdate = {
                title: 'updated title',
                description: null,
                video: video.url
            }

            await request(app)
                .post(`/videos/${video._id}/updates`)
                .type('form')
                .send(toUpdate)

            const updated = await Video.findOne({})

            assert.equal(updated.title, video.title)
            assert.equal(updated.description, video.description)
            assert.equal(updated.url, video.url)
        })

        it('responds with a 400 when update is invalid', async () => {
            const video = await seedVideo()
            const toUpdate = {
                title: 'updated title',
                description: null,
                video: video.url
            }

            const res = await request(app)
                .post(`/videos/${video._id}/updates`)
                .type('form')
                .send(toUpdate)

            assert.equal(res.status, 400)
        })

        it('renders edit form if input is invalid', async () => {
            const video = await seedVideo()
            const toUpdate = {
                title: 'updated title',
                description: null,
                video: video.url
            }

            const res = await request(app)
                .post(`/videos/${video._id}/updates`)
                .type('form')
                .send(toUpdate)

            assert.include(parseTextFromHTML(res.text, 'body'), 'Edit a Video')
        })

    })

    describe('POST: /videos/:id/deletions', () => {

        it('removes the record', async () => {
            const video = await seedVideo()

            await request(app)
                .post(`/videos/${video._id}/deletions`)
                .type('form')
                .send()

            const deleted = await Video.findOne({})

            assert.isNull(deleted)
        })

        it('redirects user to landing page', async () => {
            const video = await seedVideo()

            const res = await request(app)
                .post(`/videos/${video._id}/deletions`)
                .type('form')
                .send()

            assert.equal(res.status, 302)
            assert.equal(res.header.location, '/videos')
        })

    })


})