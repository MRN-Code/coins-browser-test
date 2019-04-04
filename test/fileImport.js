'use strict';

/* globals browser */

const path = require('path');

const nav = require('./lib/nav/navigation.js')(browser);
const micis = require('./lib/auth/micis.js')(browser);

const sampleData = browser.options.testData.fileImport;


describe('Perform various imports and verify that they function correctly', () => {
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
  });

  describe('Import subjects', () => {
    it('Should navigate to Subjects > Import Participants', () => {
      nav.micisMenu.clickNested('Import Participants');
    });

    it('Should upload file', () => {
      browser
        .selectByValue('select#study_id', sampleData.studyID)
        .waitForValue('select#subject_type_id', 3000);
      // This click action is a hack to activate the 'input[name=userfile]' element
      // Otherwise the selenium will not be able to see the element
      browser.click('input#upload')
        .chooseFile('input[name=userfile]', path.join(
          __dirname,
          'upload_test_files/participant_import_formatted.csv'
        ))
        .waitForPaginationComplete();
    });

    it('Should see the upload is successful', () => {
      browser.pause(500);
      browser.waitForPaginationComplete(10000);
      browser
        .getText('div.boxHeader > span')
        .should.be.a.String().and.match('Participants Imported!');
    });
  });

  describe('Import instruments and assessments', () => {
    it('Should go to asmt and select NITEST (study_id 2319)', () => {
      nav.gotoAsmt();
      nav.selectAsmtStudy(sampleData.studyID);
    });

    // Import instruments
    it('Should navigate to Admin > Import Instruments', () => {
      nav.asmtMenu.clickNested('Import Instruments');
    });

    it('Should fill in the inst prefix and upload file', () => {
      browser
        .setValue('input#questPrefix', 'QIWEQWEQWE')
        .chooseFile('input#file', path.join(
          __dirname,
          'upload_test_files/Adverse_Events_Log_formatted.csv'))
        .waitForPaginationComplete();
    });

    it('Should see the upload is successful', () => {
      browser.waitForPaginationComplete(10000);
      browser.getText('div#page-container').should.containEql('Instrument successfully added');
    });

    // Import assessments
    it('Should navigate to Admin > Import Assessments', () => {
      nav.asmtMenu.clickNested('Import Assessments');
    });

    it('Should upload assessments', () => {
      browser.click('input[name=defaultCoverSheetData][value=no]')
        .click('input[name=bgImport][value=no]')
        .click('input[name=uploadType][value=completed]')
        .click('#importLabel')
        .chooseFile('#import', path.join(
          __dirname,
          'upload_test_files/NITEST_STOP-BANG_template.csv'
        ))
        .waitForPaginationComplete();
    });

    it('Should see the upload is successful', () => {
      browser.waitForPaginationComplete(10000);
      browser.isExisting('#import_response > div > p').should.be.ok;// eslint-disable-line no-unused-expressions
      browser.pause(5000);
      browser.getText('#import_response > div > div > textarea').split(',').should.have.size(2);
    });
  });
});
