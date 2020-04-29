/**
 * Handler
 */

// Dependencies
var users = require('./../handlers/users.js');
var {tokens} = require('./../handlers/tokens.js');
var menu = require('./../handlers/menu.js');
var {cart} = require('./../handlers/cart.js');
var orders = require('./../handlers/orders.js');
var emails = require('./../handlers/emails.js');
var payments = require('./../handlers/payments.js');

//Define all the handlers
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

// Users Handler
handlers.users = users;

// Tokens Handler
handlers.tokens = tokens;

// Menu Handler
handlers.menu = menu;

// Shopping Cart Handler
handlers.cart = cart;

// Orders Handler
handlers.orders = orders;

// Email Handler
handlers.emails = emails;

// Payments Handler
handlers.payments = payments;

// Export the module
module.exports = handlers;