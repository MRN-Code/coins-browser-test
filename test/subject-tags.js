'use strict';

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
const client = require('./lib/client.js').client;
const micis = require('./lib/auth/micis.js')(client);
const nav = require('./lib/nav/navigation.js')(client, config);
const should = require('should');

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

  before('initialize', (done) => {
    client.clientReady.then(() => {
      if (!micis.loggedOn) {
        micis.logon();
      }

      nav.micisMenu
        .clickNested('Look Up a Subject')
        .setValue('#ursi', sampleUrsi)
        .click('#frmFindSubject .ui-button-success')
        .waitForPaginationComplete()
        .waitForText('=Subject Tags')
        .click('=Subject Tags')
        .waitForPaginationComplete()
        .call(done);
    });
  });

  it('should show a new tags form', (done) => {
    client.element('#addextFrm', (err) => {
      if (err) {
        throw err;
      }

      client.call(done);
    });
  });

  it('should accept new tags', (done) => {
    /**
     * Iterate over `sampleTags`, input properties into the appropriate
     * form elements, and save.
     */
    sampleTags.forEach((tag) => {
      client
        .selectByVisibleText(
          '#addextFrm select[name=subject_tag_id]',
          tag.type
        )
        .setValue('#addextFrm input[name=value]', tag.value)
        .moveToObject('#addextFrm input[value=study]')
        .click('#addextFrm input[value=study]')
        .selectByVisibleText(
          '#addextFrm select[name=tag_study]',
          'NITEST'
        )
        .click('#addextFrm input[type=button]')
        .waitForPaginationComplete();
    });

    client.call(done);
  });

  /**
   * Confirm the freshly created tags exist in subject's tag table.
   */
  it('should save new tags', (done) => {
    client
      .pause(500)
      .getText('#subject_tags_table tbody', (err, res) => {
        if (err) {
          throw err;
        }

        /**
         * Iterate over the table's rows and find those containing
         * data from `sampleTags`.
         */
        const matches = res.split(/\n/).filter(row => sampleTags.some(tag => row.indexOf(tag.type) !== -1 && row.indexOf(tag.value) !== -1));

        /* eslint-disable no-unused-expressions */
        should(matches.length === sampleTags.length).be.ok;
        /* eslint-enable no-unused-expressions */
      })
      .call(done);
  });

  it('should save tag edits', (done) => {
    const tag = sampleTags[0];

    client
      .click(`//td[text()="${tag.value}"]/..//input[@type="button"]`)
      .waitForPaginationComplete()
      /**
       * Warning! The sample tag is mutated. This is helpful for tracking
       * the new value for the remainder of the test.
       */
      .setValue('#editExtIdFrm input[name=value]', tag.value += '_edit')
      .click('#editExtIdFrm input[name=doChange]')
      .waitForPaginationComplete()
      .waitForText('#subject_tags_table tbody', 1000)
      .getText('#subject_tags_table tbody', (err, res) => {
        const hasMatch = res.split(/\n/).some(row => row.indexOf(tag.type) !== -1 && row.indexOf(tag.value) !== -1);

        /* eslint-disable no-unused-expressions */
        should(hasMatch).be.ok;
        /* eslint-enable no-unused-expressions */
      })
      .call(done);
  });

  it('should remove deleted tags', (done) => {
    sampleTags.forEach((tag) => {
      client
        /**
         * @todo Refactor this click-through to tag edit page into a
         *       helper.
         */
        .click(`//td[text()="${tag.value}"]/..//input[@type="button"]`)
        .waitForPaginationComplete()
        .click('#editExtIdFrm input[name=doRemove]')
        .waitForPaginationComplete()
        /**
         * Confirm tag's value is no longer in the subject's tags table.
         */
        .getText('#subject_tags_table tbody', (err, res) => {
          /**
           * When a subject only has one tag the `#subject_tags_table`
           * doesn't exist. Instead, an edit for the single tag is
           * populated. Make sure this form's data doesn't match the
           * tag's value.
           */
          if (err && err.message.indexOf('NoSuchElement') !== -1) {
            client.getValue('#editExtIdFrm input[name=value]', (error, response) => {
              if (error) {
                throw error;
              }

              /* eslint-disable no-unused-expressions */
              should(response.indexOf(tag.value) === -1).be.ok;
              /* eslint-enable no-unused-expressions */
            });
          } else if (err) {
            throw err;
          } else {
            /* eslint-disable no-unused-expressions */
            should(res.indexOf(tag.value) === -1).be.ok;
            /* eslint-enable no-unused-expressions */
          }
        });
    });

    client.call(done);
  });
});
