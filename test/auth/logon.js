"use strict";
// test deps
var config = require('config');
var should = require('should');

// webdriver deps
var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

// exports
var me = {};
module.exports = me;

// test
var timeoutDur = 15000;
describe('micis logon', function() {
    var block = this;
    this.timeout(timeoutDur);
    var client = {};

    before(function(done){
        client = webdriverio.remote(options);
        client.init(done);
    });

    it('should logon', function(done) {
        me
            .logon(client)
            .end(done);
    });

    it('should set auth cookies');
});

me.logon = function(client) {
    return client
        .url('https://' + config.origin + '/micis/index.php')
        .setValue('#loginPopupUsername', config.auth.un)
        .setValue('#loginPopupPassword', config.auth.pw)
        .click('#submitBtn')
        .waitFor('#page-container', timeoutDur);
};
