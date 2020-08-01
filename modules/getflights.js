const xml2json = require('xml2json');
module.exports = (flightno, station, dateval, timefromno, binarytoken, callback) => {
  // let sum = a + b
  let error = null
  const soapRequest = require('easy-soap-request');
  const fs = require('fs');

  //TODO : Move URL to ENV
  const url = 'https://sws-crt.cert.havail.sabre.com';
  const soapHeader = {
    'Content-Type': 'text/xml;charset=UTF-8',
    'soapAction': 'https://sws-crt.cert.havail.sabre.com#ACS_AirportFlightListRQ',
  };
  //TODO: Move URL for ENV
  var filePath = "Guest/GuestAgent/wsdl/ACS_AirportFlightListRQ.xml";
  const xml = fs.readFileSync(filePath, 'utf-8');

  var str = xml.toString();
  var mapObj = {
    binaryToken: binarytoken,
    flightno: flightno,
    station: station,
    hrsfrom: timefromno,
    fltdate: dateval
  };

  str = str.replace(/binaryToken|flightno|station|hrsfrom|fltdate/gi, function (matched) {
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
         resolve(obj["soap-env:Envelope"]["soap-env:Body"]["ns3:ACS_AirportFlightListRS"]["AirportFlightList"]["AirportFlight"]);

      }
      else {
        reject(error);
      }
    });
  } catch (error) {

    reject(error);

  }
}

