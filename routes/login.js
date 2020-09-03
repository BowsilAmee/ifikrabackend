var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const xml2json = require('xml2json');
var MongoClient = require('mongodb').MongoClient;

////TODO: Move the token to DB END
const refreshTokens = [];

//TODO: Move to Env variable
const accessTokenSecret = '1QNuYeLRO4u4NeH2OeVvr4xvHRlXRe7cCVwPUIWSlif5bTpnPSJ2VFaliNVN';
const refreshTokenSecret = '2pSiydOuPNnfstfW26WV0tOLvZYmJXEJPULiwShadmwwNbzxmA9sQqcjUMQm';

router.post('/', function (req, res, next) {
    // read username and password from request body
    const { username, password } = req.body;

    authUser(username, password).then(function (resultVal) {
        // filter user from the users array by username and password
        if (resultVal != null) {
            // generate an access token
            const accessToken = jwt.sign({ username: resultVal.username, role: resultVal.role }, accessTokenSecret, { expiresIn: '30m' });
            const refreshToken = jwt.sign({ username: resultVal.username, role: resultVal.role }, refreshTokenSecret);
            //TODO : Move to DB
            refreshTokens.push(refreshToken);
            var sessionexpire = new Date();
            sessionexpire.setMinutes(sessionexpire.getMinutes() + 30);
        
            createsabresession().then(function (sabresession) {

                updateredisdata(accessToken, refreshToken, sessionexpire, username, sabresession).then(function (resultVal) {
                    if (resultVal == "OK") {

                        res.json([{
                            accessToken,
                            refreshToken,
                            sessionexpire,
                            sabresession
                            
                        }]);
                    }
                    else {
                        console.error(error)
                        return res.sendStatus(500, "Unable to Update the Redis Cache");}

                }).catch(function (error) {
                    console.error(error)
                    return res.sendStatus(500, "Unable to Update the Redis Cache");
                });

            }).catch(function (error) {
                console.error(error)
                return res.sendStatus(500, "Unable to generate Session from Sabre");
            });

        } else {
            res.send(403, 'Username or password incorrect');
        }

    }).catch(function (error) {
        console.error(error)
        return res.sendStatus(500, "unable to auth user or system Down");
    });

});

//To get user details from DB
//User name as string
//password as clear text
function authUser(usernameval, passwordval) {


    return new Promise(function (resolve, reject) {
        var data;
        try {

            //TODO : move it Env variable 
            var connectionstring = "mongodb://agentdb:X6I6hcdmFki8SzKNqi9pFbyI0QSDOTZdaoYd1Cg4OYZ1CAw9lCyp2pTYWC6KWMutamMFwpYaRxrwmlGsdBeUzQ==@agentdb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false";

            MongoClient.connect(connectionstring, function (err, db) {

                var dbo = db.db("userdetails");

                var query = { username: usernameval, password: passwordval };
                dbo.collection("userdata").findOne(query,
                    function (err, result) {
                        if (err) {
                            console.log("Unexpected error");
                            reject(err);
                        }
                        else {
                            console.log("Sucessfully Authenticated");
                            //  console.log(result);
                            db.close();
                            resolve(result);
                        }

                    });
            });

        } catch (error) {
            console.log("Unsucessfull Authenticated");
            reject(error);

        }



    });


}



//To Generate the Sabre session for the Sabre Traction
function createsabresession() {
    try {
        return new Promise(function (resolve, reject) {
            const createsession = require("../modules/sessioncreate.js")

            createsession((err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(result)
                    const obj = xml2json.toJson(result, { object: true });
                    var tokenval = obj["soap-env:Envelope"]["soap-env:Header"]["wsse:Security"]["wsse:BinarySecurityToken"].$t;
                    resolve(tokenval);
                    //Demo
                }
            })


        });
    } catch (error) {

        reject(error);

    }
}

//To update the Redis data
function updateredisdata(key, refreshToken, expdatetime, username, binaytoken) {
    try {
        return new Promise(function (resolve, reject) {

            const add = require("../modules/redisconnection.js")
            var jwtvalue = "{'accessToken':'" + key + "'    ,'refreshToken':'" + refreshToken + "','sessionexpire':'" + expdatetime + "','uid':'" + username + "','binarytoken':'" + binaytoken + "'}";
            add(key, jwtvalue, "set", (err, result) => {
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