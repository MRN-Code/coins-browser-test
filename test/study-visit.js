'use strict';

/* globals browser */

// Tests adding and editing a study visit

const study = require('./lib/study.js')(browser);
const micis = require('./lib/auth/micis.js')(browser);

const sampleData = browser.options.testData.studyVisit;

describe('study visit', () => {
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    study
      .goToView(sampleData.study)
      .click('[data-hook="edit-study-visits"]');
    browser
      .waitForPaginationComplete();
  });

  describe('add study visit', () => {
    it('should accept new visit values', () => {
      study.view.visits
        .fillOutForm({
          data: sampleData.sampleVisitData,
          mode: 'add',
        });
    });
    it('should save new visit values', () => {
      // An array representation for comparison
      const row = ['label', 'timeFromBaseline', 'timeUnit', 'segmentInterval']
        .map((key) => {
          let value = '';
          if (key in sampleData.sampleVisitData) {
            value = sampleData.sampleVisitData[key];
          }
          return value;
        });
      browser.pause(3000);

      study.view.visits.submitForm().waitForPaginationComplete();

      study.view.visits                           // eslint-disable-line no-unused-expressions
        .visitTableContainsRow(row).should.be.ok; // eslint-disable-line no-unused-expressions
    });
  });
  describe('edit study visit', () => {
    it('should have an edit visit form', () => {
      browser.pause(3000);
      const segmentInt = sampleData.sampleVisitData.segmentInterval;
      study.view.visits
        .navigateToEditPage(segmentInt)
        .waitForPaginationComplete();
      const res = browser.isExisting('#frmUpdate');
      if (!res) {
        throw new Error(`Visit ${segmentInt} edit form doesn't exist.`);
      }
    });
    it('should accept edited visit values', () => {
      study.view.visits
        .fillOutForm({
          data: sampleData.editVisitData,
          mode: 'update',
        });
    });
    it('should save edited visit values', () => {
      const row = ['label', 'timeFromBaseline', 'timeUnit']
        .map((key) => {
          let value = '';
          if (key in sampleData.editVisitData) {
            value = sampleData.editVisitData[key];
          }
          return value;
        });

      study.view.visits
        .submitForm()
        .waitForPaginationComplete();
      study.view.visits                             // eslint-disable-line no-unused-expressions
          .visitTableContainsRow(row).should.be.ok; // eslint-disable-line no-unused-expressions
    });
  });
});
