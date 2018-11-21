'use strict';

/* globals browser should */

/**
 * Test creating, updating and deleting subject tags.
 *
 * Basic CRUD testing with two tags. One tag (SSN) is encrypted in the database,
 * the other is not. Steps:
 *
 *   1. Navigate to appropriate view
 *   2. Add “Temporary Subject ID” and “U.S. SSN” tags to a specific study --
 *      “NITEST”
 *   3. Check tags persisted
 *   4. Update the “Temporary Subject ID” and check update stuck
 *   5. Delete tags added in step #2
 *   6. Confirm tags were deleted
 */

const randomNumber = require('lodash/random');
const config = require('config');
const micis = require('./lib/auth/micis.js')(browser);
const nav = require('./lib/nav/navigation.js')(browser, config);

const sampleUrsi = 'M87161657';
const sampleTags = [{
  type: 'Temporary Subject ID',
  value: `test_${Date.now()}`,
}, {
  type: 'U.S. SSN',
  value: randomNumber(1e8, 1e9 - 1), // Random 9-digit number
}];

describe('Add subject tags', function subjectTags() {
  /**
   * This set of assertions require several page reloads. You may need to
   * adjust the timeout to ~45s.
   */
  this.timeout(config.defaultTimeout);

  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav.micisMenu
      .clickNested('Look Up a Subject')
      .setValue('#ursi', sampleUrsi)
      .click('#frmFindSubject .ui-button-success')
      .waitForPaginationComplete()
      .waitForExist('#button-extideditor');
    browser
      .click('#button-extideditor')
      .waitForPaginationComplete();
  });

  it('should show a new tags form', () => {
    const elem = browser.element('#addextFrm');
    elem.should.be.ok;// eslint-disable-line no-unused-expressions
  });

  it('should accept new tags', () => {
    /**
     * Iterate over `sampleTags`, input properties into the appropriate
     * form elements, and save.
     */
    sampleTags.forEach((tag) => {
      browser
        .selectByVisibleText(
          '#addextFrm select[name=subject_tag_id]',
          tag.type
        )
        .setValue('#addextFrm input[name=value]', tag.value)
        .element('#addextFrm input[value=study]')
        .scroll()
        .click('#addextFrm input[value=study]')
        .selectByVisibleText(
          '#addextFrm select[name=tag_study]',
          'NITEST'
        )
        .click('#addextFrm input[type=button]')
        .waitForPaginationComplete();
      browser.pause(1000);
    });
  });

  /**
   * Confirm the freshly created tags exist in subject's tag table.
   */
  it('should save new tags', () => {
    browser.pause(5000);
    const res = browser.customGetText('#subject_tags_table tbody');

    /**
     * Iterate over the table's rows and find those containing
     * data from `sampleTags`.
     */
    const matches = res.split(/\n/).filter(row => sampleTags.some(tag => row.indexOf(tag.type) !== -1 && row.indexOf(tag.value) !== -1));

    /* eslint-disable no-unused-expressions */
    should(matches.length === sampleTags.length).be.ok;
    /* eslint-enable no-unused-expressions */
  });

  it('should save tag edits', () => {
    const tag = sampleTags[0];
    // search for tag in the data table to make it visible.
    browser.setValue('#subject_tags_table_filter > label > input[type="search"]', tag.value);
    browser.pause(1000);

    browser
      .click(`input[value=${tag.value}] ~ input[name=doEdit]`)
      .waitForPaginationComplete();
      /**
       * Warning! The sample tag is mutated. This is helpful for tracking
       * the new value for the remainder of the test.
       */

    browser.setValue('#editExtIdFrm input[name=value]', tag.value += '_edit');
    browser.pause(1000);
    browser.click('#editExtIdFrm input[name=doChange]').waitForPaginationComplete();
    browser.pause(1000);
    browser.waitForText('#subject_tags_table tbody', 1000); // *[@id="subject_tags_table_filter"]/label/input
    browser.pause(1000);

    const res = browser.customGetText('#subject_tags_table tbody');
    const hasMatch = res.split(/\n/).some(row => row.indexOf(tag.type) !== -1 && row.indexOf(tag.value) !== -1);
    /* eslint-disable no-unused-expressions */
    should(hasMatch).be.ok;
    /* eslint-enable no-unused-expressions */
  });

  it('should remove deleted tags', () => {
    sampleTags.forEach((tag) => {
      // search for tag in the data table to make it visible.
      browser.setValue('#subject_tags_table_filter > label > input[type="search"]', tag.value);
      browser
        /**
         * @todo Refactor this click-through to tag edit page into a
         *       helper.
         */
        .click('input[name=doEdit]')
        .waitForPaginationComplete();
      browser.pause(1000);
      browser.click('#editExtIdFrm input[name=doRemove]')
        .waitForPaginationComplete();
      browser.pause(1000);

      /**
       * Confirm tag's value is no longer in the subject's tags table.
       */
      const res = browser.customGetText('#subject_tags_table tbody');
      /* eslint-enable no-unused-expressions */
      /**
       * When a subject only has one tag the `#subject_tags_table`
       * doesn't exist. Instead, an edit for the single tag is
       * populated. Make sure this form's data doesn't match the
       * tag's value.
       */
      if (!res) {
        const response = browser.getValue('#editExtIdFrm input[name=value]');
        /* eslint-disable no-unused-expressions */
        should(response.indexOf(tag.value) === -1).be.ok;
      } else {
        /* eslint-disable no-unused-expressions */
        should(res.indexOf(tag.value) === -1).be.ok;
        /* eslint-enable no-unused-expressions */
      }
    });
  });
});
