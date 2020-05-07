/**
 * Create and export configuration variables
 */

// Container for all environments
var environments = {};

// Dev (default) environment
environments.staging = {
 "httpPort" : 3000,
 "httpsPort" : 3001,
 "envName" : "dev",
 "tokenTimeOut": 3600000, //3600000 Millisecond = 1 hour
  "hashingSecret" : "thisIsASecret",
 "email" : {
   "mailgun" : { //https://documentation.mailgun.com/en/latest/quickstart-sending.html#send-via-api
    "domain" : "YOUR_DOMAIN",
    "apiKey": "API_KEY",
    "fromEmail": "FROM EMAIL <FROM_EMAIL@YOUR_DOMAIN>",
   }
 },
 "payments" : {
   "stripe" : {
     /**
      * Steps : https://stripe.com/docs/issuing/testing
      * Cards : https://stripe.com/docs/testing
      */
     "secretKey" : "YOUR_SECRET_KEY"
   }
 },
  'templateGlobals' : {
    'appName' : '[DEV] Pizza Delivery',
    'companyName' : 'company@yours.com',
    'yearCreated' : '2020',
    'baseUrl' : 'http://localhost:3000/'
  }
};
 
// Production environment
environments.production = {
 "httpPort" : 5000,
 "httpsPort" : 5001,
 "envName" : "prod",
 "tokenTimeOut": 300000, //5 min
  "hashingSecret" : "thisIsAlsoASecret",
 "email" : {
   "mailgun" : {
     "domain" : "YOUR_DOMAIN",
     "apiKey": "API_KEY",
     "fromEmail": "FROM EMAIL <FROM_EMAIL@YOUR_DOMAIN>",
   }
 },
 "payments" : {
   "stripe" : {
     "secretKey" : "YOUR_SECRET_KEY"
   }
 },
  'templateGlobals' : {
    'appName' : 'Pizza Delivery',
    'companyName' : 'company@yours.com',
    'yearCreated' : '2020'
  }
};
 
// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase() : "";
 
// Check that the current environment is one of the environments above, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == "object" ? environments[currentEnvironment] : environments.staging;
 
// Export the module
module.exports = environmentToExport;