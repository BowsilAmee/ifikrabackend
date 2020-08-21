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

router.post('/', authenticateJWT,  function (req, res, next) {

try {


        if (req.body != null) {

            const { passengerId, url, mapId, location, typeVal, isconnectingGate} = req.body;

            updateredisdata(passengerId, url, mapId, location, typeVal, isconnectingGate).then(function (error,resultVal) {
                if (resultVal == "OK") {
                    res.json({
                        passengerId,
                        mapId,
                        url,
                        isconnectingGate

                    });

                }
                else {
                    console.error(error)
                    return res.sendStatus(500, "Unable to Update the Redis Cache");
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
function updateredisdata(passengerId, url, mapId, location, typeVal, isconnectingGate) {
    try {
        return new Promise(function (resolve, reject) {


            var jsonkey = {} // empty Object
            var key = 'urlpayload';
            jsonkey[key] = []; // empty Array, which you can push() values into


            var data = {
                passengerId: passengerId,
                url: url,
                mapId:mapId,
                location :location,
                typeVal: typeVal,
                isconnectingGate: isconnectingGate
            };
         
            jsonkey[key].push(data);

            const add = require("../modules/redisconnection.js")
            //var jwtvalue = "{'passengerId':'" + passengerId + "'    ,'url':'" + url + "','mapId':'" + mapId + "','location':'" + location + "','typeVal':'" + typeVal + "','isconnectingGate':'" + isconnectingGate + "'}";
            add(passengerId, JSON.stringify(jsonkey), "set", (err, result) => {
                if (err) { // Best practice to handle your errors
                    console.log(err)
                } else { // Implement the logic, what you want to do once you recieve the response back 
                    console.log(result)
                    resolve(result);
                }
            })


        });
    } catch (err) {

        reject(err);

    }

}

module.exports = router;
