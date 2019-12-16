// import * as restify from "restify";
// import * as corsMiddleware from "restify-cors-middleware";
import { initAPI } from "./rest/api";
var express        =        require("express");
var bodyParser     =        require("body-parser");
var app            =        express();
var cors = require('cors')
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
// const server = restify.createServer()
// var cors = corsMiddleware({
//   preflightMaxAge: 5, // Optional
//   origins: ['*'], // Should whitelist actual domains in production
//   allowHeaders: ['Authorization', 'API-Token', 'Content-Range'], //Content-range has size info on lists
//   exposeHeaders: ['Authorization', 'API-Token-Expiry', 'Content-Range']
// })

// app.pre(cors.preflight)
// app.use(cors.actual)

// server.use(restify.plugins.queryParser()); //{mapParams: true}
// server.use(restify.plugins.bodyParser());  //{mapParams: true, mapFiles: true}
// server.use(restify.plugins.acceptParser(server.acceptable));

initAPI(app).then(()=> {
  const server = app.listen(4000, function() {
    var host = server.address().address,
        port = server.address().port;

    console.log('listening at http://%s:%s', host, port);
  })
});

