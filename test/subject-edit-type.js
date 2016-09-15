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

'use strict';

var _ = require('lodash');
var config = require('config');
var client = require('./lib/client.js').client;
var micis = require('./lib/auth/micis.js')(client);
var nav = require('./lib/nav/navigation.js')(client, config);
var should = require('should');

var sampleUrsi = 'M87161657';
var sampleNote = 'Test: ' + Date.now();
var sampleType;

/** These types should not be selected. */
var DISALLOWED_TYPES = ['EXCLUDED', 'WITHDRAWN'];

describe('Edit subject type', function () {
    this.timeout(config.defaultTimeout);

    before('initialize', function (done) {
        client.clientReady.then(function () {
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
                .waitForText('=Study Enrollment')
                .click('=Study Enrollment')
                .waitForPaginationComplete()
                /**
                 * Click a the "Change" button to edit the participant's
                 * study-level details (step 4). Choose "NITEST" as it has
                 * several non-desctructive test subject types.
                 */
                .click(
                    '//td/a[text()="[99-998]: NITEST"]/../..//input[@type="button"]',
                    function (err) {
                        if (err) {
                            throw err;
                        }

                        client.waitForPaginationComplete().call(done);
                    });
        });
    });

    it('should show a study enrollment form', function (done) {
        client.element('#frmChange', function (err) {
                if (err) {
                    throw err;
                }

                client.call(done);
            });
    });
    it('should accept new enrollment type and note', function (done) {
        client.
            /** Select a random 'type' */
            getText('#update_subject_type_id', function (err, res) {
                if (err) {
                    throw err;
                }

                sampleType = _.sample(res.replace(/[^\S\n]/g, '')
                    .split(/\n/)
                    .filter(function (type) {
                        return DISALLOWED_TYPES.indexOf(type) !== -1;
                    }));

                client.selectByVisibleText('#update_subject_type_id', sampleType);
            })
            .setValue('#frmChange textarea[name=notes]', sampleNote)
            .call(done);
    });

    it('should persist subject type, note', function (done) {
        client
            .click('#frmChange input[name=doChangeSubjectType]')
            .waitForPaginationComplete()
            .getText('#update_subject_type_id option:checked', function (err, res) {
                if (err) {
                    throw err;
                }

                should(res === sampleType).be.ok;
            })
            .getValue('#frmChange textarea[name=notes]', function (err, res) {
                if (err) {
                    throw err;
                }

                should(res === sampleNote).be.ok;
            })
            .call(done);
    });
});
