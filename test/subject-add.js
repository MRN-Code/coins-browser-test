'use strict';
var _ = require('lodash');
var config = require('config');
var should = require('should');

var client = require('./lib/client.js').client;
var nav = require('./lib/nav/navigation.js')(client, config);
var subject = require('./lib/subject.js')(client, config);

var micis = require('./lib/auth/micis.js')(client);

describe('subject', function() {
    this.timeout(config.defaultTimeout);

    before('initialize', function(done) {
        client.clientReady.then(function boot() {
            if (!micis.loggedOn) {
                micis.logon();
            }
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
            client.call(done);
        });

        it('should generate an URSI prefix', function(done) {
            client.getText('#ursi_prefix_preview_prefix', function (err, text) {
                text.trim().should.equal('M871');
                done();
            });
        });

        it('should not have a hidden subject type ("Special") as a subject type', function(done) {
            client.selectByVisibleText('#subject_type_id', 'Special', function(err, rs) {
                if (!err) {
                    (false).should.be.ok();
                }
                done();
            });
            // test good and bogus values pre submit
            // submit
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
        it('should be submittable', function(done) {
            subject.new.handleSubjectMatchesAddNew(done);
        });
    });

});

describe('subject lookup', function() {
    this.timeout(config.defaultTimeout);

    before('initialize', function(done) {
        client.clientReady
            .then(function boot() {
                if (!micis.loggedOn) { micis.logon(); }
                if (_.isEmpty(subject.new.newUrsis)) {
                    throw new Error('ursis must have been added to lookup existing subject');
                }
                return client.call(done);
            });
    });

    it('should be accessible', function(done) {
        nav.micisMenu
            .clickNested('Look Up a Subject')
            .call(done);
    });

    it('should be able to lookup ursi just added', function(done) {
        var ursi = Object.keys(subject.new.newUrsis)[0];
        subject.lookup.existing(ursi, done);
    });
});
