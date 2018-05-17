'use strict';

/* globals browser */

const _ = require('lodash');
const config = require('config');
const nav = require('./lib/nav/navigation.js')(browser, config);
const subject = require('./lib/subject.js')(browser, config);

const micis = require('./lib/auth/micis.js')(browser);

describe('subject', function subjectAdd() {
  this.timeout(config.defaultTimeout);

  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
  });

  describe('add subject form', () => {
    it('should be accessible', () => {
      nav.micisMenu
        .clickNested('Enter a New Subject');
    });

    it('should be fill-out-able', () => {
      // fill form
      subject.new.fillForm();
    });

    it('should generate an URSI prefix', () => {
      const text = browser.getText('#ursi_prefix_preview_prefix');
      text.trim().should.equal('M871');
    });

    it('should not have a hidden subject type ("Special") as a subject type', () => {
      browser.selectByVisibleText('#subject_type_id', 'Special').should.not.be.ok;// eslint-disable-line no-unused-expressions
      // test good and bogus values pre submit
      // submit
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
  });

  describe('subject lookup', function subjectAddLookup() {
    this.timeout(config.defaultTimeout);

    before('initialize', () => {
      if (!micis.loggedOn) {
        micis.logon();
      }
      if (_.isEmpty(subject.new.newUrsis)) {
        throw new Error('ursis must have been added to lookup existing subject');
      }
    });

    it('should be able to lookup ursi just added', () => {
      const ursi = subject.new.newUrsis[0];
      nav.micisMenu.clickNested('Look Up a Subject');
      subject.lookup.existing(ursi);
    });
  });
});
