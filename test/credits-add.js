'use strict';

/* globals browser */

/**
 * Test creating a new study.
 *
 * Steps:
 *
 *   1. Navigate to add credits from (MICIS > Billing > Add Credits)
 *   2. Fill out form with some sample data
 *   3. Click Continue and verify if successful.
 */
const nav = require('./lib/nav/navigation')(browser);
const micis = require('./lib/auth/micis')(browser);

const sampleData = browser.options.testData.creditsAdd.sampleData;

describe('Add a credits', () => {
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav.micisMenu.clickNested('Add Credits');
  });
  /**
   * Confirm the form exists (step #1).
   */
  it('should show a new study form', () => {
    browser.element('form#frmAdd').should.be.ok;// eslint-disable-line no-unused-expressions
  });
  it('should fill values in the form', () => {
    browser
       .selectByVisibleText('select#pi_id', sampleData.piId)
       .waitForExist('select#default_charge_code_id [value=\'3\']');
    browser
       .selectByVisibleText('#default_charge_code_id', sampleData.defaultChargeCode);
    browser
       .setValue('#date_effective', sampleData.effectiveDate)
       .setValue('input[name=count]', sampleData.numCredits);
  });
  it('should submit and see if successful', () => {
    browser.click('input[type=button][value=\'Continue >\']').waitForPaginationComplete();
    browser.getText('#page-container > div').should.containEql('Credits successfully added');
  });
});
