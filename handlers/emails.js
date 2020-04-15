/**
 * Emails Controller & Model, API request
 * @TODO GET list of emails send to
 */

// Dependencies
var https = require('https');
var qs = require('querystring');
var config = require('./../lib/config');
var _data = require('./../lib/data');
var helpers = require('./../lib/helpers');
var jsonDir = 'emails';

// Container for module (to be exported)
var email = {};

/**
 * API request
 * // handlers.emails.send('ernestoharias@gmail.com','Test','Email', function(err){console.log({"err->" : err});});
 */
email.send = function (toEmail, subject, text, callback) {
    // Validate parameters
    orderId = typeof (orderId) == 'string' && orderId.trim().length > 0 ? orderId.trim() : false;
    toEmail = typeof (toEmail) == 'string' && toEmail.trim().length > 0 && toEmail.trim().length <= 256 ? toEmail.trim() : false;
    subject = typeof (subject) == 'string' && subject.trim().length > 0 ? subject.trim() : false;
    text = typeof (text) == 'string' && text.trim().length > 0 ? text.trim() : false;
    if (toEmail && subject && text) {

        var postData = qs.stringify({
            'from': config.email.mailgun.fromEmail,
            'to': toEmail,
            'subject': subject,
            'text': text
          });

        var options = {
            'protocol': 'https:',
            'hostname': 'api.mailgun.net',
            'method': 'POST',
            'path': '/v3/' + config.email.mailgun.domain + '/messages',
            'auth': 'api:'+ config.email.mailgun.apiKey,
            'headers': {                
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        var req = https.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                var value = helpers.parseJsonToObject(body.toString());
                console.log({ 'body_toString': (value) ? value : body });
                var status = res.statusCode;
                console.log({ 'email-status': status });
                value = ((value) ? value : {"id" : -1, "message":body});
                var emailObjRet = { ... value }; //clone object to return on callback

                // Callback successfully if the request went through
                if (!(status == 200 || status == 201)) {
                    value.id = 'Status code returned was ' + status;
                }

                // Store the API response after sent the email
                value.subject = subject;
                value.text = text;
                _data.create(jsonDir, toEmail+" "+Date.now(), value, function (err) {
                    if (!err) {
                        callback(emailObjRet);
                    } else {
                        emailObjRet.message += '. Could not create the email sent file.';
                        console.log({"email-send-error" : err});
                        callback(500, emailObjRet);
                    }
                });
            });

            res.on("error", function (error) {
                var value = helpers.parseJsonToObject(error.toString());
                console.error({ "email-error": (value) ? value : error });
                value.id = 'Status code returned was ' + status;
                callback(value);
            });
        });

        req.write(postData);

        req.end();

    } else {
        callback('Given parameters were missing or invalid.');
    }
};

// Export the module
module.exports = email;