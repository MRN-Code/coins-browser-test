'use strict';

/* globals browser should*/

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
const hideZendeskWidget = require('./lib/hide-zendesk-widget.js');
const micis = require('./lib/auth/micis.js')(browser);
const nav = require('./lib/nav/navigation.js')(browser);

const sampleUrsi = 'M87161657';
const sampleNote = `Test: ${Date.now()}`;
let sampleType;

/** These types should not be selected. */
const DISALLOWED_TYPES = ['EXCLUDED', 'WITHDRAWN'];

describe('Edit subject type', () => {
  before('initialize', () => {
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
      .pause(200);
    browser.waitForExist('#button-enrollmenteditor'); // 'Study Enrollment' button
    browser.click('#button-enrollmenteditor')
      .waitForPaginationComplete()
      // Uncomment if `sampleUrsi` appears in the second DataTables page:
      // .waitForExist('#multi_enroll_next') // DataTables 'Next' button
      // .click('#multi_enroll_next')
      .execute(hideZendeskWidget);
    /**
     * Click a the "Change" button to edit the participant's
     * study-level details (step 4). Choose "NITEST" as it has
     * several non-desctructive test subject types.
     */
    browser.click('//td/a[text()="NITEST"]/../..//form/a')
      .waitForPaginationComplete();
  });

  it('should show a study enrollment form', () => {
    const elem = browser.element('#frmChange');
    elem.should.be.ok;// eslint-disable-line no-unused-expressions
  });
  it('should accept new enrollment type and note', () => {
    const res = browser
      /** Select a random 'type' */
      .getText('#update_subject_type_id');
    sampleType = _.sample(res.replace(/[^\S\n]/g, '')
      .split(/\n/)
      .filter(type => DISALLOWED_TYPES.indexOf(type) !== -1));
    browser.selectByVisibleText('#update_subject_type_id', sampleType)
      .setValue('#frmChange textarea[name=notes]', sampleNote);
  });

  it('should persist subject type, note', () => {
    const res = browser
      .click('#frmChange input[name=doChangeSubjectType]')
      .waitForPaginationComplete()
      .getText('#update_subject_type_id option:checked');
    should(res === sampleType).be.ok; // eslint-disable-line no-unused-expressions

    const value = browser.getValue('#frmChange textarea[name=notes]');

    should(value === sampleNote).be.ok; // eslint-disable-line no-unused-expressions
  });
});
