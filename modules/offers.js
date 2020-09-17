const xml2json = require('xml2json');
module.exports = (PNR, LastName, FirstName, FlightNo, OperatingClassOfService, FlightOrigin, DepartureDate, DepartureTime, ArrivalAirCode, ArrivalDate, ArrivalTime, EquipmentCode	, callback) => {
    // let sum = a + b
    let error = null
    const soapRequest = require('easy-soap-request');
    const fs = require('fs');

    //TODO : Move URL to ENV
    const url = 'https://stg.farelogix.com:443/xmlts/sandbox-ey';
    const soapHeader = {
        'Content-Type': 'text/xml;charset=UTF-8'
      
    };
    //TODO: Move URL for ENV
    var filePath = "./wsdl/FLXAnx.xml";
    const xml = fs.readFileSync(filePath, 'utf-8');

    var str = xml.toString();
    var mapObj = {
        PNR: PNR,
        LastName: LastName,
        FirstName: FirstName,
        FlightNo: FlightNo,
        OperatingClassOfService: OperatingClassOfService,
        FlightOrigin: FlightOrigin,
        DepartureDate: DepartureDate,
        DepartureTime: DepartureTime,
        ArrivalAirCode: ArrivalAirCode,
        ArrivalDate: ArrivalDate, 
        ArrivalTime: ArrivalTime,
        EquipmentCode: EquipmentCode
    };

    str = str.replace(/PNR|LastName|FirstName|FlightNo|OperatingClassOfService|FlightOrigin|DepartureDate|DepartureTime|ArrivalAirCode|ArrivalDate|ArrivalTime|EquipmentCode/gi, function (matched) {
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
    try {
        return new Promise(function (resolve, reject) {
            const obj = xml2json.toJson(xmldoc, { object: true });
            if (obj != null) {


                var jsonbody = [];

               
                var objval;



                if (obj["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:XXTransactionResponse"]["RSP"]["ServiceListRS"] != null) {
                   
                    var jsonobject = obj["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:XXTransactionResponse"]["RSP"]["ServiceListRS"]["OptionalServices"]["Service"]

                    for (let index = 0; index < jsonobject.length; index++) {
                        console.log(jsonobject[index]);

                        objval = {
     'Description': jsonobject[index]["Description"],
     'SubCode': jsonobject[index]["SubCode"],
     'ServiceCode': jsonobject[index]["ServiceCode"],
     "Method": jsonobject[index]["Method"],
     'Amount': jsonobject[index]["Amount"],
                            "Currency": jsonobject[index]["ServicePrice"]["CurrencyCode"].$t,
     'ValidatingCarrier': jsonobject[index]["ValidatingCarrier"],
     'Source': jsonobject[index]["Source"]
                }
                        jsonbody.push(objval);

    
}
                   
                    resolve(jsonbody);
                }
                else {
                    resolve("No Data Found.");
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

