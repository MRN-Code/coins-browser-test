'use strict';

/* globals browser */

const config = require('config');
const study = require('./lib/study.js')(browser, config);
const micis = require('./lib/auth/micis.js')(browser);

const tempTagId = `testTag_${Date.now()}`;

describe('study', function studyTest() {
  this.timeout(config.defaultTimeout);

  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
  });

  describe('list studies form', () => {
    it('should be accessible', () => {
      study.goToView('NITEST');
    });
  });

  describe('view subjects pages', () => {
    it('should be able to view subjects', () => {
      study.goToView('NITEST');
      study.view.subjects();
    });

    it('should be able to view subject details', () => {
      study.view.subjectDetails('M06158639')
        .waitForPaginationComplete();
    });

    it('should be able to add a global subject tag', () => {
      study.view.subjectDetails
        .addTag(tempTagId, 'Temporary Subject ID', 'global')
        .element(`[value="${tempTagId}"]`)
        .scroll(); // asserts that new tag made it
    });

    it('should be able to edit a global subject tag', () => {
      const newTag = `${tempTagId}-2`;
      const exists = browser.isVisible(`[value="${tempTagId}"]`);
      // test if tag is in page or in table
      if (exists) {
        // what ?
      } else {
        browser // eslint-disable-line consistent-return
          .click(`//*[contains(text(), "${tempTagId}")]//..//form//input[@value="Edit"]`)
          .waitForPaginationComplete();
      }
      // use XPATH selector because of usage of hidden 'previous_value' nodes with
      // same characteristics :(
      const exists2 = browser.setValue('//*[contains(text(), "Subject Tag Value")]//..//input', newTag)

        .click('#editExtIdFrm [name="doChange"]') // TODO move these out of test file
        .waitForPaginationComplete()
        .isVisible(`[value="${newTag}"]`);
      // test if the newTag is on page or in table
      if (!exists2) {
        browser // eslint-disable-line consistent-return
          .click(`//*[contains(text(), "${newTag}")]//..//form//input[@value="Edit"]`)
          .waitForPaginationComplete();
      }
    });
  });
});
