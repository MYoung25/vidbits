const {assert} = require('chai');
const app = require('../../app');
const request = require('supertest');

describe('Server Path: /', () => {

    describe('GET', () => {

        it('redirects to /video', async () => {
            const res = await request(app)
                .get('/')
                .send()

            assert.equal(res.status, 302)

        })

    })

})