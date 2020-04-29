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

        _data.create(jsonDir, orderId, JSON.stringify(paymentDetails)+"\n", function (err) {
            if (!err){
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
                        // _data.create(jsonDir, orderId +" "+ Date.now(), value, function (err) {
                        _data.append(jsonDir, orderId, value, function (err) {
                            if (!err) {
                                callback(value);
                            } else {
                                value.errorMessage += 'Could not append the payment charge file. '+err;
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
                value.errorMessage += 'Could not create the payment charge file. '+err;
                console.log({"payments-charge-error-file" : err});
                callback(value);
            }
        });
    } else {
        callback('Given parameters were missing or invalid.');
    }
};

payments.charge4Test = function (orderId, paymentDetails, callback) {
    var value ='{"id":"ch_1Gd5HBH1iJwlFMdq3MgwBe0o","object":"charge","amount":62,"amount_refunded":0,"application":null,"application_fee":null,"application_fee_amount":null,"balance_transaction":"txn_1Gd5HCH1iJwlFMdqIFtbo1l6","billing_details":{"address":{"city":null,"country":null,"line1":null,"line2":null,"postal_code":null,"state":null},"email":null,"name":null,"phone":null},"calculated_statement_descriptor":"Stripe","captured":true,"created":1588125833,"currency":"usd","customer":null,"description":"Ernesto Herrera  Pizza","destination":null,"dispute":null,"disputed":false,"failure_code":null,"failure_message":null,"fraud_details":{},"invoice":null,"livemode":false,"metadata":{"order_id":"1jj234","Four Cheese Pizza = 1 ":"3.99","Hawaiian Pizza = 2 ":"5.55"},"on_behalf_of":null,"order":null,"outcome":{"network_status":"approved_by_network","reason":null,"risk_level":"normal","risk_score":28,"seller_message":"Payment complete.","type":"authorized"},"paid":true,"payment_intent":null,"payment_method":"card_1Gd5HBH1iJwlFMdqAZsYsDsm","payment_method_details":{"card":{"brand":"visa","checks":{"address_line1_check":null,"address_postal_code_check":null,"cvc_check":null},"country":"US","exp_month":4,"exp_year":2021,"fingerprint":"MRAZSTbyKgy68SXS","funding":"credit","installments":null,"last4":"4242","network":"visa","three_d_secure":null,"wallet":null},"type":"card"},"receipt_email":null,"receipt_number":null,"receipt_url":"https://pay.stripe.com/receipts/acct_1GX1GBH1iJwlFMdq/ch_1Gd5HBH1iJwlFMdq3MgwBe0o/rcpt_HBSB8n980dYuUtP9EQudickd1kvS1zk","refunded":false,"refunds":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/charges/ch_1Gd5HBH1iJwlFMdq3MgwBe0o/refunds"},"review":null,"shipping":null,"source":{"id":"card_1Gd5HBH1iJwlFMdqAZsYsDsm","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":null,"cvc_check":null,"dynamic_last4":null,"exp_month":4,"exp_year":2021,"fingerprint":"MRAZSTbyKgy68SXS","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"source_transfer":null,"statement_descriptor":null,"statement_descriptor_suffix":null,"status":"succeeded","transfer_data":null,"transfer_group":null}';
    //var value  = '{"error": {"code": "amount_too_small","doc_url": "https://stripe.com/docs/error-codes/amount-too-small","message": "Amount must be at least $0.50 usd","param": "amount","type": "invalid_request_error"}}';
    callback(helpers.parseJsonToObject(value));
};

// Export the module
module.exports = payments;