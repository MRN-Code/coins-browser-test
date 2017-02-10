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

  describe('add subject form', () => {
    it('should be accessible', (done) => {
      nav.micisMenu
        .clickNested('Enter a New Subject')
        .call(done);
    });

    it('should be fill-out-able', (done) => {
      // fill form
      subject.new.fillForm();

      // Change study id
      client.selectByValue('#study_id', 7640); // Smoking

      client.call(done);
    });

    it('should be submittable', (done) => {
      subject.new.submit(done);
    });
  });

  describe('verify subject form', () => {
    it('should be submittable', (done) => {
      subject.new.verify(done);
    });
  });

  describe('handle new subject matches form', () => {
    it('should be enroll with existing subject', (done) => {
      subject.new.handleSubjectMatchesExisting(done);
    });
  });
});
