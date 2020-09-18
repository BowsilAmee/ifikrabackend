
module.exports = (jwtid, dbvalue, gettype, timeoutval, callback) => {
    var error = null;

    var redis = require("redis");
    ///TODO: Move this to ENV Variable
    var client = redis.createClient(6380, "agentapp.redis.cache.windows.net",
        { auth_pass: "qDwjAsMvQbWKO+w8ii+RZWWJDQI5aBIC4bAOkHnYnoY=", tls: { servername: "agentapp.redis.cache.windows.net" } });

    ///TODO : Thorw error in case of Connection Error 
    //TODO : Execption handling  yes we need to do this because of redis 
    client.on("error", function (error) {
        console.error(error);
    });

    switch (gettype) {

        case "set":
            client.set(jwtid, dbvalue,'EX',timeoutval, (err, reply) => {
                callback(err, reply);
            });
            break;
        case "get":
            client.get(jwtid, (err, reply) => {
                callback(err, reply);
            });
            break;
        case "delete":
            client.get(jwtid, (err, reply) => {
                callback(err, reply);
            });
            break;

    }





}

