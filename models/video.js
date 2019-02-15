const {mongoose} = require('../database');

const Video = mongoose.model(
    'Video',
    mongoose.Schema({
        title: {
            type: String,
            required: [true, 'a title is required']
        },
        description: String,
        url: {
            type: String,
            required: [true, 'a URL is required.']
        }
    })
);

module.exports = Video;
