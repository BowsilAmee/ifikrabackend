var express = require('express');
var router = express.Router();
const xml2json = require('xml2json');
var MongoClient = require('mongodb').MongoClient;
/* GET users listing. */
router.post('/', function (req, res, next) {
    console.log(req)
    const { paxid, flightno, depdate, status, sossatus } = req.body;

    updatesos(paxid, flightno, depdate, status, sossatus).then(function (resultVal) {
        // filter user from the users array by username and password
        if (resultVal != null) {
            return res.json(201, resultVal);
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
function updatesos(paxidval, flightnoval, depdateval, statusval, sossatusval, updatebyval) {


    return new Promise(function (resolve, reject) {
        var data;
        try {

            //TODO : move it Env variable 
            var connectionstring = "mongodb://agentdb:X6I6hcdmFki8SzKNqi9pFbyI0QSDOTZdaoYd1Cg4OYZ1CAw9lCyp2pTYWC6KWMutamMFwpYaRxrwmlGsdBeUzQ==@agentdb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false";

            MongoClient.connect(connectionstring, function (err, db) {

                if (err) throw err;
                var dbo = db.db("userdetails");
                //var query = "{flightno: '" + flightnoval + "', depdate: '" + depdateval + "', status: '" + statusval+"' }";
                var myobj = { flightno: flightnoval, depdate: depdateval,status: statusval};
                dbo.collection("soslist").find(myobj).toArray(function (err, result) {  
               
                // dbo.collection("soslist").find(myobj).to,
                //     function (err, result) {
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
module.exports = router;
