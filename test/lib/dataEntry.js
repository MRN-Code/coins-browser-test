"use strict";
var should = require('should');
var _ = require('lodash');

// exports
module.exports = function(client, config) {
    var me = {};

    //var me = {
    //   assessmentId: undefined
    //};

    me.selectInstrument = function(instrumentId, done) {
        return client
            .selectByValue('#instrument_id', instrumentId) // calculation test
            .waitForPaginationComplete(done);
    };

    me.fillCoverSheetPart1 = function(details, done) {
        return client
            .setValue('input[name=ursi]', details.ursi)
            .selectByValue('#segment_interval', details.segmentInterval)
            .selectByValue('#source_type', details.sourceType)
            .setValue('input[name=assessment_date]', details.assessmentDate)
            .click('button[name=update]')
            .waitForPaginationComplete(done);
    };

    me.fillCoverSheetPart2 = function(details, done) {
        return client
            .setValue('input[name=assessment_starttime]', details.assessmentStartTime)
            .selectByValue('#rater1', details.rater1)
            .selectByValue('#rater2', details.rater2)
            .selectByValue('#site_id', details.siteId)
            .selectByValue('#dataentry_type_id', details.dataEntryTypeId)
            .click('#' + details.incompleteAssessment)
            .setValue('textarea[name=notes]', details.notes)
            .click('button[name=update]')
            .waitForPaginationComplete(done);
    };

    me.fillCalculationTestAsmt = function(details, done) {
        return client
            .setValue('textarea[name=asmt-Testcal_1-1]', details.asmtTestcal11)
            .setValue('textarea[name=asmt-Testcal_2-1]', details.asmtTestcal21)
            .setValue('textarea[name=asmt-Testcal_3-1]', details.asmtTestcal31)
            .selectByValue('#asmt-Testcal_5-1', details.asmtTestcal51)
            // if we dont do this pause, then an error gets thrown saying
            // parent.sharedFns.printQuestionMedia is not a function
            // TODO: need to update so that we dynamically check if printQuestionMedia is a function
            // or not, RATHER than using this 3500ms pause - not ideal.
            .pause(3500)
            .click('div[id=asmtComplete_bottom]')
            .waitForPaginationComplete(done);
    };

    me.beginNewAssessment = function(done) {
        return client
            .click('input[value="Begin a new assessment"]')
            .waitForPaginationComplete(done);
    };

    me.clickCoverSheetNextButton = function(done) {
        return client
            .click('button[name=update]')
            .waitForPaginationComplete(done);
    };

    me.fillAsmtSearchCriteria = function(details, done) {
        return client
            .setValue('input[name=ursi]', details.ursi)
            .setValue('input[name=assessment_date]', details.assessmentDate)

            // click something to remove focus from assessment date
            // TODO: I dont like that you have to click something after filling
            // in a date in order to remove focus from the js date popup
            .click('[name=ownersOnly]') // selects the first matched radio (All data shared with this study)

            .selectByValue('[name="segment_interval"]', details.segmentInterval)
            .selectByValue('[name="entry_code"]', 'C')
            .selectByValue('[name="dataentry_type_id"]', details.dataEntryTypeId)
            .click('input[name=DoSearch]')
            .waitForPaginationComplete(done);
    };

    me.clickAsmtResponsesButton = function(done) {
        return client
            .moveToObject('#asmt_grid>tbody>tr>td>a')
            .click('=responses')
            .waitForPaginationComplete(done);
    };

    me.verifyAutoCalcResponseExists = function(done) {
        return client
            .getHTML('div.box-container>table', function(err, html) {
                var n;

                // 1) grab html from the second table on the page: html[1]
                // 2) search for 10.760204081633
                n = html[1].search('10.760204081633');

                // 3) assert that the text we are searching for actually exists
                n.should.not.equal(-1);
            })
            .call(done);

        // TODO: update above search function.  Possibly utilizing XPATH trickery...
        //XPATH goodness
        //$x('//*[contains(text(), "10.760204081633")]')
        //getText(BIG_XPATH_QUERY, function() { .. })

        // From: https://saucelabs.com/resources/the-selenium-click-command
        // selenium.click("xpath=//input[@name=myButton' and @type='submit']")
    };

    me.findAsmtConflict = function(details, done) {
        return client
            .setValue(
                'input[type=search]',
                details.ursi + ' ' + details.assessmentDate + ' ' + details.segmentInterval
            )
            // TODO: this could be made more robust. As of now, it
            // just clicks the first "View" button, which is pretty brittle
            .click("#conflicts_table>tbody>tr>td>button")
            .waitForPaginationComplete(done);
    };

    me.fixAndResolveConflict = function(done) {
        return client
            .click('input[value=">>>"]')
            .click('input[value="Resolve"]')
            .waitForPaginationComplete(done);
    };

    return me;

};

