/**
 * Shopping Cart Controller & Model
 */

// Dependencies
var log = require('./../../lib/logs');
var _data = require('./../../lib/data');
var helpers = require('./../../lib/helpers');
var _handlers = require('./tokens.js'); // Tokens Handler
var jsonDir = 'cart';

//Define handlers
var handlers = {};

// Shopping Cart
handlers.cart = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._cart[data.method](data, callback);
    } else {
        log.add4Server001({route: jsonDir.toUpperCase()+'['+data.method.toUpperCase()+']', Method : 'Not allowed.'}, function (err) {
            if (err)
                console.log('\x1b[31m%s\x1b[0m', jsonDir.toUpperCase()+"-Invalid Method"+err);
        });
        callback(405);
    }
};

handlers._cart = {}; // Container for all the shopping cart private [post, get, put, delete] methods
handlers.public = {}; // Container for all the cart public methods

/**  
 * Shopping Cart - post
 * Required data: menuId, qty
 * Optional data: none
 */
handlers._cart.post = function (data, callback) {
    console.log(data);
    // Check that all required fields are filled out
    // var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var menuId = typeof (data.payload.menuId) == 'number' ? data.payload.menuId : false;
    var qty = typeof (data.payload.qty) == 'number' ? data.payload.qty : false;

    // console.log(data.payload);
    console.log({ "menuId": menuId, "qty": qty });

    if (menuId && qty) {

        // Get token from headers
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Lookup the user phone by reading the token
        _handlers._tokens.getTokenById(token, function (err, tokenData){
            if (!err && tokenData) {
                console.log({ "tokenData.phone": tokenData.phone });
                // console.log("ehh->",data.payload);
                // Lookup the user data
                _data.read('users', tokenData.phone, function (err, userData) {
                    if (!err && userData) {
                        // Lookup the menu data
                        _data.read('menu', menuId, function (err, menuData) {
                            if (!err && menuData) {

                                var userCart = typeof (userData.cart) == 'object' && userData.cart instanceof Array ? userData.cart : [];
                                var cartId = helpers.createRandomString(20);

                                // Create the cart object
                                var cartObject = {
                                    'id': cartId,
                                    'userPhone': tokenData.phone,
                                    'menuId': menuId,
                                    'name': menuData.name,
                                    'price': menuData.price,
                                    'qty': qty
                                };

                                // Store the user
                                _data.create(jsonDir, cartId, cartObject, function (err) {
                                    if (!err) {
                                        // Add item id to the user's object (inside cart)
                                        userData.cart = userCart;
                                        userData.cart.push(cartId);

                                        // Save the new user data
                                        _data.update('users', tokenData.phone, userData, function (err) {
                                            if (!err) {
                                                // Return the data about the new item
                                                callback(200, cartObject);
                                            } else {
                                                callback(500, { 'Error': 'Could not update the user with the new cart item.' });
                                            }
                                        });
                                    } else {
                                        console.log(err);
                                        callback(500, { 'Error': 'Could not create the new Shopping Cart item.' });
                                    }
                                });
                            } else {
                                callback(403);
                            }
                        });
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(403);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required fields.' });
    }
};

/** 
 * Shopping Cart - get
 * Required data: id
 * Optional data: none
 */
handlers._cart.get = function (data, callback) {
    // Check that id is valid
    var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the cart's items
        _data.read(jsonDir, id, function (err, cartData) {
            if (!err && cartData) {
                // Get the token that sent the request
                var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
                // Verify that the given token is valid and belongs to the user who created the cart's item
                // console.log("This is cart data.", cartData);
                _handlers._tokens.verifyToken(token, cartData.userPhone, function (tokenIsValid) {
                    if (tokenIsValid) {
                        // Return Cart Data
                        callback(200, cartData);
                    } else {
                        log.add4Server001({route: jsonDir.toUpperCase()+'[GET]', InvalidToken : token}, function (err) {
                            if (err)
                                console.log('\x1b[31m%s\x1b[0m', jsonDir.toUpperCase()+"[GET]-Invalid Token"+err);
                        });
                        callback(403, "InvalidToken token.");
                    }
                });
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field, or field invalid' })
    }
};

/**
 * Shopping Cart - put
 * Required data: id
 * Optional data: menuId, qty (at least one must be specified)
 */
handlers._cart.put = function (data, callback) {
    // Check for required field
    var id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

    // Check for optional fields
    var menuId = typeof (data.payload.menuId) == 'number' ? data.payload.menuId : false;
    var qty = typeof (data.payload.qty) == 'number' ? data.payload.qty : false;

    // Error if id is invalid
    if (id) {
        // Error if nothing is sent to update
        if (menuId || qty) {
            // Lookup the cart's items
            _data.read(jsonDir, id, function (err, cartData) {
                if (!err && cartData) {
                    // Get token from headers
                    var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

                    // Verify that the given token is valid and belongs to the user who created the item
                    _handlers._tokens.verifyToken(token, cartData.userPhone, function (tokenIsValid) {
                        if (tokenIsValid) {
                            // Lookup the Menu Data
                            _data.read('menu', menuId, function (err, menuData) {
                                if (!err && menuData) {
                                    // Update the fields if necessary
                                    if (menuId) {
                                        cartData.menuId = menuId;
                                        cartData.name = menuData.name;
                                        cartData.price = menuData.price;
                                    }
                                    if (qty) {
                                        cartData.qty = qty;
                                    }

                                    // Store the new updates
                                    // console.log("update", cartData);
                                    // callback(200, cartData);
                                    _data.update(jsonDir, id, cartData, function (err) {
                                        if (!err) {
                                            callback(200);
                                        } else {
                                            console.log(err);
                                            callback(500, { "Error": "Could not update the cart's item." });
                                        }
                                    });
                                } else {
                                    callback(400, { 'Error': 'Specified item does not exist.' });
                                }
                            });
                        } else {
                            callback(403, { "Error": "Missing required token in header, or token is invalid." });
                        }
                    });
                } else {
                    callback(400, { 'Error': 'Cart Id did not exist.' });
                }
            });
        } else {
            callback(400, { 'Error': 'Missing fields to update.' });
        }
    } else {
        callback(400, { 'Error': 'Missing required field.' });
    }

};

/**
 * Shopping Cart - delete
 * Required data: id
 * Optional data: none
 */
handlers._cart.delete = function (data, callback) {
    console.log('eee');
    // Check that id is valid
    var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    console.log({'deleteId':id});
    if (id) {
        // Lookup the cart
        _data.read(jsonDir, id, function (err, cartData) {
            if (!err && cartData) {
                // Get token from headers
                var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

                // Verify that the given token is valid and belongs to the user who add item to car
                _handlers._tokens.verifyToken(token, cartData.userPhone, function (tokenIsValid) {
                    if (tokenIsValid) {

                        // Delete the item data
                        _data.delete(jsonDir, id, function (err) {
                            if (!err) {
                                // Lookup the user's object to get all their cart's items
                                _data.read('users', cartData.userPhone, function (err, userData) {
                                    if (!err) {
                                        var userCart = typeof (userData.cart) == 'object' && userData.cart instanceof Array ? userData.cart : [];

                                        // Remove the deleted item from their list
                                        var itemPosition = userCart.indexOf(id);
                                        if (itemPosition > -1) {
                                            userCart.splice(itemPosition, 1);
                                            // Re-save the user's data
                                            userData.cart = userCart;
                                            _data.update('users', cartData.userPhone, userData, function (err) {
                                                if (!err) {
                                                    callback(200);
                                                } else {
                                                    callback(500, { 'Error': 'Could not update the user.' });
                                                }
                                            });
                                        } else {
                                            callback(500, { "Error": "Could not find the cart's items on the user's object, so could not remove it." });
                                        }
                                    } else {
                                        callback(500, { "Error": "Could not find the user who added the item to car, so could not remove the item from the cart on their user object." });
                                    }
                                });
                            } else {
                                callback(500, { "Error": "Could not delete the cart item." })
                            }
                        });
                    } else {
                        callback(403, { "Error": "Could not delete the cart item, because is not in your cart." });
                    }
                });
            } else {
                callback(400, { "Error": "The Item (by Cart ID) specified could not be found." });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field.' })
    }
};

handlers.public.getCartItems = function (items, callback) {
    if (items.length > 0){
        _data.readAll(jsonDir, function (err, data) { //Unordered List
            callback(err, data);
        }, items);
    } else {
        callback("Shopping Cart Empty", false);
    }
};

// Export the cart-handlers
module.exports.cart = handlers.cart;
module.exports._cart = handlers.public;