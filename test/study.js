'use strict';
var _ = require('lodash');
var config = require('config');
var should = require('should');

var client = require('./lib/client.js').client;
var nav = require('./lib/nav/navigation.js')(client, config);
var study = require('./lib/study.js')(client, config);

var micis = require('./lib/auth/micis.js')(client);

var tempTagId = 'testTag_' + Date.now();

describe('study', function() {
    this.timeout(config.defaultTimeout);

    before('initialize', function(done) {
        client.clientReady.then(function boot() {
            if (!micis.loggedOn) {
                micis.logon();
            }
            client.call(done);
        });
    });

    describe('list studies form', function() {

        it('should be accessible', function(done) {
            study.goToView('NITEST').call(done);
        });

    });

    describe('view subjects pages', function () {

        it('should be able to view subjects', function(done) {
            study.goToView('NITEST');
            study.view.subjects();
            client.call(done);
        });

        it('should be able to view subject details', function(done) {
            study.view.subjectDetails('M06158639')
                .waitForPaginationComplete()
                .call(done);
        });

        it('should be able to add a global subject tag', function(done) {
            study.view.subjectDetails
                .addTag(tempTagId , 'Temporary Subject ID', 'global')
                .moveToObject('[value="testTag"]') // asserts that new tag made it
                .call(done);
        });

        it('should be able to edit a global subject tag', function(done) {
            var newTag = tempTagId + '-2';
            client
                .isVisible('[value="' + tempTagId + '"]', function(err, exists) {
                    // test if tag is in page or in table
                    if (exists) {
                        return;
                    }
                    return client
                        .click('//*[contains(text(), "' + tempTagId +'")]//..//form//input[@value="Edit"]')
                        .waitForPaginationComplete();
                })

                // use XPATH selector because of usage of hidden 'previous_value' nodes with
                // same characteristics :(
                .setValue('//*[contains(text(), "Subject Tag Value")]//..//input', newTag)

                .click('#editExtIdFrm [name="doChange"]') // TODO move these out of test file
                .waitForPaginationComplete()
                .isVisible('[value="' + newTag + '"]', function(err, exists) {
                    // test if the newTag is on page or in table
                    if (exists) {
                        return;
                    }
                    return client
                        .click('//*[contains(text(), "' + newTag +'")]//..//form//input[@value="Edit"]')
                        .waitForPaginationComplete();
                })
                .call(done);
        });

    });

});
