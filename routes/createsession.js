var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const xml2json = require('xml2json');

var request = require('request');
const { json } = require('express');
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
            const { returnUrl, cancelUrl, transID, currency, reference, bookingReference, ticketNumber, amount} = req.body;

            CreateSession(returnUrl, cancelUrl, transID, currency, reference, bookingReference, ticketNumber).then(function (sessionvalue) {
 
                var sessiondetails = JSON.parse(sessionvalue);
                if (sessiondetails['session']['updateStatus'] != null && sessiondetails['session']['updateStatus'] =="SUCCESS")
                {

                var paymentid = Math.floor(100000000000 + Math.random() * 900000000000);

                var jsonbody=[];

                var obj = {
                    'sessionid': sessiondetails['session']['id'],
                    'currency': currency,
                    'amount': amount,
                    "description": "Instant Upgrade",
                    'successidentifier': sessiondetails['successIndicator'], 
                    'pnr': bookingReference,
                    'qrstatus':"active",
                    'paymentstatus':'requested'
                }
                    jsonbody.push(obj);


                    savesession(paymentid, JSON.stringify(jsonbody),"set","" ).then(function (resultVal) {
                    if (resultVal == "OK") {
                        res.json({
                            paymentid 
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

            }
            else
                {
                    return res.sendStatus(500, "unable to auth user or system Down"); 
                }
            }).catch(function (error) {
                console.error(error)
                return res.sendStatus(500, "unable to auth user or system Down");
            });



        }





    } catch (error) {
        console.log(error);
    }
});


//To get user details from DB
//User name as string
//password as clear text
function CreateSession(returnUrl, cancelUrl, transID, currencyValue, reference, bookingReference, ticketNumber) {


    return new Promise(function (resolve, reject) {
        var data;
        try {

            var mapObj = {
                returnUrlval: returnUrl,
                cancelUrlval: cancelUrl,
                tranid: transID,
                currencyValue: currencyValue, 
                refid: reference,
                pnr: bookingReference,
                txtno: ticketNumber
            };

            var str = '{ "apiOperation": "CREATE_CHECKOUT_SESSION", "interaction": { "returnUrl": "returnUrlval" ,"cancelUrl": "cancelUrlval", "operation": "PURCHASE" }, "order": { "id": "tranid", "currency": "currencyValue", "reference": "refid" }, "airline": { "bookingReference": "pnr", "ticket": { "ticketNumber": "txtno" } } }';


            str = str.replace(/returnUrlval|cancelUrlval|tranid|currencyValue|refid|pnr|txtno/gi, function (matched) {
                return mapObj[matched];
            });
            
            var jsonbody = JSON.stringify(JSON.parse(str)) ;


//TODO : Move to config or Keyvalue
            var options = {
                'method': 'POST',
                'url': 'https://ap-gateway.mastercard.com/api/rest/version/54/merchant/TEST187842078/session',
                'headers': {
                    'Authorization': 'Basic bWVyY2hhbnQuVEVTVDE4Nzg0MjA3ODoyNzRkZTlkYzEwYjdlNjJhMDhlNDFkMGI4OGMxZjhkMw==',
                    'Content-Type': 'application/json',
                    'Cookie': 'TS01f8f5b8=0163461fddca226e7b46b68233b3073cfb07aa9f97fd0bc40121fdaf65c7b3e9d7c8a0128f304df5495c106d648231a12dab0281e3'
                },
                body: jsonbody

            };
            request(options, function (error, response) {
                if (error) {throw new Error(error)}
                else
                {
                console.log(response.body);
                    resolve(response.body);
            }
            });

        } catch (error) {
            console.log("Unsucessfull Authenticated");
            reject(error);

        }



    });


}



function savesession(keyname, jstring, requesttype, timeout) {


    return new Promise(function (resolve, reject) {
        var data;
        try {

            //var jsonObject = eval('(' + binarytoken + ')');
         //   const { keyname, jstring, requesttype, timeout } = req.body;

            const add = require("../modules/redisconnectiontimeout.js")

            add(keyname, jstring, requesttype, 300, (err, result) => {
                if (err) { // Best practice to handle your errors
                    console.log(err)
                } else { // Implement the logic, what you want to do once you recieve the response back 
                    console.log(result);
                    if (result != null) { resolve(result) } else { res.send("No data Avaliable") }

                }
            })

        } catch (error) {
            console.log("Unsucessfull Authenticated");
            reject(error);

        }



    });


}


module.exports = router;
