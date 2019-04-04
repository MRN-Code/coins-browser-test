'use strict';

/* globals browser */

/**
 * Test creating a new study.
 *
 * Steps:
 *
 *   1. Navigate to add site from (MICIS > Admin > Add Site)
 *   1. Fill out form with some sample data
 *   2. Click Add
 *   3. Verify values match entered data.
 */

const nav = require('./lib/nav/navigation')(browser);
const micis = require('./lib/auth/micis')(browser);

const sampleData = browser.options.testData.siteAdd.sampleData;


describe('Add a new Site', () => {
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav.micisMenu.clickNested('Sites');
  });
  it('should show a new site button', () => {
    browser.element('form#addSite').should.be.ok;// eslint-disable-line no-unused-expressions
  });
  it('should open the add site form', () => {
    browser.click('form#addSite input[type="button"]').waitForPaginationComplete();
    browser.element('form#frmCreate').should.be.ok;// eslint-disable-line no-unused-expressions
  });
  it('should fill values in the form', () => {
    browser
    .setValue('input[name=label]', sampleData.label)
    .setValue('textarea[name=desc]', sampleData.description)
    .setValue('input[name=ursiprefix]', sampleData.URSIPrefix)
    .setValue('input[name=addAttr_0]', sampleData.userLabel)
    .setValue('input[name=site_id]', sampleData.siteID);
    if (sampleData.expirationDateChecked) {
      browser.click('#addExpr_0');
    }
  });
  it('should submit and see if successful', () => {
    browser.click('form#frmCreate input[type="button"]').waitForPaginationComplete();
    browser.getText('#page-container > div.boxBody > div > center > font').should.be.equal('Site Successfully Added');
  });
});
