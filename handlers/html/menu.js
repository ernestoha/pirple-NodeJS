/**
 * HTML View for User Menu Available
 */

// Dependencies
var htmlHelpers = require('./../../lib/htmlHelpers');

//Define handlers
var handlers = {};
handlers.html = {};
handlers._html = {}; 
handlers.templateData = {
    'head.title' : 'Dashboard',
    'body.class' : 'menuList'
};

// Menu.
handlers._html.render = function (data, description, callback) {
    handlers.templateData['head.title'] += ' ' + description;
    handlers.templateData['head.description'] = description;
    htmlHelpers.loadTemplate(data, handlers.templateData, callback);
};

handlers.html.list = function (data, callback) {
    handlers._html.render(data, 'List', callback);
};

handlers.html.getOne = function (data, callback) { /** todo */
    handlers._html.render(data, 'Todo', callback);
};

// Export the account-handlers
module.exports = handlers.html;
