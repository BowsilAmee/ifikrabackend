
module.exports = (jwtid, dbvalue, gettype, callback) => {
    var error = null;

    var redis = require("redis");
    ///TODO: Move this to ENV Variable
    var client = redis.createClient(6380, "agentapp.redis.cache.windows.net",
        {
            connectTimeout: 30000
, auth_pass: "qDwjAsMvQbWKO+w8ii+RZWWJDQI5aBIC4bAOkHnYnoY=", tls: { servername: "agentapp.redis.cache.windows.net" } });

    ///TODO : Thorw error in case of Connection Error 
    //TODO : Execption handling 
    client.on("error", function (error) {
        console.error(error);
    });

    switch (gettype) {

        case "set":
            client.set(jwtid, dbvalue, (err, reply) => {
                callback(error, reply);
            });
            break;
        case "get":
            client.get(jwtid, (err, reply) => {
                callback(error, reply);
            });
            break;
        case "delete":
            client.get(jwtid, (err, reply) => {
                callback(error, reply);
            });
            break;

    }





}

