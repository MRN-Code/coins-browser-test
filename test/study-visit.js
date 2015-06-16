// Tests adding and editing a study visit

'use strict';

var config = require('config');
var should = require('should');
var client = require('./lib/client.js').client;
var study = require('./lib/study.js')(client, config);
var micis = require('./lib/auth/micis.js')(client);

// var currentTime = (new Date()).getTime();
var sampleVisitData = {
    label: 'Test Label 1',
    timeFromBaseline: 1,
    timeUnit: 'Week',
    segmentInterval: 'test_' + (new Date()).getTime()
};
// var editVisitData = {
//     label: 'Test Label 2',
//     timeFromBaseline: 2,
//     timeUnit: 'Month'
// };

describe('study visit', function () {
    this.timeout(config.defaultTimeout);

    before('initialize', function (done) {
        client.clientReady.then(function () {
            if (!micis.loggedOn) {
                micis.logon();
            }

            study
                .goToView('NITEST')
                .click('[data-hook="edit-study-visits"]');
            client
                .waitForPaginationComplete()
                .call(done);
        });
    });

    describe('add study visit', function () {
        it('should accept new visit values', function (done) {
            study.view.visits.fillOutForm(sampleVisitData).call(done);
        });
        it('should save new visit values', function (done) {
            // A string for comparison
            var visitDataCompare = ['label', 'timeFromBaseline', 'timeUnit', 'segmentInterval']
                .map(function (key) {
                    var value = '';
                    if (key in sampleVisitData) {
                        value = sampleVisitData[key];
                    }
                    return value;
                }).join('').replace(/\s/g, '').toLowerCase();

            study.view.visits.submitForm();

            client
                .waitForPaginationComplete()
                // Check for table's population with `tbody tr` in the selector
                .isExisting('.box-container > table tbody tr', function (err, res) {
                    if (err || !res) {
                        throw new Error('Study visits table should exist.');
                    }
                })
                .getText('.box-container > table', function (err, res) {
                    if (err) {
                        throw err;
                    } else if (!res) {
                        throw new Error('Study visits table doesn\'t contain any visits.');
                    }

                    var newVisitDataExists = res
                        .toLowerCase()
                        .replace(/edit|[^\S\n]/g, '') // Remove 'Edit' button text and whitespace
                        .split(/\n/)
                        .some(function (row) {
                            return row.indexOf(visitDataCompare) !== -1;
                        });

                    newVisitDataExists.should.be.ok;
                })
                .call(done);
        });
    });
    describe('edit study visit', function () {
        it('should have an edit visit form');
        it('should accept edited visit values');
        it('should save edited visit values');
    });
});
