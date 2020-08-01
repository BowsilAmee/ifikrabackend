var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const xml2json = require('xml2json');
//TODO: Move the token to DB
const refreshTokens = [];
const accessTokenSecret = '1QNuYeLRO4u4NeH2OeVvr4xvHRlXRe7cCVwPUIWSlif5bTpnPSJ2VFaliNVN';
const refreshTokenSecret = '2pSiydOuPNnfstfW26WV0tOLvZYmJXEJPULiwShadmwwNbzxmA9sQqcjUMQm';

router.post('/', function (req, res, next) {
    const { token, reftoken } = req.body;
    updateredisdata(token, "", "", "", "", "get").then(function (resultVal) {

        var jsonObject = eval('(' + resultVal + ')')
       
        if (!reftoken) {
            return res.sendStatus(401);
        }

        if (jsonObject.refreshToken != reftoken)
        {
            return res.sendStatus(403);
        }



        jwt.verify(jsonObject.refreshToken, refreshTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '30m' });
            var sessionexpire = new Date();
            sessionexpire.setMinutes(sessionexpire.getMinutes() + 30);
        
            createsabresession().then(function (sabresession) {

                updateredisdata(accessToken, reftoken, sessionexpire, user.username, sabresession,"set").then(function (resultVal) {
                    if (resultVal == "OK") {
                        res.json({
                            accessToken,
                            reftoken,
                            sessionexpire
                        });
                        
                    }
                    else {
                        console.error(error)
                        return res.sendStatus(500, "Unable to Update the Redis Cache");
                    }

                }).catch(function (error) {
                    console.error(error)
                    return res.sendStatus(500, "Unable to Update the Redis Cache");
                });

            }).catch(function (error) {
                console.error(error)
                return res.sendStatus(500, "Unable to generate Session from Sabre");
            });
            
         
        });
    }).catch(function (error) {
        console.error(error)
        return res.sendStatus(500, "unable to Create token from Refresh Token");
    });
});

//To New token from Refresh token
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
                }
            })


        });
    } catch (error) {

        reject(error);

    }
}

//To update the Redis data
function updateredisdata(key, refreshToken, expdatetime, username, binaytoken,types) {
    try {
        return new Promise(function (resolve, reject) {

            const add = require("../modules/redisconnection.js")
            var jwtvalue = "{'accessToken':'" + key + "'    ,'refreshToken':'" + refreshToken + "','sessionexpire':'" + expdatetime + "','uid':'" + username + "','binarytoken':'" + binaytoken + "'}";
            add(key, jwtvalue, types, (err, result) => {
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