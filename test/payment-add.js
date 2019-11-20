'use strict';

/* globals browser */

/**
 * Test add a payment.
 *
 * Steps:
 *
 *   1. Navigate to Payments
 *   2. Click add payment
 *   3. Fill the form.
 *   3. Click Continue and verify if successful.
 */
const nav = require('./lib/nav/navigation')(browser);
const micis = require('./lib/auth/micis')(browser);

const sampleData = browser.options.testData.paymentAdd;

describe('Test payments', () => {
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav.goToPayments();
  });
  /**
   * Confirm the form exists (step #1).
   */
  it('should select a study and navigate to add payment', () => {
    browser
       .click('span[dusk="study-select"]')
       .click(`span[dusk="study-id-${sampleData.studyID}"]`).pause(3000);
    browser.click('a[href=add-payment]').element('#add_payment_page').should.be.ok; // eslint-disable-line no-unused-expressions
  });

  it('should fill values in the form', () => {
    browser
       .selectByVisibleText('select[name=payee_type]', sampleData.participant.payeeType)
       .setValue('input[dusk="payee_name"]', sampleData.participant.payeeName)
       .selectByVisibleText('select[name=payment_rate]', sampleData.participant.paymentRate)
       .setValue('#add_payment_page > div > form > table > tr:nth-child(5) > td:nth-child(2) > input', sampleData.participant.hours)
       .setValue('#add_payment_page > div > form > table > tr:nth-child(6) > td:nth-child(2) > input', sampleData.participant.hourlyRate)
       .selectByVisibleText('select[name=payment_type]', sampleData.participant.paymentType)
       .selectByVisibleText('select[name=payment_method]', sampleData.participant.paymentMethod)
       .setValue('input[name="payer"]', sampleData.participant.payer)
       .selectByVisibleText('select[name=w9_collected]', sampleData.participant.w9Provided)
       .setValue('textarea[name="notes"]', sampleData.participant.notes);
  });
  it('should submit and see if successful', () => {
    browser.click('input[type=button][value=\'Continue >\']').waitForPaginationComplete();
    browser.getText('#page-container > div').should.containEql('Credits successfully added');
  });

  it('should add an alternate', () => {
    browser
       .selectByVisibleText('select[name=payee_type]', sampleData.alternate.payeeType)
       .pause(5000);
    browser
       .click('input[name=add_alternate]')
       .waitForVisible('input[name=alternate_firstname]');
    browser
       .setValue('input[name=alternate_firstname]', sampleData.alternate.payeeFirstName)
       .setValue('input[name="alternate_lastname"]', sampleData.alternate.payeeLastName)
       .selectByVisibleText('select[name=alternate_birth_month]', sampleData.alternate.payeeBirthMonth)
       .selectByVisibleText('select[name=alternate_birth_day]', sampleData.alternate.payeeBirthDay)
       .setValue('input[name="alternate_address1"]', sampleData.alternate.payeeAddressLine1)
       .setValue('input[name="alternate_city"]', sampleData.alternate.payeeCity)
       .selectByVisibleText('select[name=alternate_state]', sampleData.alternate.payeeState)
       .setValue('input[name="alternate_postal"]', sampleData.alternate.payeeZip)
       .selectByVisibleText('select[name=alternate_country]', sampleData.alternate.payeeCountry);
    browser.setValue('textarea[name="alternate_detail"]', sampleData.alternate.payeeDetails)
       .pause(1000);
    browser.click('input[name="submit_add_alternate"]').pause(2000);
    browser.getValue('input[dusk=payee_name]').should.be.equal(`${sampleData.alternate.payeeFirstName} ${sampleData.alternate.payeeLastName}`);

    browser
       .selectByVisibleText('select[name=payment_rate]', sampleData.alternate.paymentRate)
       .setValue('input[name="amount_paid"]', sampleData.participant.hourlyRate)
       .selectByVisibleText('select[name=payment_type]', sampleData.alternate.paymentType)
       .selectByVisibleText('select[name=payment_method]', sampleData.alternate.paymentMethod)
       .setValue('input[name="payer"]', sampleData.alternate.payer)
       .selectByVisibleText('select[name=w9_collected]', sampleData.alternate.w9Provided)
       .setValue('textarea[name="notes"]', sampleData.alternate.notes);
  });
});
