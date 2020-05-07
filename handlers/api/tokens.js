/**
 * Tokens Controller & Model
 */

// Dependencies
var log = require('./../../lib/logs');
var _data = require('./../../lib/data');
var helpers = require('./../../lib/helpers');
var config = require('./../../lib/config');
var jsonDir = 'tokens';

//Define handlers
var handlers = {};

// Tokens
handlers.tokens = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        log.add4Server001({route: jsonDir.toUpperCase()+'['+data.method.toUpperCase()+']', Method : 'Not allowed.'}, function (err) {
            if (err)
                console.log('\x1b[31m%s\x1b[0m', jsonDir.toUpperCase()+"-Invalid Method"+err);
        });
        callback(405);
    }
};

handlers._tokens = {}; // Container for all the tokens private methods
handlers.public = {}; // Container for all the tokens public methods

// Tokens - post
// Required data: phone, password
// Optional data: none
handlers._tokens.post = function (data, callback) {
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if (phone && password) {
        // Lookup the user who matches that phone number
        _data.read('users', phone, function (err, userData) {
            if (!err && userData) {
                // Hash the sent password, and compare it to the password stored in the user object
                var hashedPassword = helpers.hash(password);
                if (hashedPassword == userData.hashedPassword) {
                    // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
                    var tokenId = helpers.createRandomString(20);
                    var expires = Date.now() + config.tokenTimeOut // 1000 * 60 * 60 = 1hour;
                    var tokenObject = {
                        'phone': phone,
                        'id': tokenId,
                        'expires': expires
                    };

                    // Store the token
                    _data.create(jsonDir, tokenId, tokenObject, function (err) {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, { 'Error': 'Could not create the new token.' });
                        }
                    });
                } else {
                    callback(400, { 'Error': 'Password did not match the specified user\'s stored password.' });
                }
            } else {
                callback(400, { 'Error': 'Could not find the specified user.' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field(s).' })
    }
};

// Tokens - get
// Required data: id
// Optional data: none
handlers._tokens.get = function (data, callback) {
    // Check that id is valid
    var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the token
        _data.read(jsonDir, id, function (err, tokenData) {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field, or field invalid.' })
    }
};

// Tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = function (data, callback) {
    var id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    var extend = typeof (data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
    if (id && extend) {
        // Lookup the existing token
        _data.read(jsonDir, id, function (err, tokenData) {
            if (!err && tokenData) {
                // Check to make sure the token isn't already expired
                if (tokenData.expires > Date.now()) {
                    // Set the expiration an hour from now
                    tokenData.expires = Date.now() + config.tokenTimeOut // 1000 * 60 * 60 = 1hour;
                    // Store the new updates
                    _data.update(jsonDir, id, tokenData, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, { 'Error': 'Could not update the token\'s expiration.' });
                        }
                    });
                } else {
                    callback(400, { "Error": "The token has already expired, and cannot be extended." });
                }
            } else {
                callback(400, { 'Error': 'Specified user does not exist.' });
            }
        });
    } else {
        callback(400, { "Error": "Missing required field(s) or field(s) are invalid." });
    }
};

// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = function (data, callback) {
    // Check that id is valid
    var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the token
        _data.read(jsonDir, id, function (err, tokenData) {
            if (!err && tokenData) {
                // Delete the token
                _data.delete(jsonDir, id, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, { 'Error': 'Could not delete the specified token.' });
                    }
                });
            } else {
                callback(400, { 'Error': 'Could not find the specified token.' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field.' })
    }
};


// Verify if a given token id is currently valid for a given user
handlers.public.verifyToken = function (id, phone, callback) {
    // Lookup the token
    // console.log('Verifying 001');
    _data.read(jsonDir, id, function (err, tokenData) {
        // console.log('Verifying 002', tokenData, 'phone', phone);
        if (!err && tokenData) {
            // console.log('Verifying 003', tokenData.phone == phone);
            // Check that the token is for the given user and has not expired
            if (tokenData.phone == phone && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

handlers.public.getTokenById = function (id, callback) {
    _data.read(jsonDir, id, function (err, tokenData) {
        callback(err, tokenData);
    });
};

// Export the tokens-handlers
module.exports.tokens = handlers.tokens;
module.exports._tokens = handlers.public;