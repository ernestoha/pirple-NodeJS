/**
 * Users Controller & Model
 */

// Dependencies
var _data = require('./../lib/data');
var helpers = require('./../lib/helpers');

//Define nodhandlers
var handlers = {};

// Users
handlers.users = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
      handlers._users[data.method](data,callback);
    } else {
      callback(405);
    }
  };
  
  // Container for all the users methods
  handlers._users  = {};
  
  // Users - post
  // Required data: fullName, address, phone, password, tosAgreement
  // Optional data: none
  handlers._users.post = function(data,callback){
    // Check that all required fields are filled out
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var fullName = typeof(data.payload.fullName) == 'string' && data.payload.fullName.trim().length > 0 ? data.payload.fullName.trim() : false;
    var address = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    // var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
  
    console.log("ehh->",data.payload);
    if(phone && password && fullName && address){//&& tosAgreement
      // Make sure the user doesnt already exist
      _data.read('users',phone,function(err,data){
        if(err){
          // Hash the password
          var hashedPassword = helpers.hash(password);
  
          // Create the user object
          if(hashedPassword){
            var userObject = {
              'phone' : phone,
              'hashedPassword' : hashedPassword,
              'fullName' : fullName,
              'address' : address/*,
              'tosAgreement' : true*/
            };
  
            // Store the user
            _data.create('users',phone,userObject,function(err){
              if(!err){
                callback(200);
              } else {
                console.log(err);
                callback(500,{'Error' : 'Could not create the new user.'});
              }
            });
          } else {
            callback(500,{'Error' : 'Could not hash the user\'s password.'});
          }
  
        } else {
          // User alread exists
          callback(400,{'Error' : 'A user with that phone number already exists.'});
        }
      });
  
    } else {
      callback(400,{'Error' : 'Missing required fields.'});
    }
  
  };
  
  // Required data: phone
  // Optional data: none
  // @TODO Only let an authenticated user access their object. Dont let them access anyone elses.
  handlers._users.get = function(data,callback){
    // Check that phone number is valid
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
      // Lookup the user
      _data.read('users',phone,function(err,data){
        if(!err && data){
          // Remove the hashed password from the user user object before returning it to the requester
          delete data.hashedPassword;
          callback(200,data);
        } else {
          callback(404);
        }
      });
    } else {
      callback(400,{'Error' : 'Missing required field'})
    }
  };
  
  // Required data: phone
  // Optional data: fullName, address, password (at least one must be specified)
  // @TODO Only let an authenticated user up their object. Dont let them access update elses.
  handlers._users.put = function(data,callback){
    // Check for required field
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  
    // Check for optional fields
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var fullName = typeof(data.payload.fullName) == 'string' && data.payload.fullName.trim().length > 0 ? data.payload.fullName.trim() : false;
    var address = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
  
    // Error if phone is invalid
    if(phone){
      // Error if nothing is sent to update
      if(password || fullName || address) {
        // Lookup the user
        _data.read('users',phone,function(err,userData){
          if(!err && userData){
            // Update the fields if necessary
            if(password){
                userData.hashedPassword = helpers.hash(password);
              }
            if(fullName){
              userData.fullName = fullName;
            }
            if(address){
              userData.address = address;
            }
            // Store the new updates
            _data.update('users',phone,userData,function(err){
              if(!err){
                callback(200);
              } else {
                console.log(err);
                callback(500,{'Error' : 'Could not update the user.'});
              }
            });
          } else {
            callback(400,{'Error' : 'Specified user does not exist.'});
          }
        });
      } else {
        callback(400,{'Error' : 'Missing fields to update.'});
      }
    } else {
      callback(400,{'Error' : 'Missing required field.'});
    }
  
  };
  
  // Required data: phone
  // @TODO Only let an authenticated user delete their object. Dont let them delete update elses.
  // @TODO Cleanup (delete) any other data files associated with the user
  handlers._users.delete = function(data,callback){
    // Check that phone number is valid
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
      // Lookup the user
      _data.read('users',phone,function(err,data){
        if(!err && data){
          _data.delete('users',phone,function(err){
            if(!err){
              callback(200);
            } else {
              callback(500,{'Error' : 'Could not delete the specified user.'});
            }
          });
        } else {
          callback(400,{'Error' : 'Could not find the specified user.'});
        }
      });
    } else {
      callback(400,{'Error' : 'Missing required field.'})
    }
  };


  // Export the users-handlers
module.exports = handlers.users;