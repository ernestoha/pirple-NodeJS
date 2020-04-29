/**
 * Primary file for API
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');
var helpers = require('./lib/helpers');
var _data = require('./lib/data');//testing
var log = require('./lib/logs');//testing
var handlers = require('./lib/handlers');
var config = require('./lib/config');

// log.add4Server001( {e123: "dir12"}, function (err) {
//   console.log(err);
// });
// return false;

var paymentDetails = {
"amount": "611",
"currency": "usd",
"source": "tok_visa", //tok_mastercard
"description": "My n Test Charge (created for API docs)",
"metadata[order_id]": "123",
"metadata[item-1-name]": "Hawaiian Pizza",
"metadata[item-1-price]": "35.5",
"metadata[item-1-qty]": "8",
"metadata[tip]": "9"
};

//handlers.payments.charge('8192', paymentDetails, function(err){console.log({"err->" : err});});
// handlers.emails.send('ernestoharias@gmail.com','Test','Email', function(err){console.log({"err->" : err});});

// var path = require('path');
// Filesystem = require('fs');
// var findFile, jsFiles, rootDir;
// jsFiles = [];
// var baseDir = path.join(__dirname,'/.data/');
 
// findFile = function(dir)
// {
//   let jsFiles = [];
//     fs.readdirSync(dir).forEach(function(file) {
//       jsFiles.push(fs.readFileSync("" + dir + "/" + file, 'utf8'));
//   });
//   return jsFiles;
// };

var files = ["hgarkdqg9b7q0ze8t7ka", "s3sxj6lmynzayq90okpw"];
var dir = "cart";
// _data.readDirByArraySync(files, dir, function (err, data) {
_data.readAllSync(dir, function (err, data) {
      console.log({"err": err, "data" : data.cart});
      console.log('eee111');
}, files);

//return false;
// console.log({"11":jsFiles});
// console.log({"12":findFile(baseDir+'menu')});
// return false;


//   _data.readAllSync("menu", function (err, data) {
//     console.log({"err": err, "data" : data});
//     console.log('eee111');
//   });

//   _data.readAll("menu", function (err, data) {
//     console.log({"err?": err, "data" : data});
//     console.log('eee');
//   });

// return false;