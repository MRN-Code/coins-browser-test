

const config = require('config');
const should = require('should');

const client = require('./lib/client.js').client;

const auth = require('./lib/auth/micis.js')(client, config);

describe('micis logon', () => {
  this.timeout(config.defaultTimeout);

  before('initialize', (done) => {
        // wait for client to be ready before testing
    client.clientReady.then(done);
  });

  it('should logon', (done) => {
    auth.logon(done);
  });

  it('should set auth cookies', (done) => {
    done();
  });
});

