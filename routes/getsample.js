var express = require('express');
var router = express.Router();
var azure = require('azure-sb');
/* GET users listing. */
router.get('/', function (req, res, next) {
    console.log(req)
    var notificationHubService = azure.createNotificationHubService('agentapp', 'Endpoint=sb://agentapp.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=THbehXMBnhCGERM0YJwNKkW5O5yG2xjm8BupBlIwcfg=');
    var payload = {
        username:"5cebdd1fa7941bd0c8adc48142be283b92d36b577be2f7b0a7e8dd9ea592b0b1",
        alert: 'Hello Bowsil',
        url: 'https://wayfinding.abudhabiairport.ae/en?src=B1-UL1-ID054&dst=B1-UL1-ID056'
    };
    notificationHubService.apns.send(null, payload, function (error) {
        if (!error) {
            res.send('Notification Sent');
        }
    });
   
});

module.exports = router;
