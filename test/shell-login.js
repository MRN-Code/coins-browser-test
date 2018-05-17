'use strict';

/**
 * Test shell login and its cookie-passing.
 *
 * Shell login happens via a `wget`-centered bash script on the command line.
 * Therefore, this test uses request instead of a browser.
 *
 * This requires a `shlogin` property in _config/local.json_ to test. Generate
 * it by logging in to COINS' UI and visiting MICIS → Menu → Get
 * Shell-Access-Key, entering your password in the form, and copying the
 * contents of the resulting .key file into configuration:
 *
 *   {
 *     // ...
 *     "shlogin": "FluiZZM5pXi+XCmJ8TmBGA== RYF9DQGlwAw1txSotM4AVA=="
 *     // ...
 *   }
 *
 * {@link https://github.com/MRN-Code/cas/blob/develop/shlogin.php}
 * {@link https://docs.google.com/document/d/1D7106Ax4yeW1kGAfYsWqxXlz9mRz8qMkx96HWACFqR8/edit#}
 */

const config = require('config');
const request = require('request');
const should = require('should');

const scriptURL = `https://${config.origin}/cas/shlogin.php`;

describe('shell login', function shellLoginTest() {
  this.timeout(config.defaultTimeout);

  it('rejects bad requests', (done) => {
    request.post(
      {
        form: {
          // Bogus credentials:
          uk: 'FluiZZM5pXi+XCmJ8TmBGA== RYF9DQGlwAw1txSotM4AVA==',
        },
        url: scriptURL,
      },
      (error, httpResponse) => {
        if (error) {
          throw error;
        }

        httpResponse.statusCode.should.be.aboveOrEqual(400);
        httpResponse.headers.should.not.have.property('set-cookie');

        done();
      }
    );
  });

  it('passes cookie with successful request', (done) => {
    request.post(
      {
        form: {
          uk: config.shlogin,
        },
        url: scriptURL,
      },
      (error, httpResponse, body) => {
        if (error) {
          throw error;
        }

        httpResponse.headers.should.have.property('set-cookie');
        httpResponse.headers['set-cookie']
          .some(c => c.includes('CAS_Auth_User'))
          .should.be.true();
        body.should.equal('LOGGED_IN');
        done();
      }
    );
  });
});
