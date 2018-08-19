
const creds = require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
// Instantiate a DialogFlow client. It uses ENV var - GOOGLE_APPLICATION_CREDENTIALS
// Make sure it is declared.
// 
// const dialogflow = require('dialogflow');

// // Instantiates clients
// const intentsClient = new dialogflow.IntentsClient();

// Send request and log result
async function push() {
    // const projectAgentPath = intentsClient.projectAgentPath(creds.project_id)
    // console.log(await intentsClient.listIntents({ parent: projectAgentPath }))
    // TODO: Check if intents are not created, and create them.
    const request = require('request');
    const google = require('googleapis');
    const jwtClient = new google.google.auth.JWT(
        creds.client_email, null, creds.private_key,
        ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
        null
    );
    let notif = {
        userNotification: {
            title: 'Title!',
        },
        target: {
            // USER ID and intent must be received as shown here - https://github.com/actions-on-google/dialogflow-updates-nodejs/blob/master/functions/index.js#L227
            userId: '<USER_ID>',
            intent: '<INTENT>',
            // Expects a IETF BCP-47 language code (i.e. en-US)
            locale: 'en-US'
        },
    };
    jwtClient.authorize(async (err, tokens) => {
        if (err) {
            throw new Error(`Auth error: ${err}`);
        }
        request.post('https://actions.googleapis.com/v2/conversations:send', {
            'auth': {
                'bearer': tokens.access_token,
            },
            'json': true,
            'body': { 'customPushMessage': notif },
        }, (err, httpResponse, body) => {
            if (err) {
                throw new Error(`API request error: ${err}`);
            }
            console.log(`${httpResponse.statusCode}: ` +
                `${httpResponse.statusMessage}`);
            console.log(JSON.stringify(body));
        });
    });
}
push()