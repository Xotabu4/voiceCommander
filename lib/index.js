const express = require('express')
const request = require('request-promise-native')
const fs = require('fs');
//const http = require('http');
//const https = require('https');
//const privateKey = fs.readFileSync('/etc/ssl/private/voiceCommander-selfsigned.key', 'utf8');
//const certificate = fs.readFileSync('/etc/ssl/certs/voiceCommander-selfsigned.crt', 'utf8');
//const credentials = { key: privateKey, cert: certificate };

const voiceCommanderBackend = express()

voiceCommanderBackend.use(require('body-parser').json()); // for parsing application/json

voiceCommanderBackend.post('/', async (req, res) => {
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

// Unfortunatelly had to split to local and webhook part since self signed certificates are not supported
// Heroku provides own certificates, so everything is fine
//const voiceCommanderBackendHTTP = http.createServer(voiceCommanderBackend);
//const voiceCommanderBackendHTTPS = https.createServer(credentials, voiceCommanderBackend);

//voiceCommanderBackendHTTP.listen(3002);
//voiceCommanderBackendHTTPS.listen(3001);
let port = process.env.PORT || 3001
voiceCommanderBackend.listen(port, () => console.log('Voice Commander listening on port: ' + port))

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