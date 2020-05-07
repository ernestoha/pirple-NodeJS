/**
 * HTML View for User Account
 */

// Dependencies
var htmlHelpers = require('./../../lib/htmlHelpers');

//Define handlers
var handlers = {};
handlers.html = {};
handlers._html = {}; 
handlers.templateData = {
    'head.title' : 'Account',
};

// User account.
handlers._html.render = function (data, className, description, callback) {
    handlers.templateData['body.class'] = className;
    handlers.templateData['head.title'] += ' ' + description;
    handlers.templateData['head.description'] = description;
    htmlHelpers.loadTemplate(data, handlers.templateData, callback);
};

handlers.html.create = function (data, callback) {
    handlers._html.render(data, 'account', 'Create New User', callback);
};

handlers.html.edit = function (data, callback) {
    handlers._html.render(data, 'accountEdit', 'Edit User', callback);
};

handlers.html.deleted = function (data, callback) {
    handlers._html.render(data, 'accountDeleted', 'Delete User', callback);
}

// Export the account-handlers
module.exports = handlers.html;
