'use strict';

/* globals browser */

const auth = require('./lib/auth/micis.js')(browser);

describe('micis logon', () => {
  it('should logon', () => {
    auth.logon();
  });
});
