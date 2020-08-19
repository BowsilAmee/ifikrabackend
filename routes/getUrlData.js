var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const xml2json = require('xml2json');
const { query } = require('express');
var fs = require('fs');

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
                const { gate } = req.body;
                var filePath = "./jsondata/auhairport.json";
                // read file sample.json file
                fs.readFile(filePath,
                    // callback function that is called when reading file is done
                    function (err, data) {
                        // json data
                        var jsonData = data;

                        // parse json
                        var jsonParsed = JSON.parse(jsonData);
                        for (let index = 0; index < jsonParsed.length; index++) {
                            //const element = array[index];

                            if (jsonParsed[index].is_gate !== null && jsonParsed[index].is_gate == "true") {

                                if (jsonParsed[index].name == gate) {
                                    var value = jsonParsed[index];
                                    res.send(200, value);
                                }
                                

                                
                            }



                        }
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

module.exports = router;
