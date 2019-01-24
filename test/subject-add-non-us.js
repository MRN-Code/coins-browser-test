'use strict';

/* globals browser */

const nav = require('./lib/nav/navigation.js')(browser);
const subject = require('./lib/subject.js')(browser);
const micis = require('./lib/auth/micis.js')(browser);

const zip = 'R3J 1R5';
const country = 'Canada';
const city = 'Winnipeg';
const phoneNum = '14433335555';

describe('subject enroll', () => {
  before('initialize', () => {
    if (!micis.loggedOn) { micis.logon(); }
  });

  describe('add subject form', () => {
    it('should be accessible', () => {
      nav.micisMenu
        .clickNested('Enter a New Subject');
    });

    it('should be fill-out-able', () => {
      // fill form
      subject.new.fillForm();
      // Change study id
      browser.selectByValue('#study_id', 7640); // Smoking
    });

    it('should change Country', () => {
      browser.selectByVisibleText('select[name=Country]', country);
      browser.setValue('input[name=City]', city);
    });
    it('state should be disabled', () => {
      browser.element('select[name=State]').isEnabled().should.not.be.ok;// eslint-disable-line no-unused-expressions
    });
    it('zip should take numbers and letters', () => {
      browser.setValue('input[name=Zip]', zip);
    });
    it('area code should not be visible', () => {
      browser.isVisible('#phone1_area_code').should.not.be.ok;// eslint-disable-line no-unused-expressions
    });
    it('phone number should take 10 digits', () => {
      browser.setValue('#phone1_phone_num', phoneNum);
      browser.setValue('#phone1_extension', '');
    });
    it('should be submittable', () => {
      subject.new.submit();
    });
  });

  describe('verify subject form', () => {
    it('should be submittable', () => {
      subject.new.verify();
    });
  });

  describe('handle new subject matches form', () => {
    it('should be submittable', () => {
      subject.new.handleSubjectMatchesAddNew();
    });
    it('URSI should not be empty', () => {
      subject.new.newUrsis.should.not.be.empty();
    });
  });

  describe('Look up and verify subject ', () => {
    it('URSI should not be empty', () => {
      subject.new.newUrsis.should.not.be.empty();
    });
    it('should be able to lookup ursi just added', () => {
      const ursi = subject.new.newUrsis[0];
      nav.micisMenu.clickNested('Look Up a Subject');
      subject.lookup.existing(ursi);
    });
    it('should verify country', () => {
      browser.click('#button-view').waitForPaginationComplete();
      browser.getText('tbody > tr:nth-child(14)>td:nth-child(2)').should.equal(country);
    });
    it('should make sure state is null', () => {
      browser.getText('tbody > tr:nth-child(15)>td:nth-child(2)').should.equal('');
    });
    it('should verify zip', () => {
      browser.getText('tbody > tr:nth-child(17)>td:nth-child(2)').should.equal(zip);
    });
    it('should verify phone', () => {
      browser.getText('tbody > tr:nth-child(18)>td:nth-child(2)')
          .replace(/[- )(]/g, '').should.equal(phoneNum);
    });
  });
});
