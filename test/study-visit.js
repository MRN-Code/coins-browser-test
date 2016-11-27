'use strict';

// Tests adding and editing a study visit

const config = require('config');
const should = require('should');
const client = require('./lib/client.js').client;
const study = require('./lib/study.js')(client, config);
const micis = require('./lib/auth/micis.js')(client);

const sampleVisitData = {
  label: 'Test Label 1',
  timeFromBaseline: 1,
  timeUnit: 'Week',
  segmentInterval: `test_${(new Date()).getTime()}`,
};
const editVisitData = {
  label: 'Test Label 2',
  timeFromBaseline: 2,
  timeUnit: 'Month',
};

describe('study visit', function studyVisit() {
  this.timeout(config.defaultTimeout);

  before('initialize', (done) => {
    client.clientReady.then(() => {
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

  describe('add study visit', () => {
    it('should accept new visit values', (done) => {
      study.view.visits
        .fillOutForm({
          data: sampleVisitData,
          mode: 'add',
        })
        .call(done);
    });
    it('should save new visit values', (done) => {
      // An array representation for comparison
      const row = ['label', 'timeFromBaseline', 'timeUnit', 'segmentInterval']
        .map((key) => {
          let value = '';
          if (key in sampleVisitData) {
            value = sampleVisitData[key];
          }
          return value;
        });

      study.view.visits.submitForm().waitForPaginationComplete();
      study.view.visits
        .visitTableContainsRow(row, (containsRow) => {
          containsRow.should.be.ok; // eslint-disable-line no-unused-expressions
          client.call(done);
        });
    });
  });
  describe('edit study visit', () => {
    it('should have an edit visit form', (done) => {
      const segmentInt = sampleVisitData.segmentInterval;
      study.view.visits
        .navigateToEditPage(segmentInt)
        .waitForPaginationComplete()
        .isExisting('#frmUpdate', (err, res) => {
          if (err || !res) {
            throw new Error(`Visit ${segmentInt} edit form doesn't exist.`);
          }
        })
        .call(done);
    });
    it('should accept edited visit values', (done) => {
      study.view.visits
        .fillOutForm({
          data: editVisitData,
          mode: 'update',
        })
        .call(done);
    });
    it('should save edited visit values', (done) => {
      const row = ['label', 'timeFromBaseline', 'timeUnit']
        .map((key) => {
          let value = '';
          if (key in editVisitData) {
            value = editVisitData[key];
          }
          return value;
        });

      study.view.visits
        .submitForm()
        .waitForPaginationComplete();
      study.view.visits
        .visitTableContainsRow(row, (containsRow) => {
          containsRow.should.be.ok; // eslint-disable-line no-unused-expressions
          client.call(done);
        });
    });
  });
});
