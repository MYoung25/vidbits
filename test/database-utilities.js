const {mongoose, databaseUrl, options} = require('../database')
const Video = require('../models/video')
const { videoObj } = require('./test-utilities')

const connectDatabase = async () => {
    await mongoose.connect(databaseUrl, options);
    await mongoose.connection.db.dropDatabase();
}

const disconnectDatabase = async () => {
    await mongoose.disconnect()
}

const seedVideo = async () => {
    return await new Video(videoObj()).save()
}

module.exports = {
    connectDatabase,
    disconnectDatabase,
    seedVideo
}