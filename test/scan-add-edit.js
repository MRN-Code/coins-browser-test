'use strict';

/* globals browser */

/**
 * Test scan.
 *
 * Steps:
 *
 *   1. Navigate to Add New Scan form (MICIS > Imaging > Add a Scan Session)
 *   1. Fill out with some sample data
 *   2. Click through to view the saved values
 *   3. Verify values match entered data.
 */

const nav = require('./lib/nav/navigation')(browser);
const micis = require('./lib/auth/micis')(browser);
const _ = require('lodash');


const sampleData = browser.options.testData.scanAdd;
describe('Add a new scan session', () => {
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav.micisMenu.clickNested('Add a Scan Session');
  });

  it('should show a scan session form', () => {
    browser.element('form#frmAdd').should.be.ok;// eslint-disable-line no-unused-expressions
  });

  it('should accept new scan values', () => {
    browser
      .setValue('#frmAdd input[name=ursi]', sampleData.ursi)
      .selectByValue('#frmAdd select[name=study_id]', sampleData.studyID)
      .setValue('#frmAdd input[name=scan_date]', sampleData.scanDateTime)
      .setValue('#frmAdd input[name=segment_interval]', sampleData.visit)
      .selectByVisibleText('#frmAdd select[name=scanner_id]', sampleData.scanner)
      .setValue('#frmAdd input[name=scan_label]', sampleData.sessionID)
      .setValue('#frmAdd input[name=scan_label]', sampleData.sessionID)
      .setValue('#frmAdd textarea[name=notes]', sampleData.notes);
    if (sampleData.queueForRadRead) {
      browser.click('#frmAdd input[name=queueForRadiologyRead][value=1]');
    } else {
      browser.click('#frmAdd input[name=queueForRadiologyRead][value=0]');
    }
    browser.click();
  });

  it('should show the confirmation', () => {
    browser.element('form#frmConfirm').should.be.ok;// eslint-disable-line no-unused-expressions
    browser.click('input[value=Continue]').waitForPaginationComplete();
    browser.getText('div.confirmMsg').should.be.equals('Scan Session successfully added.');
  });
  it('should add series', () => {
    browser.click('div.confirmMsg + a').waitForPaginationComplete();
    browser.element('form#frmAdd').should.be.ok;// eslint-disable-line no-unused-expressions
    _.each(sampleData.seriesConditions, (data, id) => {
      browser
        .setValue('input[name=sortOrder_1]', id)
        .selectByVisibleText('select[name=studyConditionId_1]', data[0])
        .selectByVisibleText('select[name=studyCodeId_1]', data[1]);
    });
    browser.click('input[value=Save]');
  });
});
