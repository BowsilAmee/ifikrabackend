var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const xml2json = require('xml2json');
const { query } = require('express');

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

router.post('/', function (req, res, next) {

    try {

        if (req.body != null) {


            try {
                
           
                //var jsonObject = eval('(' + binarytoken + ')');
                const { keyname, jstring, requesttype, timeout} = req.body;

                const add = require("../modules/redisconnectiontimeout.js")

                add(keyname, jstring, requesttype, 30, (err, result) => {
                    if (err) { // Best practice to handle your errors
                        console.log(err)
                    } else { // Implement the logic, what you want to do once you recieve the response back 
                        console.log(result);
                        if (result != null) { res.send(result) } else { res.send("No data Avaliable") }

                    }
                })

            } catch (error) {
                return res.sendStatus(500, "No data found");
            }
         



        }





    } catch (error) {
        console.log(error);
    }
});


module.exports = router;
