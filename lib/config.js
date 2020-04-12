/**
 * Create and export configuration variables
 */

// Container for all environments
var environments = {};

// Dev (default) environment
environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'dev',
  'tokenTimeOut': 3600000, //3600000 Millisecond = 1 hour
  'hashingSecret' : 'thisIsASecret'
};

// Production environment
environments.production = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName' : 'prod',
  'tokenTimeOut': 300000, //5 min
  'hashingSecret' : 'thisIsAlsoASecret'
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;