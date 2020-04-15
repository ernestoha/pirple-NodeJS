/**
 * Payment Controller & Model, API request
 * @TODO GET list of payments send to
 */

// Dependencies
var https = require('https');
var qs = require('querystring');
var config = require('./../lib/config');
var _data = require('./../lib/data');
var helpers = require('./../lib/helpers');
var jsonDir = 'payments';

// Container for module (to be exported)
var payments = {};

/**
 * API request

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
handlers.payments.charge('8192', paymentDetails, function(err){console.log({"err->" : err});});
 */
payments.charge = function (orderId, paymentDetails, callback) {
    // Validate parameters
    orderId = typeof (orderId) == 'string' && orderId.trim().length > 0 ? orderId.trim() : false;
    paymentDetails = typeof (paymentDetails) == 'object' ? paymentDetails : false;
    
    if (orderId && paymentDetails) {

        var postData = qs.stringify(
            paymentDetails
        );
        
        var options = {
            'protocol': 'https:',
            'hostname': 'api.stripe.com',
            'method': 'POST',
            'path': '/v1/charges',
            'headers': {
              'Authorization': 'Bearer ' + config.payments.stripe.secretKey,
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(postData)
            }
          };

        var req = https.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                var value = helpers.parseJsonToObject(body.toString());
                console.log({ 'body_toString': (value) ? value : body });
                var status = res.statusCode;
                console.log({ 'payments-status': status });
                value = ((value) ? value : {"id" : -1, "message":body});
                
                // Callback successfully if the request went through
                if (!(status == 200 || status == 201)) {
                    value.errorMessage = 'Status code returned was ' + status + '. ';
                }

                // Store the API response after sent the payment +" "+ Date.now()
                _data.create(jsonDir, orderId +" "+ Date.now(), value, function (err) {
                    if (!err) {
                        callback(value);
                    } else {
                        value.errorMessage += 'Could not create the payment charge file. '+err;
                        console.log({"payments-charge-error" : err});
                        callback(value);
                    }
                });
            });

            res.on("error", function (error) {
                var value = helpers.parseJsonToObject(error.toString());
                console.error({ "payments-error": (value) ? value : error });
                value.id = 'Status code returned was ' + status;
                callback(value);
            });
        });
        
        req.write(postData);

        req.end();

    } else {
        callback('Given parameters were missing or invalid.');
    }
};

// Export the module
module.exports = payments;