/**
 * HTML View for User Session
 */

// Dependencies
var htmlHelpers = require('./../../lib/htmlHelpers');

//Define handlers
var handlers = {};
handlers.html = {};
handlers._html = {}; 
handlers.templateData = {};

// User Session.
handlers._html.render = function (data, bodyClass, title, description, callback) {
    handlers.templateData['body.class'] = title;
    handlers.templateData['head.title'] = title;
    handlers.templateData['head.description'] = description;
    htmlHelpers.loadTemplate(data, handlers.templateData, callback);
};

handlers.html.create = function (data, callback) {
    handlers._html.render(data, 'sessionCreate', 'Log In', 'Please enter your phone number and password to access your account.', callback);
};

handlers.html.deleted = function (data, callback) {
    handlers._html.render(data, 'sessionDelete', 'Log Out', 'You have been logged out of your account.', callback);
}

// Export the account-handlers
module.exports = handlers.html;
