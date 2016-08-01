/* jshint expr: true */
/* global coinsUtils */

/**
 * Study subject types.
 *
 * Test editing subject types on a study-wide level. Step-by-step directions:
 *
 * 1. Log in to MICIS
 * 2. Go to “Studies” > ”List Studies”
 * 3. Search for “NITEST” and select it
 * 4. Click the “Edit Subject Types” button
 * 5. Click the “Edit” button next to the “MK” subject type in the table
 * 6. Change the type’s name and description
 * 7. Click the “Continue >” button
 * 8. Confirm success message
 * 9. Go back to NITEST’s “Edit Subject Types” page
 * 10. Confirm name change in table.
 * 11. Undo edit???
 */

'use strict';

var config = require('config');
var client = require('./lib/client.js').client;
var micis = require('./lib/auth/micis.js')(client);
var should = require('should'); // jshint ignore:line
var study = require('./lib/study.js')(client, config);

/**
 * Target subject type label.
 *
 * This is the subject type 'label' that will be targetted and modified in this
 * test.
 *
 * @const {string}
 */
var targetSubjectTypeLabel = 'Testing';

/**
 * Test subject type values.
 *
 * @type {Object}
 */
var testSubjectType = {
  label: Math.random().toString(),
  description: Math.random().toString(),
};

/**
 * Get subject type edit link selector.
 *
 * @param {string} text
 * @returns {string} XPath selector
 */
function getEditLinkSelector(text) {
    return '//td[text()="' + text + '"]/../td/a';
}

/**
 * Find notify item.
 *
 * @param {string} label
 * @returns {(string|undefined)}
 */
function findNotifyItem(label) {
    if (
        'notify' in coinsUtils &&
        'queue' in coinsUtils.notify &&
        Array.isArray(coinsUtils.notify.queue)
    ) {
        var item = coinsUtils.notify.queue.find(function findItem(item) {
            return item.body.indexOf(label) > -1;
        });

        if (item) {
            return item.body;
        }
    }
}

describe('Edit study subject type', function editStudySubjectType() {
    /**
     * Description control selector for the 'edit subject type' form.
     *
     * @const {string}
     */
    var descriptionSelector = 'textarea[name=description]';

    /**
     * Label (name) control selector for the 'edit subject type' form.
     *
     * @const {string}
     */
    var labelSelector = 'input[name=label]';

    this.timeout(config.defaultTimeout);

    before('initialize', function initialize(done) {
        client.clientReady.then(function clientReadyCallback() {
            if (!micis.loggedOn) {
                micis.logon();
            }

            study
                .goToView('NITEST')
                .waitForPaginationComplete()
                .call(done);
        });
    });

    it('should navigate to types list', function navigateToTypesList(done) {
        client
            .click('input[value="Edit Subject Types"]')
            .waitForPaginationComplete()
            .call(done);
    });

    it('should edit a subject type', function editSubjectType(done) {
        var linkSelector = getEditLinkSelector(targetSubjectTypeLabel);

        client
            .click(linkSelector)
            .waitForPaginationComplete()
            .setValue(labelSelector, testSubjectType.label)
            .setValue(descriptionSelector, testSubjectType.description)
            .click('input[type=button][name=DoUpdate]')
            .waitForPaginationComplete()
            .execute(
                findNotifyItem,
                testSubjectType.label,
                function validateConfirmMessage(err, res) {
                    var text = res.value;

                    if (err) {
                        throw err;
                    }

                    text.should.match(new RegExp(testSubjectType.label));
                }
            )
            .call(done);
    });

    it(
        'should reflect changes in list and form',
        function reflectChangesInList(done) {
            var linkSelector = getEditLinkSelector(testSubjectType.label);

            study
                .goToView('NITEST')
                .waitForPaginationComplete()
                .click('input[value="Edit Subject Types"]')
                .waitForPaginationComplete()
                .getText(
                    '.box-container .coins-datatable',
                    function validateList(err, text) {
                        if (err) {
                            throw err;
                        }

                        text.should.match(new RegExp(testSubjectType.label));
                    }
                )
                .click(linkSelector)
                .waitForPaginationComplete()
                .getValue(
                    labelSelector,
                    function validateLabelControl(err, value) {
                        if (err) {
                            throw err;
                        }

                        value.should.be.equal(testSubjectType.label);
                    }
                )
                .getValue(
                    descriptionSelector,
                    function validateDescriptionControl(err, value) {
                        if (err) {
                            throw err;
                        }

                        value.should.be.equal(testSubjectType.description);
                    }
                )
                .call(done);
        }
    );

    it('should reset subject type', function resetSubjectType(done) {
        client
            .setValue(labelSelector, targetSubjectTypeLabel)
            .setValue(descriptionSelector, targetSubjectTypeLabel)
            .click('input[type=button][name=DoUpdate]')
            .waitForPaginationComplete()
            .execute(
                findNotifyItem,
                targetSubjectTypeLabel,
                function validateConfirmMessage(err, res) {
                    var text = res.value;

                    if (err) {
                        throw err;
                    }

                    text.should.match(new RegExp(targetSubjectTypeLabel));
                }
            )
            .call(done);
    });
});
