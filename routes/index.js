const router = require('express').Router();

router.get('/', async (req, res) => {
    res.redirect('/videos')
})

module.exports = router