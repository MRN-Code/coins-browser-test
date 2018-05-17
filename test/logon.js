'use strict';

/* globals browser */

const config = require('config');

const auth = require('./lib/auth/micis.js')(browser, config);

describe('micis logon', function logon() {
  this.timeout(config.defaultTimeout);

  it('should logon', () => {
    auth.logon();
  });
});
