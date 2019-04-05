'use strict';

/* globals browser */

/**
 * Test add charge code.
 *
 * Steps:
 *
 *   1. Navigate to charge codes report from (MICIS > Billing > List Charge Codes)
 *   1. Clist new charge code abd fill out form with some sample data
 *   2. Click add charge code
 *   3. Search and Verify data.
 */
const nav = require('./lib/nav/navigation')(browser);
const micis = require('./lib/auth/micis')(browser);

const sampleData = browser.options.testData.chargeCodeAdd.sampleData;

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
     .setValue('input[name=end_date]', sampleData.endDate);
  });
  it('should submit and see if successful', () => {
    browser.pause(3000);
    browser.click('input[type=button][value=\'Add Charge Code\']').waitForPaginationComplete();
    browser.pause(3000);
    browser.getText('#page-container > div:nth-child(3) > div > center > font').should.be.equal('Charge Code Successfully Added!');
  });
  it('should verify the data', () => {
    browser.click('input[type=button][value=\'View All Charge Codes\']').waitForPaginationComplete();
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
});
