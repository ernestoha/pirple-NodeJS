/**
  * Library for logs
  *
  */

// Dependencies
var _data = require('./data');

// Vars
var jsonDir = 'logs';
var logs = {public: {}};

logs.appendData = function (filename, data, callback) {
    // filename = _data.baseDir + jsonDir + '/' + logs.getTodayYYYYMMDD() + "_" + filename + ".log";
    filename = logs.getNowYYYYMMDD() + "_" + filename;
    // console.log(filename);
    if (typeof data === 'object')
        data = JSON.stringify(data);
    _data.append(jsonDir, filename, logs.getNowHHMMSS() + ": " + data, function(err){
        if (err)
            console.log('\x1b[41m%s\x1b[0m', err);
        callback(err);
    }, ".log");
};

logs.getNowYYYYMMDD = function (){ //return YYYYMMDD
    // return (new Date().toISOString().slice(0,10).replace(/-/g,""));
    var x = new Date();
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    var yyyymmdd = y + m + d;
    return yyyymmdd;
};

logs.getNowHHMMSS = function (){ //return HHMMSS
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // var ms = today.getMilliseconds();
    h = (h<10) ? '0' + h.toString() : h;
    m = (m<10) ? '0' + m.toString() : m;
    s = (s<10) ? '0' + s.toString() : s;
    //ms = (ms<1000) ? '0' + ms.toString() : ms;
    // return h + ":" + m + ":" + s;
    // return "".concat(h, m, s, ms);
    return "".concat(h, m, s);
}

logs.add4Server = function (num, data, callback) {
    logs.appendData("server" + num, data, function(err){
        if (err){
            console.log('\x1b[41m%s\x1b[0m', "WRITING SERVER"+ num+" LOG ERROR!!!");
            console.log('\x1b[41m%s\x1b[0m', err);
        }
        callback(err);
    });
};

logs.add4Worker = function (num, data, callback) {
    logs.appendData("worker" + num, data, function(err){
        if (err){
            console.log('\x1b[41m%s\x1b[0m', "WRITING WORKER"+ num+" LOG ERROR!!!");
            console.log('\x1b[41m%s\x1b[0m', err);
        }
        callback(err);
    });
};

logs.public.add4Server001 = function (data, callback) {
//logs.public.add4Server001 = function (data) {
    logs.add4Server("001", data, function(err){
        callback(err);
    });
};

logs.public.add4Server002 = function (data, callback) {
    //logs.public.add4Server002 = function (data) {
        logs.add4Server("002", data, function(err){
            callback(err);
        });
    };

logs.public.add4Worker001 = function (data, callback) {
    //logs.public.add4Server001 = function (data) {
    logs.add4Worker("001", data, function(err){
        callback(err);
    });
};

// Export the module
module.exports = logs.public;
