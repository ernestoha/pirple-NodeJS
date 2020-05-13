/**
 * Primary file for API
 */

//Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');

//Declare de app
var app = {};

//Declare the app
app.init = function(){
  // Start the server
  server.init();
  
  // Start the workers
  workers.init();

  // Start the CLI, but make sure it starts last
  setTimeout(function(){
    cli.init();
  },50);
  
};

// Execute
app.init();

// Export the app
module.export = app;