/*

// broken selector, seeking clarity from:
// https://github.com/webdriverio/webdriverio/issues/389
"use strict";
var config = require('config');
var should = require('should');
var webdriverio = require('webdriverio');

var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

describe('do something else after logon', function() {
    var block = this;
    this.timeoutDur = 15000;
    this.timeout(this.timeoutDur);
    var client = {};

    before(function(done){
            client = webdriverio.remote(options);
            client.init(done);
    });

    it('like click on sites', function(done) {
        require('./logon').logon(client)
            .click('=Sites')
            .end(done);
    });

});
*/