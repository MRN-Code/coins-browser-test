'use strict';
var config = require('config');
var should = require('should');

var client = require('./lib/client.js').client;
var nav = require('./lib/nav/navigation.js')(client, config);
var subject = require('./lib/subject.js')(client, config);

var micis = require('./lib/auth/micis.js')(client);

describe('subject enroll', function() {
    this.timeout(config.defaultTimeout);

    before('initialize', function(done) {
        client.clientReady.then(function boot() {
            if (!micis.loggedOn) { micis.logon(); }
            client.call(done);
        });
    });

    describe('enrol existing subject', function() {
        it('should be accessible', function(done) {
            nav.micisMenu
                .clickNested('Enroll an Existing Subject')
                .call(done);
        });

       it('should find an existing URSI (NITEST URSI M06158639 >> BIOMARKERS)', function(done) {
            subject.enroll.prepExisting('M06158639');
            subject.enroll.submitExisting(done);
        });
    });

});
