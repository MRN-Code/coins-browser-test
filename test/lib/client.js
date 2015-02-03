"use strict";
// webdriver deps
var Webdriverio = require('webdriverio');
var Promise = require('rsvp').Promise;
var PaginationUtils = require('./../../util/pagination.js');
var Config = require('config');
var options = {
    desiredCapabilities: {
        browserName: Config.get('browserName')
    }
};

var client = Webdriverio.remote(options);
PaginationUtils(client);
var clientReady = new Promise(function (resolve, reject) {
    client.init(function(err) {
        if(!err) {
            resolve();
        } else {
            reject(err);
        }
    });
}).catch(function(err) {
    console.error(err);
    throw err;
});

module.exports.client = client;
module.exports.clientReady = clientReady;


