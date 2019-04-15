'use strict';

/* globals browser */

/**
 * Test add charge code.
 *
 * Steps:
 *
 *   1. Navigate to charge codes report from (MICIS > Billing > List Charge Codes)
 *   2. Clist new charge code and fill out form with some sample data
 *   3. Click add charge code
 *   4. Search and Verify data.
 *   5. Add a study to the charge code
 */
const nav = require('./lib/nav/navigation')(browser);
const micis = require('./lib/auth/micis')(browser);

const sampleData = browser.options.testData.chargeCode.sampleData;

describe('Add a new Charge Code', () => {
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav.micisMenu.clickNested('List Charge Codes');
  });
  it('should show a new charge code button', () => {
    browser.element('input[type=button][value=\'Add Charge Code\']').should.be.ok;// eslint-disable-line no-unused-expressions
  });
  it('should open the add charge code form', () => {
    browser.click('input[type=button][value=\'Add Charge Code\']').waitForPaginationComplete();
    browser.element('form#frmSearch').should.be.ok;// eslint-disable-line no-unused-expressions
  });
  it('should fill values in the form', () => {
    if (sampleData.onlyAllowScanCreditBilling) {
      browser.click('input[name=scan_limited][value=t]');
    } else {
      browser.click('input[name=scan_limited][value=f]');
    }
    browser
     .setValue('input[name=charge_code]', sampleData.chargeCode)
     .setValue('input[name=project_number]', sampleData.projectNumber)
     .setValue('input[name=start_date]', sampleData.startDate)
     .click('#page-container > div.boxHeader > span')  // to close the calender
     .setValue('input[name=end_date]', sampleData.endDate)
     .click('#page-container > div.boxHeader > span');
  });
  it('should submit and see if successful', () => {
    browser.click('input[type=button][value=\'Add Charge Code\']').waitForPaginationComplete();
    browser.getText('#page-container > div:nth-child(3) > div > center > font').should.be.equal('Charge Code Successfully Added!');
  });
  it('should verify the data', () => {
    browser.click('input[type=button][value=\'View All Charge Codes\']').pause(500);
    browser.waitForExist('input[type=search]');
    browser.setValue('input[type=search]', sampleData.chargeCode);
    browser.click('#charge_codes > tbody > tr > td:nth-child(3) > a').waitForPaginationComplete();

    browser.getValue('input[name=charge_code]').should.equal(sampleData.chargeCode);
    browser.getValue('input[name=project_number]').should.equal(`${sampleData.projectNumber}`);
    browser.getValue('input[name=start_date]').should.equal(sampleData.startDate);
    browser.getValue('input[name=end_date]').should.equal(sampleData.endDate);
    if (sampleData.onlyAllowScanCreditBilling) {
      browser.isSelected('input[name=scan_limited][value=t]').should.be.true();
    } else {
      browser.isSelected('input[name=scan_limited][value=f]').should.be.true();
    }
  });
  it('should add study to the charge code', () => {
    browser.click('input[type=button][value=\'Add Study\']').waitForPaginationComplete();
    browser
        .selectByVisibleText('#funding_source', sampleData.fundingSource)
        .element('#study_id')
        .selectByAttribute('value', sampleData.studyID);
    browser
        .click('input[name=is_enabled][value=t]')
        .click('#modality_label_1')
        .click('input[type=button][value=\'Add Charge Code Study\']')
        .pause(500);
    browser.getText('#page-container > div.boxBody > div > center > font').should.containEql('Charge Code Study Successfully Added!');
  });
});
