const express = require('express')
const app = express()

app.get('/', (req, res) => {
    console.log(JSON.stringify(req, null, 2))
    res.send('Hello World!')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

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