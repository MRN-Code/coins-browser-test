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
        it ('Should navigate to Subjects > Import Participants', function(done) {
            nav.micisMenu.clickNested('Import Participants', done);
        });
        
        it ('Should upload file', function(done) {
            client
                .selectByValue('select#study_id', 2319)
                .waitForValue('select#subject_type_id', 3000)
                // This click action is a hack to activate the 'input[name=userfile]' element
                // Otherwise the selenium will not be able to see the element
                .click('input#upload')
                .chooseFile('input[name=userfile]', path.join(
                    __dirname,
                    'upload_test_files/participant_import_formatted.csv'
                ))
                .waitForPaginationComplete(done);
        });

        it ('Should see the upload is successful', function(done) {
            client
                .getText('div.boxHeader > span')
                     .should.be.fulfilledWith('Participants Imported!')
                .call(done);
        });
    });

    describe('Import instruments and assessments', function(done) {
        it ('Should go to asmt and select NITEST (study_id 2319)', function(done) {
            nav.gotoAsmt();
            nav.selectAsmtStudy(2319, done);
        });

        // Import instruments
        it ('Should navigate to Admin > Import Instruments', function(done) {
            nav.asmtMenu.clickNested('Import Instruments', done);
        });

        it ('Should fill in the inst prefix and upload file', function(done) {
            client
                .setValue('input#questPrefix', 'QIWEQWEQWE')
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

        // Import assessments
        it ('Should navigate to Admin > Import Assessments', function(done) {
            nav.asmtMenu.clickNested('Import Assessments', done);
        });

        it ('Should upload assessments', function(done) {
            client.selectByValue('select#instrument_id', 24063)
                // interval value could be updated for multiple tests during dev.
                .selectByValue('select#visit_interval', 'v2')
                // This click action is a hack to activate the 'input[name=userfile]' element
                // Otherwise the selenium will not be able to see the element
                .click('input#upload')
                .chooseFile('input[name=userfile]', path.join(
                    __dirname,
                    'upload_test_files/NITEST_STOP-BANG_template.csv'
                ))
                .waitForPaginationComplete(done);
        });

        it ('Should see the upload is successful', function(done) {
            client.isExisting('table#new_asmts').should.be.fulfilledWith(true)
                .getText('div#new_asmts_info')
                    .should.be.fulfilledWith('Showing 1 to 2 of 2 entries')
                .call(done);
        });
    });
});
