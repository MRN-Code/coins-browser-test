'use strict';

/* globals browser */

const _ = require('lodash');
const nav = require('./lib/nav/navigation.js')(browser);
const subject = require('./lib/subject.js')(browser);

const micis = require('./lib/auth/micis.js')(browser);

const sampleData = browser.options.testData.subjectAdd;

describe('subject', () => {
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
      text.trim().should.equal(sampleData.ursiPrefix);
    });

    it('should not have a hidden subject type ("Special") as a subject type', () => {
      browser.isVisible("select#subject_type_id > option[value='Special']").should.not.be.ok;// eslint-disable-line no-unused-expressions
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

  describe('subject lookup', () => {
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
      browser.waitForPaginationComplete(); // Probably loading overlay blocking nav click.
      nav.micisMenu.clickNested('Look Up a Subject');
      subject.lookup.existing(ursi);
    });
  });
});
