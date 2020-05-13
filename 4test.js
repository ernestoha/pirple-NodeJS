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
var cliTest= require('./lib/cli');

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
// handlers.emails.send('8192', 'ernestoharias@gmail.com','Test','Email', function(err){console.log({"err->" : err});});
// handlers.emails.pending.getAll(unction(err, orderId   {
      // handlers.emails.pending.sendOrderCreatedAndMv("bzku0p4bcfldu4s1ksb8.json", function(err){console.log({"err->" : err});});
// });

// handlers.emails.pending.getAll(function(err, emailsPending){
//       emailsPending.forEach(function(orderIdFile) {
//             console.log(orderIdFile);
//             handlers.emails.pending.sendOrderCreatedAndMv("b1zku0p4bcfldu4s1ksb8.json", function(err){
//                   if(err){
//                         // console.log('\x1b[31m%s\x1b[0m', {"err->" : JSON.stringify(err)});
//                         console.log({"err->" : JSON.stringify(err)});
//                   }
//             });
//       });
      
//      // handlers.emails.pending.sendOrderCreatedAndMv("bzku0p4bcfldu4s1ksb8", function(err){console.log({"err->" : err});});
//      // console.log(err);
//      // console.log(data);
// });
console.log(cliTest);
// console.log(cliTest.responders.listUsers());
// console.log(cliTest.responders.listOrders());
// console.log(cliTest.responders.moreOrderInfo("--dtw6ahbh00od10c9m550"));
// console.log(cliTest.responders.moreOrderInfo("--nf9fzlkyvepixfckhta9"));
//ini
console.log(cliTest.responders.moreInfo("--all", "orders"));
// console.log(cliTest.responders.moreInfo("--dtw6ahbh00od10c9m550", "orders"));
// console.log(cliTest.responders.moreInfo("--nf9fzlkyvepixfckhta9", "orders"));

// console.log(cliTest.responders.moreInfo("--5bmwp8ovgf45rx9qfyuz", "cart"));
// console.log(cliTest.responders.moreInfo("--dtw6ahbh00od10c9m550", "payments"));
// console.log(cliTest.responders.moreInfo("--nf9fzlkyvepixfckhta9", "payments"));

// console.log(cliTest.responders.moreInfo("--lsnfcmg2yhux6vxaa7yy", "payments"));
console.log(cliTest.responders.moreInfo("--8192 1586935905028", "payments"));
console.log(cliTest.responders.morePaymentInfo("--wub9f03c19y9wuyffl85", "payments"));
console.log(cliTest.responders.morePaymentInfo("--wub9f03c19y9wuyffl85", "payments"));
// console.log(cliTest.responders.moreInfo("--dtw6ahbh00od10c9m550", "emails/sent"));
// console.log(cliTest.responders.listPayments());


// console.log(cliTest.responders.moreInfo("--all", "menu"));
// console.log(cliTest.responders.moreInfo("--1", "menu"));
// console.log(cliTest.responders.moreMenuInfo("--all")); //old
// console.log(cliTest.responders.listOrders());
return false;

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
_data.readAll(dir, function (err, data) {
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