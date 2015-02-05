'use strict';
var Config = require('config');
var Should = require('should');

var Client = require('./lib/client.js');
var client = Client.client;

var Auth = require('./lib/auth/micis.js')(client, Config);

var timeoutDur = 25000;


describe('micis logon', function() {
    this.timeout(timeoutDur);

    before('initialize', function(done) {
        // wait for client to be ready before testing
        Client.clientReady.then(done);
    });

    it('should logon', function(done) {
        Auth.logon(done);
    });

    it('should set auth cookies');
});

