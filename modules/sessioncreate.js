
module.exports = (callback) => {
    // let sum = a + b
    let error = null
    const soapRequest = require('easy-soap-request');
    const fs = require('fs');

//TODO : Move URL to ENV
    const url = 'https://sws-crt.cert.havail.sabre.com';
    const soapHeader = {
        'Content-Type': 'text/xml;charset=UTF-8',
        'soapAction': 'https://sws-crt.cert.havail.sabre.com#SessionCreateRQ',
    };
//TODO: Move URL for ENV
    var filePath = "Guest/GuestAgent/wsdl/sessioncreate.xml";
    const xml = fs.readFileSync(filePath, 'utf-8');
    (async () => {
        const { response } = await soapRequest({ url: url, headers: soapHeader, xml: xml, timeout: 1000 }); // Optional timeout parameter(milliseconds)
        const { headers, body, statusCode } = response;
        console.log(headers);
        console.log(body);
        console.log(statusCode);
        if (statusCode == 200) {
            callback(error, body)
        }

    })();

}

