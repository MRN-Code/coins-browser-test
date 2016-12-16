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

'use strict';

var randomNumber = require('lodash/number/random');
var config = require('config');
var client = require('./lib/client.js').client;
var micis = require('./lib/auth/micis.js')(client);
var nav = require('./lib/nav/navigation.js')(client, config);
var should = require('should');

var sampleUrsi = 'M87161657';
var sampleTags = [{
    type: 'Temporary Subject ID',
    value: 'test_' + Date.now()
}, {
    type: 'U.S. SSN',
    value: randomNumber(1e8, 1e9 - 1) // Random 9-digit number
}];

describe('Add subject tags', function () {
    /**
     * This set of assertions require several page reloads. You may need to
     * adjust the timeout to ~45s.
     */
    this.timeout(config.defaultTimeout);

    before('initialize', function (done) {
        client.clientReady.then(function () {
            if (!micis.loggedOn) {
                micis.logon();
            }

            nav.micisMenu
                .clickNested('Look Up a Subject')
                .setValue('#ursi', sampleUrsi)
                .click('#frmFindSubject .ui-button-success')
                .waitForPaginationComplete()
                .waitForExist('#button-extideditor')
                .click('#button-extideditor')
                .waitForPaginationComplete()
                .call(done);
        });
    });

    it('should show a new tags form', function (done) {
        client.element('#addextFrm', function (err) {
            if (err) {
                throw err;
            }

            client.call(done);
        });
    });

    it('should accept new tags', function (done) {
        /**
         * Iterate over `sampleTags`, input properties into the appropriate
         * form elements, and save.
         */
        sampleTags.forEach(function (tag) {
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
    it('should save new tags', function (done) {
        client
            .pause(500)
            .getText('#subject_tags_table tbody', function (err, res) {
                if (err) {
                    throw err;
                }

                /**
                 * Iterate over the table's rows and find those containing
                 * data from `sampleTags`.
                 */
                var matches = res.split(/\n/).filter(function (row) {
                    return sampleTags.some(function (tag) {
                        return row.indexOf(tag.type) !== -1 && row.indexOf(tag.value) !== -1;
                    });
                });

                should(matches.length === sampleTags.length).be.ok;
            })
            .call(done);
    });

    it('should save tag edits', function (done) {
        var tag = sampleTags[0];

        client
            .click('//td[text()="' + tag.value + '"]/..//input[@type="button"]')
            .waitForPaginationComplete()
            /**
             * Warning! The sample tag is mutated. This is helpful for tracking
             * the new value for the remainder of the test.
             */
            .setValue('#editExtIdFrm input[name=value]', tag.value += '_edit')
            .click('#editExtIdFrm input[name=doChange]')
            .waitForPaginationComplete()
            .waitForText('#subject_tags_table tbody', 1000)
            .getText('#subject_tags_table tbody', function (err, res) {
                var hasMatch = res.split(/\n/).some(function (row) {
                    return row.indexOf(tag.type) !== -1 && row.indexOf(tag.value) !== -1;
                });

                should(hasMatch).be.ok;
            })
            .call(done);
    });

    it('should remove deleted tags', function (done) {
        sampleTags.forEach(function (tag) {
            client
                /**
                 * @todo Refactor this click-through to tag edit page into a
                 *       helper.
                 */
                .click('//td[text()="' + tag.value + '"]/..//input[@type="button"]')
                .waitForPaginationComplete()
                .click('#editExtIdFrm input[name=doRemove]')
                .waitForPaginationComplete()
                /**
                 * Confirm tag's value is no longer in the subject's tags table.
                 */
                .getText('#subject_tags_table tbody', function (err, res) {
                    /**
                     * When a subject only has one tag the `#subject_tags_table`
                     * doesn't exist. Instead, an edit for the single tag is
                     * populated. Make sure this form's data doesn't match the
                     * tag's value.
                     */
                    if (err && err.message.indexOf('NoSuchElement') !== -1) {
                        client.getValue('#editExtIdFrm input[name=value]', function (err, res) {
                            if (err) {
                                throw err;
                            }

                            should(res.indexOf(tag.value) === -1).be.ok;
                        });
                    } else if (err) {
                        throw err;
                    } else {
                        should(res.indexOf(tag.value) === -1).be.ok;
                    }
                });
        });

        client.call(done);
    });
});
