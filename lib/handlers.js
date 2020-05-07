/**
 * Handler
 */

// Dependencies
var helpers = require('./helpers');
//API- Begin
var users = require('./../handlers/api/users.js');
var {tokens} = require('./../handlers/api/tokens.js');
var menu = require('./../handlers/api/menu.js');
var {cart} = require('./../handlers/api/cart.js');
var orders = require('../handlers/api/orders.js');
var emails = require('./../handlers/api/emails.js');
var payments = require('./../handlers/api/payments.js');
//API- End

//HTML- Begin
var html = {};
html.index = require('./../handlers/html/index.js');
html.account = require('./../handlers/html/account.js');
html.session = require('./../handlers/html/session.js');
html.menu = require('./../handlers/html/menu.js');
html.cart = require('./../handlers/html/cart.js');
//HTML- End

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

// HTML - Begin
handlers.html = html;
console.log({e1:handlers.html.cart});
// handlers.account = account;
// handlers.session = session;

// Favicon
handlers.favicon = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Read in the favicon's data
    helpers.getStaticAsset('favicon.ico',function(err,data){
      if(!err && data){
        // Callback the data
        callback(200,data,'favicon');
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

// Public assets
handlers.public = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Get the filename being requested
    var trimmedAssetName = data.trimmedPath.replace('public/','').trim();
    if(trimmedAssetName.length > 0){
      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName,function(err,data){
        if(!err && data){

          // Determine the content type (default to plain text)
          var contentType = 'plain';

          if(trimmedAssetName.indexOf('.css') > -1){
            contentType = 'css';
          }

          if(trimmedAssetName.indexOf('.png') > -1){
            contentType = 'png';
          }

          if(trimmedAssetName.indexOf('.jpg') > -1){
            contentType = 'jpg';
          }

          if(trimmedAssetName.indexOf('.ico') > -1){
            contentType = 'favicon';
          }

          // Callback the data
          callback(200,data,contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }

  } else {
    callback(405);
  }
};

// HTML - End
// Export the module
module.exports = handlers;