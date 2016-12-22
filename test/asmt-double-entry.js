'use strict';
var _ = require('lodash');
var config = require('config');
var should = require('should');
var glob = require('glob');
var homedir = require('homedir');
var fs = require('fs');

var client = require('./lib/client.js').client;
var nav = require('./lib/nav/navigation.js')(client, config);
var dataEntry = require('./lib/dataEntry.js')(client, config);
var manage = require('./lib/manage.js')(client, config);

var micis = require('./lib/auth/micis.js')(client);

/**
 * Random Time Generator
 *
 * Returns a time between 00:00 and 23:59
 * @return {String} 24-format HH:MM
 */
const getRandomTime = () => {
  // Minute: 00-59
  let min = Math.floor(Math.random() * 59).toString();
  min = min.length === 1 ? `0${min}` : min;

  // Hour: 00-23
  let hour = Math.floor(Math.random() * 23).toString();
  hour = hour.length === 1 ? `0${hour}` : hour;

  return `${hour}:${min}`;
}

/**
 * Random Date Generator
 *
 * Returns a date between 01/01/1900 and 12/28/1980
 * @return {String} MM/DD/YYYY
 */
const getRandomDate = () => {
  // Day: 01 - 28
  let day = Math.floor(Math.random() * 27 + 1).toString();
  day = day.length === 1 ? `0${day}` : day;

  // Month: 01 - 12
  let month = Math.floor(Math.random() * 11 + 1).toString();
  month = month.length === 1 ? `0${month}` : month;

  // Year: 00 - 80
  let year = Math.floor(Math.random() * 80).toString();
  year = year.length === 1 ? `0${year}` : year;

  return `${month}/${day}/19${year}`;
}

