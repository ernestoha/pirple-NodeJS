/**
 * Primary file for API
 */

//Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');

//Declare de app
var app = {};

//Declare the app
app.init = function(){
  // Start the server
  server.init();
  
  // Start the workers
  workers.init();
};

// Execute
app.init();

// Export the app
module.export = app;