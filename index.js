/**
 * Primary file for API
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');
var helpers = require('./lib/helpers');
var httpPort = 3000;

 // Instantiate the HTTP server
var httpServer = http.createServer(function(req,res){
  unifiedServer(req,res);
});

// Start the HTTP server
httpServer.listen(httpPort,function(){
  console.log('The HTTP server is running on port '+httpPort);
});

// All the server logic for http (and https server TODO) requests
var unifiedServer = function(req,res){

  // Parse the url
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  //Get the headers as an object
  var headers = req.headers;

  // Get the payload,if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
      buffer += decoder.write(data);
  });
  req.on('end', function() {
      buffer += decoder.end();

      // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
      var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

      // Construct the data object to send to the handler
      var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : helpers.parseJsonToObject(buffer)
      };

      // Route the request to the handler specified in the router
      chosenHandler(data,function(statusCode,payload){

        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        // Use the payload returned from the handler, or set the default payload to an empty object
        payload = typeof(payload) == 'object' ? payload : {};

        // Convert the payload to a string
        var payloadString = JSON.stringify(payload);

        // Return the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log(trimmedPath,statusCode, payloadString);
      });

  });
};

// Define all the handlers
var handlers = {};

// Ping handler
handlers.ping = function(data,callback){
    callback(200);
};

// Not-Found handler
handlers.notFound = function(data,callback){
  callback(404);
};

// Hello [World] handler
handlers.hello = function(data,callback){
    var acceptableMethods = ['post','get'];
    if(acceptableMethods.indexOf(data.method) > -1){
        var dataPath = (data.method=='post') ? "payload" : "queryStringObject";
        var name = typeof(data[dataPath].name) == 'string' && data[dataPath].name.trim().length > 0 ? data[dataPath].name.trim() : false;
        var data = {"greetings" : ("Hello World " + ((name) ? name : '')).trim() + '.'};
        console.log(data);
        callback(200, data);  
    } else {
      callback(405);
    }
  };

// Define the request router
var router = {
  'ping' : handlers.ping,
  'hello' : handlers.hello
};