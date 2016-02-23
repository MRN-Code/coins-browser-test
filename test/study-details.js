/**
 * Confirm study details pages load and display appropriate content.
 */

'use strict';

var config = require('config');
var client = require('./lib/client').client;
var study = require('./lib/study')(client, config);
var micis = require('./lib/auth/micis')(client);
var should = require('should');
var noop = require('lodash/utility/noop');

/**
 * Navigate to a single study.
 *
 * This rolls re-used navigation to the "NITEST" study into a reusable function.
 *
 * @todo  Roll this into reusable lib.
 *
 * @param  {function}  cb Callback fired after navigation completes
 * @return {undefined}
 */
var navigateToSingleStudy = function (cb) {
    cb = cb instanceof Function ? cb : noop;

    study.goToView('NITEST').waitForPaginationComplete().call(cb);
};

describe('Study details', function () {
    this.timeout(config.defaultTimeout);

    before('initialize', function (done) {
        client.clientReady.then(function () {
            if (!micis.loggedOn) {
                micis.logon();
            }

            client.call(done);
        });
    });

    /**
     * Ensure that the subject trackers CRM app loads. This requires fetching
     * lots of data for the server, so `waitForExist` with a long timeout is
     * employed.
     */
    describe('subject trackers', function () {
        before(navigateToSingleStudy);

        it('should navigate to subject tracker', function (done) {
            client
                .click('input[data-hook=subject-tracker-button]')
                .waitForVisible('.ui-dialog', 100, function (err, res) {
                    if (res) {
                        client.click('.ui-dialog .ui-button-success');
                    }

                    client.call(done);
                });
        });
        it('should show subject tracker', function (done) {
            client
                .waitForPaginationComplete()
                .waitForExist('#tracker-study-subject-details tbody tr', 3500, function (err) {
                    if (err) {
                        throw err;
                    }
                })
                .call(done);
        });
        it('should display subject rows', function (done) {
            client
                .waitForExist('#tracker-study-subject-details tbody tr', 4000, function (err) {
                    if (err) {
                        throw err;
                    }
                })
                .elements('#tracker-study-subject-details tbody tr', function (err, res) {
                    if (err) {
                        throw err;
                    }

                    should(res.value.length).be.above(0);
                })
                .call(done);
        });
    });

    /**
     * Ensure the view subjects table exists and loads.
     */
    describe('view subjects', function () {
        before(navigateToSingleStudy);

        it('should navigate to view subjects page', function (done) {
            client
                .click('input[data-hook=view-subjects-btn]')
                .waitForPaginationComplete()
                .call(done);
        });

        it('should display subjects in a table', function (done) {
            client
                .waitForExist('.dataTables_scrollBody tr', 500)
                .elements('.dataTables_scrollBody tr', function (err, res) {
                    if (err) {
                        throw err;
                    }

                    /**
                     * The subjects table should have subjects in it,
                     * represented by this `table`'s `tr`s.
                     */
                    should(res.value.length).be.above(0);
                })
                .call(done);
        });
    });

    /**
     * Ensure the study access table exists and loads.
     */
    describe('list study access', function () {
        before(navigateToSingleStudy);

        it('should navigate to study access page', function (done) {
            client
                .click('#frmAccess input[type=button]')
                .waitForPaginationComplete()
                .call(done);
        });

        it('should display', function (done) {
            client
                .elements('.box-container > table tr', function (err, res) {
                    if (err) {
                        throw err;
                    }

                    /**
                     * Confirm the user access table has rows. The first row
                     * functions as column headings, so the number of rows
                     * should be greater than 1.
                     */
                    should(res.value.length).be.above(1);
                })
                .call(done);
        });
    });
});
