'use strict';

const config = require('config');
const should = require('should');

const client = require('./lib/client.js').client;
const nav = require('./lib/nav/navigation.js')(client, config);
const dataEntry = require('./lib/dataEntry.js')(client, config);
const manage = require('./lib/manage.js')(client, config);

const micis = require('./lib/auth/micis.js')(client);

describe('navigate to asmt and fill out asmts', () => {
  this.timeout(config.defaultTimeout);

  before('initialize', (done) => {
    client.clientReady.then(() => {
      if (!micis.loggedOn) {
        micis.logon();
      }
      client.call(done);
    });
  });

  describe('asmt double entry without error', () => {
        // define inputs
    const asmtDetails = {
      ursi: 'M06100119',
      studyId: 2319, // NI TEST
      instrumentId: 26363, // Calculation Test
      segmentInterval: 'visit1', // can vary this: visit1, v1, v2, v3, v4
      sourceType: '3',  // can vary this: 3, 4, 5, 6, 7, 8, 9
      assessmentDate: '11/22/1988',
      assessmentStartTime: '10:22',
      rater1: 1341, // Abeer Ayaz
      rater2: 1162, // Abigail Quish
      siteId: '7', // MRN (default)
      dataEntryTypeId: 1, // Clinical Study (default)
      incompleteAssessment: 'successfully_completedY', // (default)
      notes: 'double entry without error',
    };

    const asmtFirstEntry = {
      asmtTestcal11: '1',
      asmtTestcal21: '2',
      asmtTestcal31: '3',
      asmtTestcal51: 0,
    };

    const asmtSecondEntry = asmtFirstEntry;

    it('should go to asmt and select NITEST (study_id 2319)', (done) => {
      nav.gotoAsmt();
      nav.selectAsmtStudy(asmtDetails.studyId, done);
    });

    it('should navigate to DATA ENTRY > New Assessment', (done) => {
      nav.asmtMenu
                .clickNested('New Assessment', done);
    });

    it('should select Calculation Test (instrument_id 26363)', (done) => {
            // select calculation test
      dataEntry.selectInstrument(asmtDetails.instrumentId, done);
    });

    it('should fill out the first 4 values of the Data Entry: Cover Sheet form', (done) => {
            // fill cover sheet part 1
      dataEntry.fillCoverSheetPart1(asmtDetails, done);
    });

    it('should fill out the remaining required inputs for Data Entry: Cover Sheet form', (done) => {
            // fill cover sheet part 2
      dataEntry.fillCoverSheetPart2(asmtDetails, done);
    });

    it('should fill in assessment first entry', (done) => {
            // fill assessment 1 First Entry
      dataEntry.fillCalculationTestAsmt(asmtFirstEntry, done);
    });

    it('should begin a new assessment', (done) => {
      dataEntry.beginNewAssessment();
      client.call(done);
    });

    it('should select Calculation Test (instrument_id 26363) for the second time', (done) => {
            // select calculation test
      dataEntry.selectInstrument(asmtDetails.instrumentId, done);
    });

    it('should click the next button for the first section of the Data Entry: Cover Sheet form', (done) => {
            // click the next button and wait for pagination to complete
      dataEntry.clickCoverSheetNextButton(done);
    });

    it('should click the next button for the second section of the Data Entry: Cover Sheet form', (done) => {
            // click the next button a second time and wait for pagination to complete
      dataEntry.clickCoverSheetNextButton(done);
    });

    it('should fill in assessment second entry', (done) => {
            // fill assessment 1 Seond Entry
      dataEntry.fillCalculationTestAsmt(asmtSecondEntry, done);
    });

    it('should navigate to MANAGE > Search Assessments', (done) => {
      nav.asmtMenu
                .clickNested('Search Assessments', done);
    });

    it('should fill assessment search criteria and click search button', (done) => {
      manage.fillAsmtSearchCriteria(asmtDetails, done);
    });

    it('should select "responses" button in order to view assessment responses', (done) => {
      manage.clickAsmtResponsesButton(done);
    });

    it('should find auto calc that matches: 10.760204081633', (done) => {
      manage.verifyAutoCalcResponseExists(done);
    });
  });

    // This is very very similar to the above test with only a few slight changes
  describe('asmt double entry with entry error and entry error correction', () => {
        // define inputs
    const asmtDetails = {
      ursi: 'M06100119',
      studyId: 2319, // NI TEST
      instrumentId: 26363, // Calculation Test
      segmentInterval: 'v2', // can vary this: visit1, v1, v2, v3, v4
      sourceType: '4',  // can vary this: 3, 4, 5, 6, 7, 8, 9
      assessmentDate: '10/22/1953',
      assessmentStartTime: '11:22',
      rater1: 1341, // Abeer Ayaz
      rater2: 1162, // Abigail Quish
      siteId: '7', // MRN (default)
      dataEntryTypeId: 1, // Clinical Study (default)
      incompleteAssessment: 'successfully_completedY', // (default)
      notes: 'double entry with error...',
    };

    const asmtFirstEntry = {
      asmtTestcal11: '1',
      asmtTestcal21: '2',
      asmtTestcal31: '3',
      asmtTestcal51: 0,
    };

    const asmtSecondEntry = {
      asmtTestcal11: '1',
      asmtTestcal21: '2',
      asmtTestcal31: '2', // this is the error we are introducing
      asmtTestcal51: 0,
    };

    it('should navigate to DATA ENTRY > New Assessment', (done) => {
      nav.asmtMenu
                .clickNested('New Assessment', done);
    });

    it('should select Calculation Test (instrument_id 26363)', (done) => {
            // select calculation test
      dataEntry.selectInstrument(asmtDetails.instrumentId, done);
    });

    it('should fill out the first 4 values of the Data Entry: Cover Sheet form', (done) => {
            // fill cover sheet part 1
      dataEntry.fillCoverSheetPart1(asmtDetails, done);
    });

    it('should fill out the remaining required inputs for Data Entry: Cover Sheet form', (done) => {
            // fill cover sheet part 2
      dataEntry.fillCoverSheetPart2(asmtDetails, done);
    });

    it('should fill in assessment first entry', (done) => {
            // fill assessment 1 First Entry
      dataEntry.fillCalculationTestAsmt(asmtFirstEntry, done);
    });

    it('should begin a new assessment', (done) => {
      dataEntry.beginNewAssessment();
      client.call(done);
    });

    it('should select Calculation Test (instrument_id 26363) for the second time', (done) => {
            // select calculation test
      dataEntry.selectInstrument(asmtDetails.instrumentId, done);
    });

    it('should click the next button for the first section of the Data Entry: Cover Sheet form', (done) => {
            // click the next button and wait for pagination to complete
      dataEntry.clickCoverSheetNextButton(done);
    });

    it('should click the next button for the second section of the Data Entry: Cover Sheet form', (done) => {
            // click the next button a second time and wait for pagination to complete
      dataEntry.clickCoverSheetNextButton(done);
    });

    it('should fill in assessment second entry', (done) => {
            // fill assessment 1 Seond Entry
      dataEntry.fillCalculationTestAsmt(asmtSecondEntry, done);
    });

    it('should navigate to MANAGE > View Conflicts', (done) => {
      nav.asmtMenu
                .clickNested('View Conflicts', done);
    });

    it('should search for and find the asmt conflict', (done) => {
      manage.findAsmtConflict(asmtDetails, done);
    });

    it('should fix the error, then resolve the conflict', (done) => {
      manage.fixAndResolveConflict(done);
    });

    it('should navigate to MANAGE > Search Assessments', (done) => {
      nav.asmtMenu
                .clickNested('Search Assessments', done);
    });

    it('should fill assessment search criteria and click search button', (done) => {
      manage.fillAsmtSearchCriteria(asmtDetails, done);
    });

    it('should select "responses" button in order to view assessment responses', (done) => {
      manage.clickAsmtResponsesButton(done);
    });

    it('should find auto calc that matches: 10.760204081633', (done) => {
      manage.verifyAutoCalcResponseExists(done);
    });
  });
});

