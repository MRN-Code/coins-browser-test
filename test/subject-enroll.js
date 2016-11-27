'use strict';

const config = require('config');
const should = require('should');

const client = require('./lib/client.js').client;
const nav = require('./lib/nav/navigation.js')(client, config);
const subject = require('./lib/subject.js')(client, config);

const micis = require('./lib/auth/micis.js')(client);

describe('subject enroll', function subjectEnroll() {
  this.timeout(config.defaultTimeout);

  before('initialize', (done) => {
    client.clientReady.then(() => {
      if (!micis.loggedOn) { micis.logon(); }
      client.call(done);
    });
  });

  describe('enroll existing subject', () => {
    it('should be accessible', (done) => {
      nav.micisMenu
        .clickNested('Enroll an Existing Subject')
        .call(done);
    });

    it('should lookup an existing URSI (NITEST URSI M06158639 >> BIOMARKERS)', (done) => {
      subject.enroll.prepExisting('M06158639');
      subject.enroll.submitExisting(done);
    });
  });
});
