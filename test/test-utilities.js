//Note: I updated jsdom to ^13, usage is different than the package.json's original ^9
const jsdom = require('jsdom')
const {JSDOM} = jsdom

const parseTextFromHTML = (html, selector) => {
    const {document} = (new JSDOM(html)).window
    return document.querySelector(selector).textContent
}

const findElementFromHTML = (html, selector) => {
    const {document} = (new JSDOM(html)).window
    return document.querySelector(selector)
}

const videoObj = () => ({
    title: "superman sloth",
    description: "believes he can fly and touch the sky",
    url: "https://www.youtube.com/watch?v=Yw-z7GMX6XY"
})

const featureVideoCreation = () => {
    const generateRandomUrl = (domain) => `http://${domain}/${Math.random()}`

    const video = {
        title: "my video",
        description: "has a description",
        url: generateRandomUrl("mydomain.xyz")
    }
    browser.url('/videos/create')
    browser.setValue('input#title-input', video.title)
    browser.setValue('textarea#description-input', video.description)
    browser.setValue('input#url-input', video.url)
    browser.click(`button[type="submit"]`)


    return video
}

module.exports = {
    parseTextFromHTML,
    videoObj,
    findElementFromHTML,
    featureVideoCreation
}