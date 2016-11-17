

/**
 * Test the 'Look Up a Subject' feature.
 */

let config = require('config');
let client = require('./lib/client.js').client;
let micis = require('./lib/auth/micis.js')(client);
let nav = require('./lib/nav/navigation.js')(client, config);
let should = require('should');

describe('subject look up', function () {
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
        let testUser = {
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

                  should(
                        text.indexOf(testUser.firstName) !== -1 &&
                        text.indexOf(testUser.lastName) !== -1,
                    ).be.ok;
                },
            )
            .call(done);
    });
});
