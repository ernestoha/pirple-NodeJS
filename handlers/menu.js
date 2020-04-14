/**
 * Users Controller & Model
 */

// Dependencies
var _data = require('./../lib/data');
var _handlers = require('./tokens.js'); // Tokens Handler
var table = 'menu';

//Define handlers
var handlers = {};

// Menu
handlers.menu = function (data, callback) {
    var acceptableMethods = ['get'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._menu[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all the users methods
handlers._menu = {};

// Required data: none
// Optional data: id
handlers._menu.get = function (data, callback) {
    // Id
    // console.log('menu-get');
    // var id = typeof (data.queryStringObject.id) == 'number' ? data.queryStringObject.id : "all"; //@TODO instead "all" then false and read *.json to return json array...
    var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length > 0 ? data.queryStringObject.id.trim() : "all";//"all" //false

    // Check that phone number is valid
    var phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;

    // console.log({"id":id, "phone":phone});
    if (phone) {

        // Get token from headers
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid for the phone number
        _handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the menu
                _data.read(table, id, function (err, data) {
                    // console.log({"menu": "menu", "err":err, "data": data});
                    if (!err && data) {
                        callback(200, data);
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(403, { "Error": "Missing required token in header, or token is invalid." })
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field.' })
    }
};

// Export the menu-handlers
module.exports = handlers.menu;