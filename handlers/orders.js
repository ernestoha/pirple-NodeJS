/**
 * Orders Controller & Model
 */

// Dependencies
var log = require('./../lib/logs');
const _data = require('./../lib/data');
const helpers = require('./../lib/helpers');
const jsonDir = 'orders';
let _handlers = require('./tokens.js'); // Tokens, Cart Handler
_handlers._cart = require('./cart.js')._cart;
_handlers.payments = require('./payments');
_handlers.emails = require('./emails');

// console.log("ee-test-ee",_handlers._tokens.verifyToken);
//Define handlers
var handlers = {};

// Orders
handlers.orders = function (data, callback) {
    var acceptableMethods = ['post'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._orders[data.method](data, callback);
    } else {
        log.add4Server001({route: jsonDir.toUpperCase()+'['+data.method.toUpperCase()+']', Method : 'Not allowed.'}, function (err) {
            if (err)
                console.log('\x1b[31m%s\x1b[0m', jsonDir.toUpperCase()+"-Invalid Method"+err);
        });
        callback(405);
    }
};

// Container for all the orders methods
handlers._orders = {};

// Users - post
// Required data: itemsList (Shopping Cart Items)
// Optional data: none
handlers._orders.post = function (data, callback) {
    console.log(data.payload.sourceType);
    var sourceType = typeof (data.payload.sourceType) == 'string' && data.payload.sourceType.trim().length > 0 ? data.payload.sourceType.trim() : false;
    console.log(sourceType);
    if(sourceType){
        // Check that all required fields are filled out
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        // Lookup the user phone by reading the token
        _handlers._tokens.getTokenById(token, function (err, tokenData){
            if (!err && tokenData) {
                // Lookup the user data
                _data.read('users', tokenData.phone, function (err, userData) {
                    if (!err && userData) {
                        console.log(userData);
                        _handlers._cart.getCartItems(userData.cart, function (err, cartItems) {
                            if (!err){
                                console.log({"err1": err, "data1" : cartItems.cart});
                                var orderId = helpers.createRandomString(20);
                                var subTotal = 0;
                                var shipping = 0;
                                var taxes = 0;
                                var data = {};//cartItems;
                                var items = [];
                                var paymentDetails = {
                                    // "amount": data['total'],
                                    "currency": "usd",
                                    "source": sourceType, //tok_visa, tok_mastercard
                                    "description": userData.fullName.trim() + " Pizza",
                                    "metadata[order_id]": orderId,
                                    // "metadata[item-1-name]": "Hawaiian Pizza",
                                    // "metadata[item-1-price]": "35.5",
                                    // "metadata[item-1-qty]": "8",
                                    //"metadata[tip]": "9"
                                    };
                                cartItems.cart.forEach(function(item) {
                                    items.push(item.name + ": " + item.price + " x " + item.qty);
                                    paymentDetails["metadata["+item.name+" = "+item.qty+"]"] = item.price;
                                    subTotal += item.price * item.qty
                                    console.log({ "item": item.price * item.qty, "subTotal": subTotal});
                                });
                                var total = subTotal + shipping + taxes;
                                // data['items'] = items; 
                                // data['total'] = total;
                                
                                paymentDetails.amount = total * 100;
                                // data['payment'] = paymentDetails;
                                
                                _handlers.payments.charge(orderId, paymentDetails, function(response){
                                    var err = (response["id"] !== undefined) ? false : response;
                                    if(err){
                                        console.log('\x1b[31m%s\x1b[0m', jsonDir.toUpperCase()+"-PAYMENT ERROR. "+err);
                                        log.add4Server001({route: jsonDir.toUpperCase()+'[POST]', error : err, orderIdFailure : orderId}, function (err) {
                                            if (err)
                                                console.log('\x1b[31m%s\x1b[0m', jsonDir.toUpperCase()+"-Invalid Method"+err);
                                        });
                                        data['error'] = 'Could not create the new Order. '+response.error.message;
                                        callback(500, data);
                                    } else {
                                        data['orderId'] = orderId;
                                        console.log({"ok->" : response.outcome.seller_message});
                                        data['transaction'] = response.outcome.seller_message;
                                        //--------------------
                                        var userOrder = typeof (userData.orders) == 'object' && userData.orders instanceof Array ? userData.orders : [];

                                        // Create the order object
                                        var orderObject = {
                                            'id': orderId,
                                            'userPhone': tokenData.phone,
                                            'items': userData.cart,
                                            'paymentId' : response.id
                                        };

                                        // Update the user
                                        _data.create(jsonDir, orderId, orderObject, function (err) {
                                            if (!err) {
                                                // Remove items from user's object (inside cart)
                                                userData.cart = [];
                                                // Add item id to the user's object (inside orders)
                                                userData.orders = userOrder;
                                                userData.orders.push(orderId);

                                                // Save the user data
                                                _data.update('users', tokenData.phone, userData, function (err) {
                                                    if (!err) {
                                                        _handlers.emails.pending.create(orderId, userData.email, userData.fullName, response.receipt_url, function (err) {
                                                            // Return the new Order data
                                                            //callback(200, orderObject);
                                                            if (!err) {
                                                                log.add4Server001({route: jsonDir.toUpperCase()+'[POST]', err : 'ERROR CREATING PENDING EMAIL FILE.' + err}, function (err) {
                                                                    if (err)
                                                                        console.log('\x1b[31m%s\x1b[0m', jsonDir.toUpperCase()+"[POST]-"+err);
                                                                });                                
                                                            }
                                                            callback(200, data);
                                                        });
                                                    } else {
                                                        callback(500, { 'Error': 'Could not update the user with the new order detail.' });
                                                    }
                                                });
                                            } else {
                                                console.log(err);
                                                callback(500, { 'Error': 'Could not create the new Order.' });
                                            }
                                        });

                                        //--------------------
                                    }
                                });
                            } else {
                                log.add4Server001({route: jsonDir.toUpperCase()+'[POST]', Cart : 'Shopping Cart Empty'}, function (err) {
                                    if (err)
                                        console.log('\x1b[31m%s\x1b[0m', jsonDir.toUpperCase()+"[POST]-"+err);
                                });
                                callback(400, { "Error": "Shopping Cart is empty."});    
                            }
                        });
                    } else {
                        log.add4Server001({route: jsonDir.toUpperCase()+'[POST]', InvalidToken : token}, function (err) {
                            if (err)
                                console.log('\x1b[31m%s\x1b[0m', jsonDir.toUpperCase()+"[POST]-Invalid Token"+err);
                        });
                        callback(403, { "Error": "Missing User Data."});
                    }
                });
            } else {
                log.add4Server001({route: jsonDir.toUpperCase()+'[POST]', InvalidToken : token}, function (err) {
                    if (err)
                        console.log('\x1b[31m%s\x1b[0m', jsonDir.toUpperCase()+"[POST]-Invalid Token"+err);
                });
                callback(403, "InvalidToken token.");
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field.' })
    }
};

// Export the orders-handlers
module.exports = handlers.orders;