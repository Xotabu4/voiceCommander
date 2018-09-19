/**
 * Local network server that pushes notifications to google home mini
 */

const express = require('express')
const notificationsPusherBackend = express()
notificationsPusherBackend.use(require('body-parser').json()); // for parsing application/json
notificationsPusherBackend.post('/push', async (req, res) => {
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

let port = process.env.PORT || 3001
notificationsPusherBackend.listen(
    port,
    () => console.log('Notifications pusher listening on port: ' + port)
)
