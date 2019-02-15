const router = require('express').Router();
const Video = require('../models/video')

router.get('/', async (req, res) => {
    const videos = await Video.find({})

    res.render('videos/index', { videos })
})

router.post('/', async (req, res) => {
    const {title, description, url} = req.body

    const video = new Video({title, description, url})

    video.validateSync();

    if (video.errors) {
        res.status(400).render('videos/create', {title, description, url, error: video.errors})
    } else {
        await video.save()
        res.redirect(`/videos/${video._id}`)
    }
})

router.get('/create', (req, res) => {
    res.render('videos/create')
})

router.get('/:id', async (req, res) => {
    const video = await Video.findOne({_id: req.params.id})

    res.status(200).render('videos/show', video)
})

router.get('/:id/edit', async (req, res) => {
    const video = await Video.findOne({_id: req.params.id})

    res.status(200).render('videos/edit', video)
})

router.post('/:id/updates', async (req, res) => {
    const {title, description, url} = req.body

    let storedVideo = await Video.findOne({_id: req.params.id})
    storedVideo.title = title
    storedVideo.description = description
    storedVideo.url = url
    try {
        await storedVideo.validate()
        await storedVideo.save()

        res.redirect(`/videos/${req.params.id}`)
    } catch (err) {
        res.status(400).render('videos/edit', storedVideo)
    }
})

router.post('/:id/deletions', async (req, res) => {
    await Video.deleteOne({_id: req.params.id})

    res.redirect('/videos')
})

module.exports = router;