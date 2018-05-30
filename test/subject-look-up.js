'use strict';

/* globals browser should */

/**
 * Test the 'Look Up a Subject' feature.
 */

const config = require('config');
const micis = require('./lib/auth/micis.js')(browser);
const nav = require('./lib/nav/navigation.js')(browser, config);

describe('subject look up', function subjectLookUp() {
  this.timeout(config.defaultTimeout);

  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav.micisMenu.clickNested('Look Up a Subject');
  });

  /** Test the 'email' field's search functionality */
  it('should show results for email lookup', () => {
    /** Known test user on NITEST study */
    const testUser = {
      firstName: 'Icare',
      lastName: 'Test',
      email: 'icaretestursi@mrn.org',
    };

    browser
      .setValue('#email', testUser.email)
      .click('#frmFindSubject .ui-button-success')
      .waitForPaginationComplete()
      .waitForExist('.box-container .dataTables_scrollBody', 4000);
    const text = browser.getText('.box-container .dataTables_scrollBody > table tr:nth-child(1)');
    should( // eslint-disable-line no-unused-expressions
      text.indexOf(testUser.firstName) !== -1 &&
      text.indexOf(testUser.lastName) !== -1
    ).be.ok;
  });
});
