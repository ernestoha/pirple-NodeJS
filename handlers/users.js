/**
 * Users Controller & Model
 */

// Dependencies
var log = require('./../lib/logs');
var _data = require('./../lib/data');
var helpers = require('./../lib/helpers');
var _handlers = require('./tokens.js'); // Tokens Handler
var jsonDir = 'users';

// console.log("ee-test-ee",_handlers._tokens.verifyToken);
//Define handlers
var handlers = {};

// Users
handlers.users = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        log.add4Server001({route: jsonDir.toUpperCase()+'['+data.method.toUpperCase()+']', Method : 'Not allowed.'}, function (err) {
            if (err)
                console.log('\x1b[31m%s\x1b[0m', jsonDir.toUpperCase()+"-Invalid Method"+err);
        });
        callback(405);
    }
};

// Container for all the users methods
handlers._users = {};

// Users - post
// Required data: phone, password, fullName, address
// Optional data: none
handlers._users.post = function (data, callback) {
    // Check that all required fields are filled out
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var fullName = typeof (data.payload.fullName) == 'string' && data.payload.fullName.trim().length > 0 ? data.payload.fullName.trim() : false;
    var address = typeof (data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    var email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? (helpers.validateEmail(data.payload.email.trim()) ? data.payload.email.trim() : false) : false;
    // var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    // console.log("ehh->",data.payload);
    if (phone && password && fullName && address && email) {//&& tosAgreement
        // Make sure the user doesnt already exist
        _data.read(jsonDir, phone, function (err, data) {
            if (err) {
                // Hash the password
                var hashedPassword = helpers.hash(password);

                // Create the user object
                if (hashedPassword) {
                    var userObject = {
                        'phone': phone,
                        'fullName': fullName,
                        'address': address,
                        'email': email,
                        'hashedPassword': hashedPassword/*,
              'tosAgreement' : true*/
                    };

                    // Store the user
                    _data.create(jsonDir, phone, userObject, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { 'Error': 'Could not create the new user.' });
                        }
                    });
                } else {
                    callback(500, { 'Error': 'Could not hash the user\'s password.' });
                }

            } else {
                // User alread exists
                callback(400, { 'Error': 'A user with that phone number already exists.' });
            }
        });

    } else {
        // callback(400, { 'Error': 'Missing required fields.' });
        callback(400, { 'Error': ('Missing required fields. ' + ((!email) ? 'Insert a valid email. ' : '')).trim() });
    }

};

// Required data: phone
// Optional data: none
handlers._users.get = function (data, callback) {
    // Check that phone number is valid
    var phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // Get token from headers
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid for the phone number
        _handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the user
                _data.read(jsonDir, phone, function (err, data) {
                    console.log({ "users": "users", "err": err, "data": data });
                    if (!err && data) {
                        // Remove the hashed password from the user user object before returning it to the requester
                        delete data.hashedPassword;
                        callback(200, data);
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(403, { "Error": "Missing required token in header, or token or phone is invalid." })
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field.' })
    }
};

// Required data: phone
// Optional data: fullName, address, password, email (at least one must be specified)
handlers._users.put = function (data, callback) {
    // Check for required field
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    // Check for optional fields
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var fullName = typeof (data.payload.fullName) == 'string' && data.payload.fullName.trim().length > 0 ? data.payload.fullName.trim() : false;
    var address = typeof (data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    var email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? (helpers.validateEmail(data.payload.email.trim()) ? data.payload.email.trim() : false) : false;

    // Error if phone is invalid
    if (phone) {
        // Error if nothing is sent to update
        if (fullName || address || email || password) {

            // Get token from headers
            var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

            // Verify that the given token is valid for the phone number
            _handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
                if (tokenIsValid) {
                    // Lookup the user
                    _data.read(jsonDir, phone, function (err, userData) {
                        if (!err && userData) {
                            // Update the fields if necessary
                            if (password) {
                                userData.hashedPassword = helpers.hash(password);
                            }
                            if (fullName) {
                                userData.fullName = fullName;
                            }
                            if (address) {
                                userData.address = address;
                            }
                            if (email) {
                                userData.email = email;
                            }
                            // Store the new updates
                            // console.log("update", userData);
                            // callback(200, userData);
                            _data.update(jsonDir, phone, userData, function (err) {
                                if (!err) {
                                    callback(200);
                                } else {
                                    console.log(err);
                                    callback(500, { 'Error': 'Could not update the user.' });
                                }
                            });
                        } else {
                            callback(400, { 'Error': 'Specified user does not exist.' });
                        }
                    });
                } else {
                    callback(403, { "Error": "Missing required token in header, or token is invalid." });
                }
            });
        } else {
            callback(400, { 'Error': 'Missing fields to update.' });
        }
    } else {
        callback(400, { 'Error': 'Missing required field.' });
    }

};

// Required data: phone
// Cleanup old checks associated with the user
handlers._users.delete = function (data, callback) {
    // Check that phone number is valid
    var phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {

        // Get token from headers
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the phone number
        _handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the user
                _data.read(jsonDir, phone, function (err, userData) {
                    if (!err && data) {
                        // Delete the user's data
                        _data.delete(jsonDir, phone, function (err) {
                            if (!err) {
                                // Delete each of the itmes associated with the user inside the Shoping Cart
                                var userCart = typeof (userData.cart) == 'object' && userData.cart instanceof Array ? userData.cart : [];
                                var itemsToDelete = userCart.length;
                                if (itemsToDelete > 0) {
                                    var itemsDeleted = 0;
                                    var deletionErrors = false;
                                    // Loop through the items
                                    userCart.forEach(function (cartId) {
                                        // Delete the cart's items
                                        _data.delete('cart', cartId, function (err) {
                                            if (err) {
                                                deletionErrors = true;
                                            }
                                            itemsDeleted++;
                                            if (itemsDeleted == itemsToDelete) {
                                                if (!deletionErrors) {
                                                    callback(200);
                                                } else {
                                                    callback(500, { 'Error': "Errors encountered while attempting to delete all of the user's items. All items may not have been deleted from the cart successfully." })
                                                }
                                            }
                                        });
                                    });
                                } else {
                                    callback(200);
                                }
                            } else {
                                callback(500, { 'Error': 'Could not delete the specified user' });
                            }
                        });
                    } else {
                        callback(400, { 'Error': 'Could not find the specified user.' });
                    }
                });
            } else {
                callback(403, { "Error": "Missing required token in header, or token is invalid." });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field.' })
    }
};

// Export the users-handlers
module.exports = handlers.users;