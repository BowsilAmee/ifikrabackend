var express = require('express');
var router = express.Router();
const xml2json = require('xml2json');
var MongoClient = require('mongodb').MongoClient;
/* GET users listing. */
router.post('/', function (req, res, next) {
    console.log(req)
    const { paxid, flightno, depdate, status, sossatus, lat, log, paxname,pnr } = req.body;

    updatesos(paxid, flightno, depdate, status, sossatus, "web", lat, log, paxname, pnr).then(function (resultVal) {
        // filter user from the users array by username and password
        if (resultVal != null) {
            return res.sendStatus(201, "Created SOS Item");
        }
        else
        {
            return res.sendStatus(500, "Unable to Update the SOS List");
        }


});

});


//To get user details from DB
//User name as string
//password as clear text
function updatesos(paxidval, flightnoval, depdateval, statusval, sossatusval, updatebyval, lat, log, paxname, pnr) {


    return new Promise(function (resolve, reject) {
        var data;
        try {

            //TODO : move it Env variable 
            var connectionstring = "mongodb://agentdb:X6I6hcdmFki8SzKNqi9pFbyI0QSDOTZdaoYd1Cg4OYZ1CAw9lCyp2pTYWC6KWMutamMFwpYaRxrwmlGsdBeUzQ==@agentdb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false";

            MongoClient.connect(connectionstring, function (err, db) {

                if (err) throw err;
                var dbo = db.db("userdetails");

                var myobj = { paxid: paxidval, flightno: flightnoval, depdate: depdateval, status: sossatusval, status: statusval, updatedby: updatebyval, created: Date.now().toString(), lat: lat, long: log, paxname: paxname, pnr: pnr };
                dbo.collection("soslist").insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    db.close();
                    resolve("Sucessfully updated")
                });

            });

        } catch (error) {
            console.log("Unsucessfull Authenticated");
            reject(error);

        }



    });


}
module.exports = router;
