'use strict';

/**
 * Test the 'Look Up a Subject' feature.
 */

const config = require('config');
const client = require('./lib/client.js').client;
const micis = require('./lib/auth/micis.js')(client);
const nav = require('./lib/nav/navigation.js')(client, config);
const should = require('should');

describe('subject look up', function subjectLookUp() {
  this.timeout(config.defaultTimeout);

  before('initialize', (done) => {
    client.clientReady.then(() => {
      if (!micis.loggedOn) {
        micis.logon();
      }

      nav.micisMenu.clickNested('Look Up a Subject').call(done);
    });
  });

    /** Test the 'email' field's search functionality */
  it('should show results for email lookup', (done) => {
    /** Known test user on NITEST study */
    const testUser = {
      firstName: 'Icare',
      lastName: 'Test',
      email: 'icaretestursi@mrn.org',
    };

    client
      .setValue('#email', testUser.email)
      .click('#frmFindSubject .ui-button-success')
      .waitForPaginationComplete()
      .waitFor('.box-container .dataTables_scrollBody', 4000)
      .getText(
        '.box-container .dataTables_scrollBody > table tr:nth-child(1)',
        (err, text) => {
          if (err) {
            throw err;
          }

          should( // eslint-disable-line no-unused-expressions
            text.indexOf(testUser.firstName) !== -1 &&
            text.indexOf(testUser.lastName) !== -1
          ).be.ok;
        }
      )
      .call(done);
  });
});
