"use strict";
var _ = require('lodash');

// exports
module.exports = function(client, config) {
    var me = {};

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
        var selector = 'button[id="new_asmt_bottom"]';
        return client
            .scroll(selector, 0, 0)
            .click(selector)
            .waitForPaginationComplete(done);
    };

    me.clickCoverSheetNextButton = function(done) {
        return client
            .click('button[name=update]')
            .waitForPaginationComplete(done);
    };

    // Partially fill in the asmt and save then escape
    me.partiallyFillCalTestAsmt = function(details, done) {
        return client
            .setValue('textarea[name=asmt-Testcal_1-1]', details.asmtTestcal11)
            .setValue('textarea[name=asmt-Testcal_2-1]', details.asmtTestcal21)
            .click('div[id=asmtSave]')
            .pause(3000)
            /*
            .waitUtil(function() {
                return this.getText('div[id=asmtSave]') === 'Saved';
            }, 3000, 'Error saving asmt responses')
            */
            .click('div[id=asmtEscape]')
            .waitForPaginationComplete(done);
    };

    me.completePartialCalTestAsmt = function(details, done) {
        return client
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

    // Resume data entry
    me.resumeEntry = function(asmtDate, done) {
        return client
            // We will rely on a special asmt date to fetch the correct record in the table
            .setValue('input[aria-controls=my_asmts]', asmtDate)
            .click('#my_asmts tr.odd td:nth-last-child(1) .simLink')
            .waitForPaginationComplete(done);
    };

    me.enterResumedEntry = function(done) {
        return client
            .click('button[id=start_entry]')
            .waitForPaginationComplete(done);
    };

    return me;

};

