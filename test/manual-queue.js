'use strict';

/* globals browser */

const nav = require('./lib/nav/navigation')(browser);
const micis = require('./lib/auth/micis')(browser);

// const sampleData = browser.options.testData.manualQueue.js;
const sampleData = {
  defaultStudyId: 2,
  ursi: 'M00104405',
  subjectId: '3001',
  noVisit: 'Visit 2',
};

describe('Test manual queues', () => {
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
  });

  it('should load asmt and select study', () => {
    nav.gotoAsmt();
    nav.selectAsmtStudy(sampleData.defaultStudyId);
  });

  it('should open subject queues', () => {
    nav.asmtMenu.clickNested('Manage Subject Queues');
    browser.setValue('#ursi', sampleData.ursi).waitForPaginationComplete();
    browser.selectByVisibleText('#source_type', 'Proband/Subject').waitForVisible('#subject_id');
    browser.getValue('#subject_id').should.be.equal(sampleData.subjectId);
  });

  it('should make sure V2 is hidden', () => {
    browser.getText('#segmentIntervalId').should.not.containEql(sampleData.noVisit);
  });
  it('should select V3 and drag template', () => {
    browser.selectByValue('#segmentIntervalId', 15).waitForVisible('#saveQueue');
    browser.dragAndDrop('ul li[data-template_id=\'1\'] div.dragHandle', '#queueLabel');
    browser.pause(5000);
  });

  it('should drag and drop the instrument', () => {
    // #instList > li:nth-child(2) > div
  });
});
