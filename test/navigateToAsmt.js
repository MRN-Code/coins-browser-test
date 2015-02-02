'use strict';
// test deps
var Config = require('config');
var Should = require('should');

var Client = require('./lib/client.js');
var client = Client.client;

var Nav = require('./lib/navigation.js')(client, Config);
var Auth = require('./lib/auth/micis.js')(client, Config);

var timeoutDur = 25000;
var defaultStudyId = 2319; //NITEST

//include pre-requisite tests
require('./logon.js');

describe('navigate to asmt', function() {
    this.timeout(timeoutDur);

    before('initialize', function(done) {
        // wait for client to be ready before testing
        Client.clientReady.then(done);
    });

    after('close client', function(done) {
        client.end(done);
    });

    it('should load asmt', function(done) {
        Nav.gotoAsmt(done);
    });

    it('should change asmt study', function(done) {
        Nav.selectAsmtStudy(defaultStudyId, done);
    });
});
