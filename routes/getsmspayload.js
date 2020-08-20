var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const xml2json = require('xml2json');
const { query } = require('express');
const accountSid = 'AC161d35e3365f707793e9ae359a790c6e';
const authToken = '695d5f7be331996ee450935ca1441758';
const client = require('twilio')(accountSid, authToken);


router.post('/',  function (req, res, next) {

    try {


        if (req.body != null) {

            const { passengerId } = req.body;

            updateredisdata(passengerId).then(function (resultVal) {
                {
                    res.json(resultVal);
            

                }


            }).catch(function (error) {
                console.error(error)
                return res.sendStatus(500, "unable to auth user or system Down");
            });

        }

    } catch (error) {
        return res.sendStatus(500, "Unable to Update the Redis Cache");
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


module.exports = router;
