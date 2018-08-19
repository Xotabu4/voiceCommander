const express = require('express')
const app = express()

app.get('/', (req, res) => {
    console.log('===INCOMMING REQUEST===')
    console.log('===HEADERS===')
    console.log(req.headers)
    console.log('===BODY===')
    console.log(req.body)
    res.send({ fulfillmentText: 'This is text response from server!' })

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