'use strict';

/**
 * Edit a subject's type.
 *
 * Confirm that subject "type" edits and associated "reason for change" notes
 * are persisted. Steps:
 *
 *   1. Go to "Look Up Subject" (MICIS > "Subjects" menu > Look Up a Subject)
 *   2. Enter an URSI to find a single subject
 *   3. Go to "Study Enrollment" tab
 *   4. Click "change" button (to the right) for a study
 *   5. Choose something from "Change Subject Type To:" dropdown
 *   6. Add note in Reason for Change/Disenrollment (text)
 *   7. Click "Update"
 *   8. Confirm changes persisted to form.
 */


const _ = require('lodash');
const config = require('config');
const client = require('./lib/client.js').client;
const micis = require('./lib/auth/micis.js')(client);
const nav = require('./lib/nav/navigation.js')(client, config);
const should = require('should');

const sampleUrsi = 'M87161657';
const sampleNote = `Test: ${Date.now()}`;
let sampleType;

/** These types should not be selected. */
const DISALLOWED_TYPES = ['EXCLUDED', 'WITHDRAWN'];

describe('Edit subject type', function subjectEditType() {
  this.timeout(config.defaultTimeout);

  before('initialize', (done) => {
    client.clientReady.then(() => {
      if (!micis.loggedOn) {
        micis.logon();
      }

      /**
       * Navigate to the appropriate view. This completes steps 1-3.
       */
      nav.micisMenu
          .clickNested('Look Up a Subject')
          .setValue('#ursi', sampleUrsi)
          .click('#frmFindSubject .ui-button-success')
          .waitForPaginationComplete()
          .pause(200)
          .waitForExist('#button-enrollmenteditor') // 'Study Enrollment' button
          .click('#button-enrollmenteditor')
          .waitForPaginationComplete()
          .waitForExist('#multi_enroll_next') // DataTables 'Next' button
          .click('#multi_enroll_next')
          /**
           * Click a the "Change" button to edit the participant's
           * study-level details (step 4). Choose "NITEST" as it has
           * several non-desctructive test subject types.
           */
          .click(
              '//td/a[text()="[99-998]: NITEST"]/../..//form/a',
              (err) => {
                if (err) {
                  throw err;
                }

                client.waitForPaginationComplete().call(done);
              });
    });
  });

  it('should show a study enrollment form', (done) => {
    client.element('#frmChange', (err) => {
      if (err) {
        throw err;
      }

      client.call(done);
    });
  });
  it('should accept new enrollment type and note', (done) => {
    client
      /** Select a random 'type' */
      .getText('#update_subject_type_id', (err, res) => {
        if (err) {
          throw err;
        }

        sampleType = _.sample(res.replace(/[^\S\n]/g, '')
              .split(/\n/)
              .filter(type => DISALLOWED_TYPES.indexOf(type) !== -1));

        client.selectByVisibleText('#update_subject_type_id', sampleType);
      })
      .setValue('#frmChange textarea[name=notes]', sampleNote)
      .call(done);
  });

  it('should persist subject type, note', (done) => {
    client
      .click('#frmChange input[name=doChangeSubjectType]')
      .waitForPaginationComplete()
      .getText('#update_subject_type_id option:checked', (err, res) => {
        if (err) {
          throw err;
        }

        should(res === sampleType).be.ok; // eslint-disable-line no-unused-expressions
      })
      .getValue('#frmChange textarea[name=notes]', (err, res) => {
        if (err) {
          throw err;
        }

        should(res === sampleNote).be.ok; // eslint-disable-line no-unused-expressions
      })
      .call(done);
  });
});
