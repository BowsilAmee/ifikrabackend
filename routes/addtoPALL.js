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
                const { fltno, bookingclassinfo, depdate, orignstation, lastnameval, paxid, PriorityCodeval } = req.body;

                addtoPall(jsonObject["binarytoken"], fltno, bookingclassinfo, depdate, orignstation, lastnameval, paxid, PriorityCodeval ).then(function (statusval) {
                    res.send(statusval);


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
function addtoPall(binarytoken, fltno, bookingclassinfo, depdate, orignstation, lastnameval, paxid, PriorityCodeval) {
    try {
        return new Promise(function (resolve, reject) {

            const add = require("../modules/addtoPList.js")
            add(binarytoken, fltno, bookingclassinfo, depdate, orignstation, lastnameval, paxid, PriorityCodeval, (err, result) => {
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
