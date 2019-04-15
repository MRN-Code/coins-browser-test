'use strict';

/* globals browser downloadDir*/

/**
 * Test get billing report.
 *
 * Steps:
 *
 *   1. Navigate to Billing report from (MICIS > Billing > Belling report)
 *   2. Fill out form with some sample data
 *   3. Click Get Report
 *   4. Watch for downloaded file.
 */
const nav = require('./lib/nav/navigation')(browser);
const micis = require('./lib/auth/micis')(browser);
const fs = require('fs');

const sampleData = {
  startDate: '03/25/2019',
  endDate: '03/25/2019',
};

let numberOfFiles;

describe('Get billing report', () => {
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav.micisMenu.clickNested('Billing Report');
  });
  it('should show Get Report button', () => {
    browser.element('#get_report').should.be.ok;// eslint-disable-line no-unused-expressions
  });
  it('should fill form and click Get Report', () => {
    browser
        .setValue('#exp_after', sampleData.startDate)
        .setValue('#exp_before', sampleData.endDate)
        .click('#page-container > div.boxHeader > span'); // to close the buggy calender
  });
  it('should click Get Report and watch for download file', () => {
    // Initialize watcher.
    fs.readdir(downloadDir, (err, files) => {
      numberOfFiles = files.length;
    });
    browser.click('#get_report').waitForPaginationComplete();
    browser.pause(3000);
    fs.readdir(downloadDir, (err, files) => {
      numberOfFiles = files.length - numberOfFiles;
    });
    numberOfFiles.should.be.equals(1);
    // TODO : should open the file and verify data
  });
});
