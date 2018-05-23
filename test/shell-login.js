'use strict';

/* globals browser */

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

const scriptURL = `https://${config.origin}/cas/shlogin.php`;
let resp = null;
let respBody = null;

function postData(credentials) {
  return new Promise((resolve, reject) => {
    request.post({
      form: {
        uk: credentials,
      },
      url: scriptURL,
    },
      (error, httpResponse, body) => {
        if (error) {
          reject();
        }
        resp = httpResponse;
        respBody = body;
        resolve();
      });
  });
}

describe('shell login', function shellLoginTest() {
  this.timeout(config.defaultTimeout);
  it('rejects bad requests', () => {
    // Bogus credentials:
    const uk = 'FluiZZM5pXi+XCmJ8TmBGA== RYF9DQGlwAw1txSotM4AVA==';
    browser.call(() => postData(uk));
    resp.statusCode.should.be.aboveOrEqual(400);
    resp.headers.should.not.have.property('set-cookie');
  });

  it('passes cookie with successful request', () => {
    browser.call(() => postData(config.shlogin));
    resp.headers.should.have.property('set-cookie');
    resp.headers['set-cookie']
      .some(c => c.includes('CAS_Auth_User'))
      .should.be.true();
    respBody.should.equal('LOGGED_IN');
  });
});
