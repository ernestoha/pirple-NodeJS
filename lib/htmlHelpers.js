/**
 * Helpers for Page Server
 */
 
// Dependencies
var helpers = require('./helpers');
var log = require('./logs');

// Container for all the helpers
var htmlHelpers = {};

htmlHelpers.check = function (data, callback) { //Allowed Methods
    console.log(data);
    var acceptableMethods = ['get'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        callback(false);
    } else {
        log.add4Server002({route: data.trimmedPath+'['+data.method.toUpperCase()+']', Method : 'Not allowed.'}, function (err) {
            if (err)
                console.log('\x1b[31m%s\x1b[0m', data.trimmedPath+"-Invalid Method"+err);
        });
        helpers.getTemplate('error/405', {}, function(err, str){
        if (!err && str){
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, {}, function(err,str){
                if(!err && str){
                    // Return that page as HTML
                    callback(405, str);
                    // callback(405, "Not Allowed", 'html');
                } else {
                    console.log(err);
                    callback(500, undefined);
                    log.add4Server002({route: data.trimmedPath+'['+data.method.toUpperCase()+']', Method : 'Not allowed and 500.'}, function (err) {
                        if (err)
                            console.log('\x1b[31m%s\x1b[0m', data.trimmedPath+"-Invalid Method"+err);
                    });
                }
            });
        } else {
            log.add4Server002({route: data.trimmedPath+'['+data.method.toUpperCase()+']', Method : 'Not allowed and 500...'}, function (err) {
                if (err)
                    console.log('\x1b[31m%s\x1b[0m', data.trimmedPath+"-Invalid Method"+err);
                callback(500, undefined);
            });
        }
    });
    }
};

htmlHelpers.loadTemplate = function(data, templateData, callback) {
    htmlHelpers.check(data, function(err, str){
        if(!err){
            // Prepare data for interpolation
            helpers.getTemplate(data.trimmedPath, templateData, function(err, str){
                if (!err && str){
                    // Add the universal header and footer
                    helpers.addUniversalTemplates(str, templateData, function(err,str){
                        if(!err && str){
                            // Return that page as HTML
                            callback(200,str,'html');
                        } else {
                            console.log(err);
                            callback(500, undefined, 'html');
                        }
                    });
                } else {
                    callback(500, undefined, 'html');
                }
            });
        } else {
            callback(err, str, 'html');
        }
      });
};

// Export the module
module.exports = htmlHelpers;