var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const xml2json = require('xml2json');
const { query } = require('express');
require('dotenv').config();


var bcbp = require('bcbp'); 

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

        var jsonbody = [];


        var objval;
        if (req.body != null) {

            const { bcbpstring } = req.body;
          

            let output = bcbp.decode(
                bcbpstring
            );

        
            objval = {
                'boardingPassIssuanceSource': output.boardingPassIssuanceSource,
                'boardingPassIssuerDesignator': output.boardingPassIssuerDesignator,
                'checkInSource': output.checkInSource,
                "documentType": output.documentType,
                'issuanceDate': output.issuanceDate,
                "passengerDescription": output.passengerDescription,
                'passengerName': output.passengerName,
                'Source': output.Source,
                'airlineNumericCode': output.legs[0].airlineNumericCode,
                'arrivalAirport': output.legs[0].arrivalAirport, 
                'checkInSequenceNumber': output.legs[0].checkInSequenceNumber,
                'compartmentCode': output.legs[0].compartmentCode,
                'departureAirport': output.legs[0].departureAirport,
                'flightDate': output.legs[0].flightDate,
                'flightNumber': output.legs[0].flightNumber,
                'operatingCarrierDesignator': output.legs[0].operatingCarrierDesignator,
                'marketingCarrierDesignator': output.legs[0].marketingCarrierDesignator,
                'passengerStatus': output.legs[0].passengerStatus, 
                'seatNumber': output.legs[0].seatNumber,
                'selecteeIndicator': output.legs[0].selecteeIndicator


            }
            jsonbody.push(objval);
            console.log(output);
            return res.json(jsonbody);
            

        }

    } catch (error) {
        return res.sendStatus(500, "Unable to Update the Redis Cache");
    }
});


module.exports = router;
