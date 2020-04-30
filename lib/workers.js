/**
 * workers related tasks
 */

// Dependencies
var log = require('./logs');
var handlers = require('./handlers');

//Instantiate workers
var workers = {};
workers.num = "001";
workers.nam = "Worker" + workers.num;
workers.dsc = "Send Email of Executed Order.";

//Lookup
workers.gatherAllOrders = function(){
    //Get all Orders
    handlers.emails.pending.getAll(function(err, emailsPending){
        // console.log(emailsPending);
        // return false;
        if (!err && emailsPending && emailsPending.length > 0){
            emailsPending.forEach(function(orderIdFile) {
                handlers.emails.pending.sendOrderCreatedAndMv(orderIdFile, function(err, msg){
                    if(err){
                        console.log('\x1b[31m%s\x1b[0m', "ERROR " + workers.nam.toUpperCase() + ".");
                        console.log('\x1b[31m%s\x1b[0m', err);
                        log.add4Worker001({worker: workers.num, sendEmailErr : err}, function (err) {
                            if (err)
                                console.log('\x1b[31m%s\x1b[0m', jsonDirPend.toUpperCase()+" ERROR WRITING LOG. "+err);
                        });
                    } else {
                        console.log('\x1b[32m%s\x1b[0m', workers.nam + " ->" + msg);
                    }
                });
            });
        }
    });
};

//Timer to execute the worker process [one per-minute = 1000 * 60, 5 seconds = 5000]
workers.loop = function(){
    setInterval(function(){
        workers.gatherAllOrders();
    }, 1000 * 30) //half minute = 1000*30, each 5 seconds = 5000 milliseconds
};

// Init Script
workers.init = function(){
    console.log('\x1b[32m%s\x1b[0m', workers.nam + " -> INIT.");

    //Send Emails [Execute all the orders Inmediatly].
    workers.gatherAllOrders();

    //Schedule to check if there is any email to send [order to Execute].
    workers.loop();
};

// Export Module
module.exports = workers;
