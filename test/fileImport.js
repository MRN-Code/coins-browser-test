'use strict';
const _ = require('lodash');
const config = require('config');
const should = require('should');
const path = require('path');

const client = require('./lib/client.js').client;
const nav = require('./lib/nav/navigation.js')(client, config);
const micis = require('./lib/auth/micis.js')(client);

describe('Perform various imports and verify that they function correctly', function() {
    this.timeout(config.defaultTimeout);

    before('initialize', function(done) {
        client.clientReady.then(function boot() {
            if (!micis.loggedOn) {
                micis.logon();
            }
            client.call(done);
        });
    });

    describe('Import subjects', function(done) {
        it ('Should navigate to Subjects > Import Participants from CSV', function(done) {
            nav.micisMenu.clickNested('Import Participants from CSV', done);
        });
        
    });

    describe('Import assessments', function(done) {

    });

    describe('Import instruments', function(done) {
        it ('Should go to asmt and select NITEST (study_id 2319)', function(done) {
            nav.gotoAsmt();
            nav.selectAsmtStudy(2319, done);
        });

        it ('Should navigate to Admin > Import Instruments', function(done) {
            nav.asmtMenu.clickNested('Import Instruments', done);
        });

        it ('Should fill in the inst prefix and upload file', function(done) {
            client.setValue('input#questPrefix', 'QWEQWEQWE')
                .chooseFile('input#file', path.join(
                    __dirname,
                    'upload_test_files/Adverse_Events_Log_formatted.csv')
                )
                .waitForPaginationComplete(done);

        });

        it ('Should see the upload is successful', function(done) {
            client.getText('div#page-container')
                .then(response => {
                    response.should.containEql('Instrument successfully added');
                })
                .call(done);
        });
    });
});
