const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const {connectDatabase, disconnectDatabase, seedVideo} = require('../database-utilities');
const {parseTextFromHTML, videoObj, findElementFromHTML} = require('../test-utilities')
const Video = require('../../models/video')

describe('Server Path: /videos/:id', () => {



})