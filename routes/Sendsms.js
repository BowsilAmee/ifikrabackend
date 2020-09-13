var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const xml2json = require('xml2json');
const { query } = require('express');
require('dotenv').config();


//TODO: Move to Env variable
const accessTokenSecret = '1QNuYeLRO4u4NeH2OeVvr4xvHRlXRe7cCVwPUIWSlif5bTpnPSJ2VFaliNVN';
var token;
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {

        res.sendStatus(401);
    }
};

// Get Flight list 

router.post('/', authenticateJWT, function (req, res, next) {

    try {


        if (req.body != null) {

            const { passengerId, phonenumber} = req.body;

            updateredisdata(passengerId).then(function (resultVal) {
                {

                    var url = "https://eya.azurewebsites.net/g/" + passengerId +" ";
                    sendsms(phonenumber, url).then(function (restulans) {
                        {

                            res.json(restulans);

                        }



                    }).catch(function (error) {
                        console.error(error)
                        return res.sendStatus(500, "unable to auth user or system Down");
                    });
                    //res.json(resultVal);

                }


            }).catch(function (error) {
                console.error(error)
                return res.sendStatus(500, "unable to auth user or system Down");
            });

        }

    } catch (error) {
        return res.sendStatus(500, " Unable to Update the Redis Cache");
    }
});


//To update the Redis data
function updateredisdata(passengerId) {
    try {
        return new Promise(function (resolve, reject) {

            const add = require("../modules/redisconnection.js")
            add(passengerId, "", "get", (err, result) => {
                if (err) { // Best practice to handle your errors
                    console.log(err)
                } else { // Implement the logic, what you want to do once you recieve the response back 
                    console.log(result)
                    resolve(result);
                }
            })


        });
    } catch (error) {

        reject(error);

    }

}



//To update the Redis data
function sendsms(phonenumber, url) {
    try {
        return new Promise(function (resolve, reject) {
            const accountSid = process.env.TWILIO_ACC_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;

            const client = require('twilio')(accountSid, authToken);
            client.messages
                .create({ body: 'Hello Guest visit  ' + url + ' for assistance to Gate your gate close in 15 min - Etihad Airways', from: '+18509405577', to: phonenumber })
                .then(message => resolve(message.sid));



        });
    } catch (error) {

        reject(error);

    }

}
module.exports = router;