describe('navigate to asmt and fill out asmts', function() {
    this.timeout(config.defaultTimeout);

    before('initialize', function(done) {
        client.clientReady.then(function boot() {
            if (!micis.loggedOn) {
                micis.logon();
            }
            client.call(done);
        });
    });

    describe('asmt double entry without error', function() {

        // define inputs
        var asmtDetails = {
            ursi: 'M06100119',
            studyId: 2319, // NI TEST
            instrumentId: 26363, // Calculation Test
            segmentInterval: 'v3', // can vary this: visit1, v1, v2, v3, v4
            sourceType: '5',  // can vary this: 3, 4, 5, 6, 7, 8, 9
            assessmentDate: getRandomDate(),
            assessmentStartTime: getRandomTime(),
            rater1: 1341, // Abeer Ayaz
            rater2: 1162, // Abigail Quish
            siteId: '7', // MRN (default)
            dataEntryTypeId: 1, // Clinical Study (default)
            incompleteAssessment: 'successfully_completedY', // (default)
            notes: 'double entry without error'
        };

        var asmtFirstEntry = {
            asmtTestcal11: '1',
            asmtTestcal21: '2',
            asmtTestcal31: '3',
            asmtTestcal51: 0
        };

        var asmtSecondEntry = asmtFirstEntry;

        it ('should go to asmt and select NITEST (study_id 2319)', function(done) {
            nav.gotoAsmt();
            nav.selectAsmtStudy(asmtDetails.studyId, done);
        });

        it ('should navigate to DATA ENTRY > New Assessment', function(done) {
            nav.asmtMenu
                .clickNested('New Assessment', done);
        });

        it ('should verify that the AASE instrument is hidden from Data Entry (because it is a hidden instrument)', function(done) {
            // 1995 is instrument id for AASE instruments
            client.isExisting('select#instrument_id option[value="1995"]').should.be.fulfilledWith(false);
            client.call(done);
        });

        it ('should select Calculation Test (instrument_id 26363)', function(done) {
            // select calculation test
            dataEntry.selectInstrument(asmtDetails.instrumentId, done);
        });

        it ('should verify that the specialvisit segment_interval is hidden from Data Entry (because it is a hidden visit)', function(done) {
            client.isExisting('select#segment_interval option[value="specialvisit"]').should.be.fulfilledWith(false);
            client.call(done);
        });

        it ('should fill out the first 4 values of the Data Entry: Cover Sheet form', function(done) {
            // fill cover sheet part 1
            dataEntry.fillCoverSheetPart1(asmtDetails, done);
        });

        it ('should fill out the remaining required inputs for Data Entry: Cover Sheet form', function(done) {
            // fill cover sheet part 2
            dataEntry.fillCoverSheetPart2(asmtDetails, done);
        });

        it ('should partially fill in assessment, then save and escape', function(done) {
            // partially fill in asmt, save, escape
            dataEntry.partiallyFillCalTestAsmt(asmtFirstEntry, done);
        });

        it ('should navigate to DATA ENTRY > Resume Entry', function(done) {
            nav.asmtMenu
                .clickNested('Resume Entry', done);
        });

        it ('should resume the assessment which was just escaped', function(done) {
            // go to resume queue, click the escaped asmt
            const asmtDate = asmtDetails.assessmentDate.replace(/\//g, '-');
            dataEntry.resumeEntry(asmtDate, done);
        });

        it ('should enter the resumed assessment', function(done) {
            // click the button to enter resumed assessment
            dataEntry.enterResumedEntry(done);
        });

        it ('should fill in assessment first entry', function(done) {
            // fill assessment 1 First Entry
            dataEntry.fillCalculationTestAsmt(asmtFirstEntry, done);
        });

        it ('should begin a new assessment', function(done) {
            dataEntry.beginNewAssessment();
            client.call(done);
        });

        it ('should select Calculation Test (instrument_id 26363) for the second time', function(done) {
            // select calculation test
            dataEntry.selectInstrument(asmtDetails.instrumentId, done);
        });

        // After escape-resume, the coversheet info lost. Need to re-fill in.
        it ('should fill out the first 4 values of the Data Entry: Cover Sheet form', function(done) {
            // fill cover sheet part 1
            dataEntry.fillCoverSheetPart1(asmtDetails, done);
        });

        it ('should fill out the remaining required inputs for Data Entry: Cover Sheet form', function(done) {
            // fill cover sheet part 2
            dataEntry.fillCoverSheetPart2(asmtDetails, done);
        });

        it ('should fill in assessment second entry', function(done) {
            // fill assessment 1 Seond Entry
            dataEntry.fillCalculationTestAsmt(asmtSecondEntry, done);
        });

        it ('should navigate to MANAGE > Search Assessments', function(done) {
            nav.asmtMenu
                .clickNested('Search Assessments', done);
        });

        it ('should fill assessment search criteria and click search button', function(done) {
            manage.fillAsmtSearchCriteria(asmtDetails, done);
        });

        /**
         * We did not create a profile for the browser to NOT ASK BEFORE DOWNLOADING.
         * So, in order for this test to be successful, you need to make sure the popup window
         * does not show up. To do this, try manually downloading the file in the testing browser,
         * when the window pops up for you to confirm the download, check the checkbox saying
         * "Do this automatically for files like this from now on" and click "OK" to download
         * the data. Once this is done, this test should be able to pass. This only needs to
         * be done once in the testing browser.
         */
        it ('should select all assessments and download them', function(done) {
            manage.downloadAsmt(done);
        });

        it ('should check if the downloaded file exists', function(done) {
            // check download folder to see if the file exists
            let exists = false;
            glob.sync(homedir() + '/Downloads/assessmentsResults*.csv').forEach(function(file) {
                // check if any file download within 30 seconds
                if ((new Date).getTime() - fs.statSync(file).ctime.getTime() < 30*1000) {
                    exists = true;
                }
            });
            if (!exists) {
                throw new Error('Assessment download failed.');
            }
            client.call(done);
        });

        it ('should select "responses" button in order to view assessment responses', function(done) {
            manage.clickAsmtResponsesButton(done);
        });

        it ('should find auto calc that matches: 10.760204081633', function (done) {
            manage.verifyAutoCalcResponseExists(done);
        });

    });

    // This is very very similar to the above test with only a few slight changes
    describe('asmt double entry with entry error and entry error correction', function() {

        // define inputs
        var asmtDetails = {
            ursi: 'M06100119',
            studyId: 2319, // NI TEST
            instrumentId: 26363, // Calculation Test
            segmentInterval: 'v2', // can vary this: visit1, v1, v2, v3, v4
            sourceType: '8',  // can vary this: 3, 4, 5, 6, 7, 8, 9
            assessmentDate: getRandomDate(),
            assessmentStartTime: getRandomTime(),
            rater1: 1341, // Abeer Ayaz
            rater2: 1162, // Abigail Quish
            siteId: '7', // MRN (default)
            dataEntryTypeId: 1, // Clinical Study (default)
            incompleteAssessment: 'successfully_completedY', // (default)
            notes: 'double entry with error...'
        };

        var asmtFirstEntry = {
            asmtTestcal11: '1',
            asmtTestcal21: '2',
            asmtTestcal31: '3',
            asmtTestcal51: 0
        };

        var asmtSecondEntry = {
            asmtTestcal11: '1',
            asmtTestcal21: '2',
            asmtTestcal31: '2', // this is the error we are introducing
            asmtTestcal51: 0
        };

        it ('should navigate to DATA ENTRY > New Assessment', function(done) {
            nav.asmtMenu
                .clickNested('New Assessment', done);
        });

        it ('should select Calculation Test (instrument_id 26363)', function(done) {
            // select calculation test
            dataEntry.selectInstrument(asmtDetails.instrumentId, done);
        });

        it ('should fill out the first 4 values of the Data Entry: Cover Sheet form', function(done) {
            // fill cover sheet part 1
            dataEntry.fillCoverSheetPart1(asmtDetails, done);
        });

        it ('should fill out the remaining required inputs for Data Entry: Cover Sheet form', function(done) {
            // fill cover sheet part 2
            dataEntry.fillCoverSheetPart2(asmtDetails, done);
        });

        it ('should fill in assessment first entry', function(done) {
            // fill assessment 1 First Entry
            dataEntry.fillCalculationTestAsmt(asmtFirstEntry, done);
        });

        it ('should begin a new assessment', function(done) {
            dataEntry.beginNewAssessment();
            client.call(done);
        });

        it ('should select Calculation Test (instrument_id 26363) for the second time', function(done) {
            // select calculation test
            dataEntry.selectInstrument(asmtDetails.instrumentId, done);
        });

        it ('should click the next button for the first section of the Data Entry: Cover Sheet form', function(done) {
            // click the next button and wait for pagination to complete
            dataEntry.clickCoverSheetNextButton(done);
        });

        it ('should click the next button for the second section of the Data Entry: Cover Sheet form', function(done) {
            // click the next button a second time and wait for pagination to complete
            dataEntry.clickCoverSheetNextButton(done);
        });

        it ('should fill in assessment second entry', function(done) {
            // fill assessment 1 Seond Entry
            dataEntry.fillCalculationTestAsmt(asmtSecondEntry, done);
        });

        it ('should navigate to MANAGE > View Conflicts', function(done) {
            nav.asmtMenu
                .clickNested('View Conflicts', done);
        });

        it ('should search for and find the asmt conflict', function(done) {
            manage.findAsmtConflict(asmtDetails, done);
        });

        it ('should fix the error, then resolve the conflict', function(done) {
            manage.fixAndResolveConflict(done);
        });

        it ('should navigate to MANAGE > Search Assessments', function(done) {
            nav.asmtMenu
                .clickNested('Search Assessments', done);
        });

        it ('should fill assessment search criteria and click search button', function(done) {
            manage.fillAsmtSearchCriteria(asmtDetails, done);
        });

        it ('should select "responses" button in order to view assessment responses', function(done) {
            manage.clickAsmtResponsesButton(done);
        });

        it ('should find auto calc that matches: 10.760204081633', function (done) {
            manage.verifyAutoCalcResponseExists(done);
        });

    });

});
