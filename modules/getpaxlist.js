const xml2json = require('xml2json');


module.exports = (airline, flightno, depdate, origin, queryval, binarytoken, callback) => {
    // let sum = a + b
    let error = null
    const soapRequest = require('easy-soap-request');
    const fs = require('fs');

    //TODO : Move URL to ENV
    const url = 'https://sws-crt.cert.havail.sabre.com';
    const soapHeader = {
        'Content-Type': 'text/xml;charset=UTF-8',
        'soapAction': 'https://sws-crt.cert.havail.sabre.com#ACS_PassengerListRQ',
    };
    //TODO: Move URL for ENV
    var filePath = "./wsdl/ACS_PassengerListRQ.xml";
    const xml = fs.readFileSync(filePath, 'utf-8');
    //TODO: Need to add multi Line
    var typelist = "<DisplayCode>" + queryval +"</DisplayCode>";
    var str = xml.toString();
    var mapObj = {
        binaryToken: binarytoken,
        airlinesstr: airline,
        flightnostr: flightno,
        depaturedatestr: depdate,
        flightoriginstr: origin,
        codestring: typelist
    };

    str = str.replace(/binaryToken|airlinesstr|flightnostr|depaturedatestr|codestring|flightoriginstr/gi, function (matched) {
        return mapObj[matched];
    });

    (async () => {
        const { response } = await soapRequest({ url: url, headers: soapHeader, xml: str, timeout: 10000 }); // Optional timeout parameter(milliseconds)
        const { headers, body, statusCode } = response;
        console.log(headers);
        console.log(body);
        console.log(statusCode);
        if (statusCode == 200) {
            //const obj = xml2json.toJson(result, { body: true });
            parsexml(body).then(function (resultVal) {
                callback(error, resultVal)
            });

        }

    })();

}

//To Generate the Sabre session for the Sabre Traction
function parsexml(xmldoc) {
    var o = new Object()
    var paxlist = {} // empty Object
    var key = 'paxlist';
    o[key] = []; // empty Array, which you can push() values into

    try {
        return new Promise(function (resolve, reject) {
            const obj = xml2json.toJson(xmldoc, { object: true });
            if (obj != null) {

                if (obj["soap-env:Envelope"]["soap-env:Body"]["ns3:ACS_PassengerListRS"]!= null) {
                    if (obj["soap-env:Envelope"]["soap-env:Body"]["ns3:ACS_PassengerListRS"]["PassengerInfoList"]  != null) {
                    var myobj = obj["soap-env:Envelope"]["soap-env:Body"]["ns3:ACS_PassengerListRS"]["PassengerInfoList"] ;
                  
                    var profile = JSON.parse(JSON.stringify( myobj["PassengerInfo"]));

                    
                    for (var i = 0; i < profile.length; i++) {

                         
                    
                        var data = {
                            LineNumber: profile[i].LineNumber,
                            LastName: profile[i].LastName,
                            FirstName: profile[i].FirstName,
                            PassengerID: profile[i].PassengerID,
                            PNRLocator: profile[i].PNRLocator.$t,
                            nameAssociationID: profile[i].PNRLocator.nameAssociationID,
                            GroupCode: profile[i].GroupCode,
                            BookingClass: profile[i].BookingClass,
                            Cabin: profile[i].Cabin,
                            Destination: profile[i].Destination,
                            Seat: profile[i].Seat,
                            BoardingPassFlag: profile[i].BoardingPassFlag,
                            PassengerType: profile[i].PassengerType,
                            BagCount: profile[i].BagCount,
                            CheckInNumber: profile[i].CheckInNumber

                        };
                        o[key].push(data);
                     
                    }


                //  resolve(obj["soap-env:Envelope"]["soap-env:Body"]["ns3:ACS_PassengerListRS"]["PassengerInfoList"]);

resolve(o);
                    }
                    else
                    {
                        resolve("No Pax data found.") 
                    }

                }
                else {
                    resolve("No Pax data found")
                }
            }
            else {
                reject(error);
            }
        });
    } catch (error) {

        reject(error);

    }
}

