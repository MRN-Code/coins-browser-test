'use strict';
// test deps
var config = require('config');
var should = require('should');

var client = require('./lib/client.js').client;

var nav = require('./lib/navigation.js')(client, config);
var Auth = require('./lib/auth/micis.js')(client, config);

var timeoutDur = 25000;
var defaultStudyId = 2319; //NITEST

//include pre-requisite tests
require('./logon.js');

describe('navigate to asmt', function() {
    this.timeout(timeoutDur);

    before('initialize', function(done) {
        // wait for client to be ready before testing
        client.clientReady.then(done);
    });

    after('close client', function(done) {
        client.end(done);
    });

    it('should load asmt', function(done) {
        nav.gotoAsmt(done);
    });

    it('should change asmt study', function(done) {
        nav.selectAsmtStudy(defaultStudyId, done);
    });
});
