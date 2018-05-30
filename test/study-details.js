'use strict';

/* globals browser */
/**
 * Confirm study details pages load and display appropriate content.
 */
const config = require('config');
const study = require('./lib/study')(browser, config);
const micis = require('./lib/auth/micis')(browser);

/**
 * Navigate to a single study.
 *
 * This rolls re-used navigation to the "NITEST" study into a reusable function.
 *
 * @todo  Roll this into reusable lib.
 *
 * @return {undefined}
 */
function navigateToSingleStudy() {
  study.goToView('NITEST');
}

describe('Study details', function studyDetails() {
  this.timeout(config.defaultTimeout);
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
  });
  /**
   * Ensure that the subject trackers CRM app loads. This requires fetching lots
   * of data for the server, so `waitForExist` with a long timeout is employed.
   */
  describe('subject trackers', () => {
    before(navigateToSingleStudy);

    it('should navigate to subject tracker', () => {
      browser
        .click('input[data-hook=subject-tracker-button]')
        .waitForVisible('.ui-dialog', 100);
      browser.click('.ui-dialog .ui-button-success');
    });
    it('should show subject tracker', () => {
      browser.waitForPaginationComplete();
      browser.waitForExist('#tracker-study-subject-details tbody tr', 7500);
    });
    it('should display subject rows', () => {
      browser
        .waitForExist('#tracker-study-subject-details tbody tr', 4000);
      browser.elements('#tracker-study-subject-details tbody tr').value.length.should.be.above(0);
    });
  });

  /**
   * Ensure the view subjects table exists and loads.
   */
  describe('view subjects', () => {
    before(navigateToSingleStudy);

    it('should navigate to view subjects page', () => {
      browser
        .click('input[data-hook=view-subjects-btn]');
      browser.waitForPaginationComplete();
    });

    it('should display subjects in a table', () => {
      browser
        .waitForExist('.dataTables_scrollBody tr', 500);
      /**
       * The subjects table should have subjects in it,
       * represented by this `table`'s `tr`s.
       */
      browser.elements('.dataTables_scrollBody tr').value.length.should.be.above(0);
    });
  });
  /**
   * Ensure the study access table exists and loads.
   */
  describe('list study access', () => {
    before(navigateToSingleStudy);

    it('should navigate to study access page', () => {
      browser
        .click('#frmAccess input[type=button]')
        .waitForPaginationComplete();
    });

    it('should display', () => {
      /**
       * Confirm the user access table has rows. The first row
       * functions as column headings, so the number of rows
       * should be greater than 1.
       */
      browser.elements('#list_access tbody tr').value.length.should.be.above(1);
    });
  });
});
