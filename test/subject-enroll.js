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

    describe('add subject form', function() {
        it('should be accessible', function(done) {
            nav.micisMenu
                .clickNested('Enter a New Subject')
                .call(done);
        });

        it('should be fill-out-able', function(done) {
            // fill form
            subject.new.fillForm();

            // Change study id
            client.selectByValue('#study_id', 7640); // Smoking

            client.call(done);
        });
        
        it('should be submittable', function(done) {
            subject.new.submit(done);
        });
        
    });

    describe('verify subject form', function() {        
        it('should be submittable', function(done) {
            subject.new.verify(done);
        });        
    });

    describe('handle new subject matches form', function() {
        it('should be enroll with existing subject', function(done) {
            subject.new.handleSubjectMatchesExisting(done);
        });        
    });
    

});
