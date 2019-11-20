'use strict';

/* globals browser */

const nav = require('./lib/nav/navigation.js')(browser);
const subject = require('./lib/subject.js')(browser);
const micis = require('./lib/auth/micis.js')(browser);

const sampleData = browser.options.testData.subjectEnroll;

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
      browser.selectByValue('#study_id', sampleData.studyID); // Smoking
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
    it('should be enroll with existing subject', () => {
      subject.new.handleSubjectMatchesExisting();
    });
  });
});
