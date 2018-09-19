const express = require('express')
const request = require('request-promise-native')

const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json

app.post('/', async (req, res) => {
    console.log('===INCOMMING REQUEST===')
    console.log('===HEADERS===')
    console.log(req.headers)
    console.log('===BODY===')
    console.log(req.body)
    if (req.body) {
        if (req.body.queryResult.intent.displayName.includes('test farm')) {
            res.send(await testFarmStatusIntent(req))
        }
        if (req.body.queryResult.intent.displayName.includes('start all tests')) {
            res.send(await startAllTestsIntent(req))
        }
    }
})

app.post('/push', async (req, res) => {
    /**
    Example body
     {
        "lang": "ru",
        "textToSay": "Шо ты уже валишь, да? Ну и вали"
     }
     */
    console.log('===INCOMMING REQUEST===')
    console.log('===HEADERS===')
    console.log(req.headers)
    console.log('===BODY===')
    console.log(req.body)
    if (req.body) {
        var googlehome = require('google-home-notifier');
        googlehome.ip('192.168.1.159', req.body.lang || 'en-us');
        googlehome.notify(req.body.textToSay, function (notifyRes) {
            console.log(notifyRes)
            res.send(notifyRes)
        });
    }
})

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port: ' + process.env.PORT))

async function testFarmStatusIntent() {
    let body = await request.get('http://ip-5236.sunline.net.ua:4444/status', { json: true })
    console.log(body)
    let text = `Currently used ${body.used} out of ${body.total} browser sessions. `
    if (body.queued > 0) {
        text = text + `And also there are queue of ${body.queued} sessions `
    }
    if (body.pending > 0) {
        text = text + `And also there are ${body.pending} of pending sessions`
    }
    return { fulfillmentText: text }
}

async function startAllTestsIntent() {
    if (process.env.JENKINS_PASS && process.env.JENKINS_USERNAME) {
        let body = await request.post(
            `http://${process.env.JENKINS_USERNAME}:${process.env.JENKINS_PASS}@ip-5236.sunline.net.ua:20800/job/Just%20Some%20Webdriver%20Tests/build?TOKEN=StartTests`
        )
        console.log(body)
        return { fulfillmentText: 'All your tests are started! Yay!' }
    } else {
        console.log('No JENKINS_PASS and JENKINS_USERNAME provided. Cannot start jobs!')
        return { fulfillmentText: 'No JENKINS_PASS and JENKINS_USERNAME provided. Cannot start jobs!' }
    }
}