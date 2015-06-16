// Tests adding and editing a study visit

'use strict';

var config = require('config');
var should = require('should');
var client = require('./lib/client.js').client;
var study = require('./lib/study.js')(client, config);
var micis = require('./lib/auth/micis.js')(client);

var sampleVisitData = {
    label: 'Test Label 1',
    timeFromBaseline: 1,
    timeUnit: 'Week',
    segmentInterval: 'test_' + (new Date()).getTime()
};
var editVisitData = {
    label: 'Test Label 2',
    timeFromBaseline: 2,
    timeUnit: 'Month'
};

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
            study.view.visits
                .fillOutForm({
                    data: sampleVisitData,
                    mode: 'add'
                })
                .call(done);
        });
        it('should save new visit values', function (done) {
            // An array representation for comparison
            var row = ['label', 'timeFromBaseline', 'timeUnit', 'segmentInterval']
                .map(function (key) {
                    var value = '';
                    if (key in sampleVisitData) {
                        value = sampleVisitData[key];
                    }
                    return value;
                });

            study.view.visits.submitForm().waitForPaginationComplete();
            study.view.visits
                .visitTableContainsRow(row, function (containsRow) {
                    containsRow.should.be.ok;
                    client.call(done);
                });
        });
    });
    describe('edit study visit', function () {
        it('should have an edit visit form', function (done) {
            var segmentInt = sampleVisitData.segmentInterval;
            study.view.visits
                .navigateToEditPage(segmentInt)
                .waitForPaginationComplete()
                .isExisting('#frmUpdate', function (err, res) {
                    if (err || !res) {
                        throw new Error('Visit ' + segmentInt + ' edit form doesn\'t exist.');
                    }
                })
                .call(done);
        });
        it('should accept edited visit values', function (done) {
            study.view.visits
                .fillOutForm({
                    data: editVisitData,
                    mode: 'update'
                })
                .call(done);
        });
        it('should save edited visit values', function (done) {
            var row = ['label', 'timeFromBaseline', 'timeUnit']
                .map(function (key) {
                    var value = '';
                    if (key in editVisitData) {
                        value = editVisitData[key];
                    }
                    return value;
                });

            study.view.visits
                .submitForm()
                .waitForPaginationComplete();
            study.view.visits
                .visitTableContainsRow(row, function (containsRow) {
                    containsRow.should.be.ok;
                    client.call(done);
                });
        });
    });
});
