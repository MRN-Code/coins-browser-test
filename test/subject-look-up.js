'use strict';

/* globals browser should */

/**
 * Test the 'Look Up a Subject' feature.
 */

const micis = require('./lib/auth/micis.js')(browser);
const nav = require('./lib/nav/navigation.js')(browser);

const sampleData = browser.options.testData.subjectLookUp;

describe('subject look up', () => {
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav.micisMenu.clickNested('Look Up a Subject');
  });

  /** Test the 'email' field's search functionality */
  it('should show results for email lookup', () => {
    browser
      .setValue('#email', sampleData.testUser.email)
      .click('#frmFindSubject .ui-button-success')
      .waitForPaginationComplete()
      .waitForExist('.box-container .dataTables_scrollBody', 4000);
    const text = browser.getText('.box-container .dataTables_scrollBody > table tr:nth-child(1)');
    should( // eslint-disable-line no-unused-expressions
      text.indexOf(sampleData.testUser.firstName) !== -1 &&
      text.indexOf(sampleData.testUser.lastName) !== -1
    ).be.ok;
  });
});
