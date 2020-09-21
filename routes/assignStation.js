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

router.post('/', authenticateJWT, function (req, res, next) {

    try {

        if (req.body != null) {

            getbinarytoken(token).then(function (binarytoken) {

                var jsonObject = eval('(' + binarytoken + ')');
                const { station } = req.body;

                changeContext(station, jsonObject["binarytoken"]).then(function (statusval) {
                    if (statusval != null)
                    {
                        assignMBP(jsonObject["binarytoken"]).then(function (statusval) {
                            
                           if (statusval != null)
                           { res.send(200); }
                           else{
                               res.send(500);
                           }

                        }).catch(function (error) {
                            console.error(error)
                            return res.sendStatus(500, "unable to auth user or system Down");
                        });

                    }

        


                }).catch(function (error) {
                    console.error(error)
                    return res.sendStatus(500, "unable to auth user or system Down");
                });


            }).catch(function (error) {
                console.error(error)
                return res.sendStatus(500, "unable to auth user or system Down");
            });



        }





    } catch (error) {
        console.log(error);
    }
});
//To Generate the Sabre session for the Sabre Traction
function getbinarytoken(jwttoken) {
    try {
        return new Promise(function (resolve, reject) {

            const add = require("../modules/redisconnection.js")
            add(jwttoken, "", "get", (err, result) => {
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

//To Generate the Sabre session for the Sabre Traction
function changeContext(binarytoken, stationid) {
    try {
        return new Promise(function (resolve, reject) {

            const add = require("../modules/changecontext.js")
            add(binarytoken, stationid, (err, result) => {
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


//To Generate the Sabre session for the Sabre Traction
function assignMBP(binarytoken) {
    try {
        return new Promise(function (resolve, reject) {

            const add = require("../modules/assignMBP.js")
            add(binarytoken, (err, result) => {
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
