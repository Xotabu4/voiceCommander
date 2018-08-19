const express = require('express')
const request = require('request-promise-native')
const app = express()

app.post('/', async (req, res) => {
    console.log('===INCOMMING REQUEST===')
    console.log('===HEADERS===')
    console.log(req.headers)
    console.log('===BODY===')
    console.log(req.body)
    let body = await request.get('http://ip-5236.sunline.net.ua:4444/status', { json: true })
    console.log(body)
    let text = `Used ${body.used} out of ${body.total} browser sessions. `
    if (body.queued > 0) {
        text = text + `And also there are queue of ${body.queued} sessions`
    }
    if (body.queued > 0) {
        text = text + `And also there are ${body.pending} of pending sessions`
    }
    res.send({ fulfillmentText: text })
})

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port: ' + process.env.PORT))

// const creds = require('./creds/actionstest.json')
// // Instantiate a DialogFlow client. It uses ENV var - GOOGLE_APPLICATION_CREDENTIALS
// // Make sure it is declared.
// // 
// const dialogflow = require('dialogflow');

// // Instantiates clients
// const intentsClient = new dialogflow.IntentsClient();

// // Send request and log result
// async function test() {
//     const projectAgentPath = intentsClient.projectAgentPath(creds.project_id)
//     console.log(await intentsClient.listIntents({ parent: projectAgentPath }))

//     // TODO: Check if intents are not created, and create them.


// }
// test()