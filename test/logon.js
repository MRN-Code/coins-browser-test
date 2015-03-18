'use strict';
var config = require('config');
var should = require('should');

var client = require('./lib/client.js').client;

var auth = require('./lib/auth/micis.js')(client, config);

describe('micis logon', function() {
    this.timeout(config.defaultTimeout);

    before('initialize', function(done) {
        // wait for client to be ready before testing
        client.clientReady.then(done);
    });

    it('should logon', function(done) {
        auth.logon(done);
    });

    it('should set auth cookies', function(done) {
        done();
    });
});

