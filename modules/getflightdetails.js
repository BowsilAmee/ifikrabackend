const xml2json = require('xml2json');

module.exports = (airlineval, flightno, depdate, flightorigin, binarytoken, callback) => {
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
    var filePath = "./wsdl/ACS_FlightDetailRQ.xml";
    const xml = fs.readFileSync(filePath, 'utf-8');

    var str = xml.toString();
    var mapObj = {
        binaryToken: binarytoken,
        FlightNoEY: flightno,
        DepartureDateEY: depdate,
        FlightOriginEY: flightorigin,
        airlinesEY: airlineval
    };

    str = str.replace(/binaryToken|FlightNoEY|DepartureDateEY|FlightOriginEY|airlinesEY/gi, function (matched) {
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

                if (obj["soap-env:Envelope"]["soap-env:Body"]["ns3:ACS_FlightDetailRS"] != null) {
                    var object1 = obj["soap-env:Envelope"]["soap-env:Body"]["ns3:ACS_FlightDetailRS"]["ItineraryResponseList"]["ItineraryInfoResponse"];
                    var object2 = obj["soap-env:Envelope"]["soap-env:Body"]["ns3:ACS_FlightDetailRS"]["PassengerCounts"];
                    var object3 = obj["soap-env:Envelope"]["soap-env:Body"]["ns3:ACS_FlightDetailRS"]

                    resolve(getItineraryInfoResponse(object1, object2, object3));
                    //resolve(object3);
                }
                else {
                    resolve("No Flights Found.")
                }
            }
            else {
                reject(error);
            }
        });
    } catch (error) {

        reject(error);

    }
    function getItineraryInfoResponse(jsonobj1, jsonobj2, jsonobj3) {

        try {

            var classOfService_eco;
            var Authorized_eco;
            var Booked_eco;
            var Available_eco;
            var Thru_eco;
            var Local_eco;
            var NonRevenueLocal_eco;
            var NonRevenueThru_eco;
            var PaperTicket_eco;
            var ElectronicTicket_eco;
            var Kiosk_eco;
            var StandbyRestriction_eco;
            var LocalOnBoard_eco;
            var TotalOnBoard_eco;
            var TotalBoardingPassIssued_eco;
            var classOfService_business;
            var Authorized_business;
            var Booked_business;
            var Available_business;
            var Thru_business;
            var Local_business;
            var NonRevenueLocal_business;
            var NonRevenueThru_business;
            var PaperTicket_business;
            var ElectronicTicket_business;
            var Kiosk_business;
            var StandbyRestriction_business;
            var LocalOnBoard_business;
            var TotalOnBoard_business;
            var TotalBoardingPassIssued_business;
            var classOfService_first;
            var Authorized_first;
            var Booked_first;
            var Available_first;
            var Thru_first;
            var Local_first;
            var NonRevenueLocal_first;
            var NonRevenueThru_first;
            var PaperTicket_first;
            var ElectronicTicket_first;
            var Kiosk_first;
            var StandbyRestriction_first;
            var LocalOnBoard_first;
            var TotalOnBoard_first;
            var TotalBoardingPassIssued_first;
            var object2 = jsonobj2;
            for (let index = 0; index < jsonobj2.length; index++) {
                switch (jsonobj2[index].classOfService) {
                    case "Y":
                        classOfService_eco = jsonobj2[index].classOfService;
                        Authorized_eco = jsonobj2[index].Authorized;
                        Booked_eco = jsonobj2[index].Booked;
                        Available_eco = jsonobj2[index].Available;
                        Thru_eco = jsonobj2[index].Thru;
                        Local_eco = jsonobj2[index].Local;
                        NonRevenueLocal_eco = jsonobj2[index].NonRevenueLocal;
                        NonRevenueThru_eco = jsonobj2[index].NonRevenueThru;
                        PaperTicket_eco = jsonobj2[index].PaperTicket;
                        ElectronicTicket_eco = jsonobj2[index].ElectronicTicket;
                        Kiosk_eco = jsonobj2[index].Kiosk;
                        StandbyRestriction_eco = jsonobj2[index].StandbyRestriction;
                        LocalOnBoard_eco = jsonobj2[index].LocalOnBoard;
                        TotalOnBoard_eco = jsonobj2[index].TotalOnBoard;
                        TotalBoardingPassIssued_eco = jsonobj2[index].TotalBoardingPassIssued;
                        break;
                    case "J":
                        classOfService_business = jsonobj2[index].classOfService;
                        Authorized_business = jsonobj2[index].Authorized;
                        Booked_business = jsonobj2[index].Booked;
                        Available_business = jsonobj2[index].Available;
                        Thru_business = jsonobj2[index].Thru;
                        Local_business = jsonobj2[index].Local;
                        NonRevenueLocal_business = jsonobj2[index].NonRevenueLocal;
                        NonRevenueThru_business = jsonobj2[index].NonRevenueThru;
                        PaperTicket_business = jsonobj2[index].PaperTicket;
                        ElectronicTicket_business = jsonobj2[index].ElectronicTicket;
                        Kiosk_business = jsonobj2[index].Kiosk;
                        StandbyRestriction_business = jsonobj2[index].StandbyRestriction;
                        LocalOnBoard_business = jsonobj2[index].LocalOnBoard;
                        TotalOnBoard_business = jsonobj2[index].TotalOnBoard;
                        TotalBoardingPassIssued_business = jsonobj2[index].TotalBoardingPassIssued;
                        break;
                    case "F":
                        classOfService_first = jsonobj2[index].classOfService;
                        Authorized_first = jsonobj2[index].Authorized;
                        Booked_first = jsonobj2[index].Booked;
                        Available_first = jsonobj2[index].Available;
                        Thru_first = jsonobj2[index].Thru;
                        Local_first = jsonobj2[index].Local;
                        NonRevenueLocal_first = jsonobj2[index].NonRevenueLocal;
                        NonRevenueThru_first = jsonobj2[index].NonRevenueThru;
                        PaperTicket_first = jsonobj2[index].PaperTicket;
                        ElectronicTicket_first = jsonobj2[index].ElectronicTicket;
                        Kiosk_first = jsonobj2[index].Kiosk;
                        StandbyRestriction_first = jsonobj2[index].StandbyRestriction;
                        LocalOnBoard_first = jsonobj2[index].LocalOnBoard;
                        TotalOnBoard_first = jsonobj2[index].TotalOnBoard;
                        TotalBoardingPassIssued_first = jsonobj2[index].TotalBoardingPassIssued;
                        break;

                }

            }

            var jsonstr = [
                {
                    Airline: jsonobj1.Airline,
                    Flight: jsonobj1.Flight,
                    Origin: jsonobj1.Origin,
                    DepartureDate: jsonobj1.DepartureDate,
                    DepartureTime: jsonobj1.DepartureTime,
                    ScheduledDepartureDate: jsonobj1.ScheduledDepartureDate,
                    ScheduledDepartureTime: jsonobj1.ScheduledDepartureTime,
                    EstimatedDepartureDate: jsonobj1.EstimatedDepartureDate,
                    EstimatedDepartureTime: jsonobj1.EstimatedDepartureTime,
                    DepartureGate: jsonobj1.DepartureGate,
                    BoardingTime: jsonobj1.BoardingTime,
                    ArrivalDate: jsonobj1.ArrivalDate,
                    ArrivalTime: jsonobj1.ArrivalTime,
                    ScheduledArrivalTime: jsonobj1.ScheduledArrivalTime,
                    EstimatedArrivalDate: jsonobj1.EstimatedArrivalDate,
                    EstimatedArrivalTime: jsonobj1.EstimatedArrivalTime,
                    AircraftType: jsonobj1.AircraftType,
                    FlightStatus: jsonobj1.FlightStatus,
                    AircraftConfigNumber: jsonobj1.AircraftConfigNumber,
                    CheckinRuleNumber: jsonobj1.CheckinRuleNumber,
                    SeatConfig: jsonobj1.SeatConfig,
                    BagCheckInOption: jsonobj1.BagCheckInOption,
                    AutoOn: jsonobj1.AutoOn,
                    classOfService_business_val: classOfService_business,
                    Authorized_business_val: Authorized_business,
                    Booked_business_val: Booked_business,
                    Available_business_val: Available_business,
                    Thru_business_val: Thru_business,
                    Local_business_val: Local_business,
                    NonRevenueLocal_business_val: NonRevenueLocal_business,
                    NonRevenueThru_business_val: NonRevenueThru_business,
                    PaperTicket_business_val: PaperTicket_business,
                    ElectronicTicket_business_val: ElectronicTicket_business,
                    Kiosk_business_val: Kiosk_business,
                    StandbyRestriction_business_val: StandbyRestriction_business,
                    LocalOnBoard_business_val: LocalOnBoard_business,
                    TotalOnBoard_business_val: TotalOnBoard_business,
                    TotalBoardingPassIssued_business_val: TotalBoardingPassIssued_business,
                    classOfService_first_val: classOfService_first,
                    Authorized_first_val: Authorized_first,
                    Booked_first_val: Booked_first,
                    Available_first_val: Available_first,
                    Thru_first_val: Thru_first,
                    Local_first_val: Local_first,
                    NonRevenueLocal_first_val: NonRevenueLocal_first,
                    NonRevenueThru_first_val: NonRevenueThru_first,
                    PaperTicket_first_val: PaperTicket_first,
                    ElectronicTicket_first_val: ElectronicTicket_first,
                    Kiosk_first_val: Kiosk_first,
                    StandbyRestriction_first_val: StandbyRestriction_first,
                    LocalOnBoard_first_val: LocalOnBoard_first,
                    TotalOnBoard_first_val: TotalOnBoard_first,
                    TotalBoardingPassIssued_first_val: TotalBoardingPassIssued_first,
                    classOfService_eco_val: classOfService_eco,
                    Authorized_eco_val: Authorized_eco,
                    Booked_eco_val: Booked_eco,
                    Available_eco_val: Available_eco,
                    Thru_eco_val: Thru_eco,
                    Local_eco_val: Local_eco,
                    NonRevenueLocal_eco_val: NonRevenueLocal_eco,
                    NonRevenueThru_eco_val: NonRevenueThru_eco,
                    PaperTicket_eco_val: PaperTicket_eco,
                    ElectronicTicket_eco_val: ElectronicTicket_eco,
                    Kiosk_eco_val: Kiosk_eco,
                    StandbyRestriction_eco_val: StandbyRestriction_eco,
                    LocalOnBoard_eco_val: LocalOnBoard_eco,
                    TotalOnBoard_eco_val: TotalOnBoard_eco,
                    TotalBoardingPassIssued_eco_val: TotalBoardingPassIssued_eco
                    
                  
                }

            ];
            return (jsonstr);





        } catch (error) {

            return(error);

        }

    }

}


