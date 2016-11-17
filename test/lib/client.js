"use strict";
// webdriver deps
var WebdriverIO = require('webdriverio');
var paginationUtils;
var config = require('config');
var options = {
    desiredCapabilities: {
        browserName: config.get('browserName')
    },
    host: config.get('host'),
    port: config.get('port')
};
var client = WebdriverIO.remote(options);
paginationUtils = require('./../../util/pagination.js')(client);

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
module.exports.client.clientReady = clientReady;
module.exports.clientReady = clientReady;


