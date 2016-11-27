'use strict';

const _ = require('lodash');
const config = require('config');
const should = require('should');

const client = require('./lib/client.js').client;
const nav = require('./lib/nav/navigation.js')(client, config);
const subject = require('./lib/subject.js')(client, config);

const micis = require('./lib/auth/micis.js')(client);

describe('subject', function subjectAdd() {
  this.timeout(config.defaultTimeout);

  before('initialize', (done) => {
    client.clientReady.then(() => {
      if (!micis.loggedOn) {
        micis.logon();
      }
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
      client.call(done);
    });

    it('should generate an URSI prefix', (done) => {
      client.getText('#ursi_prefix_preview_prefix', (err, text) => {
        text.trim().should.equal('M871');
        done();
      });
    });

    it('should not have a hidden subject type ("Special") as a subject type', (done) => {
      client.selectByVisibleText('#subject_type_id', 'Special', (err) => {
        if (!err) {
          (false).should.be.ok();
        }
        done();
      });
      // test good and bogus values pre submit
      // submit
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
    it('should be submittable', (done) => {
      subject.new.handleSubjectMatchesAddNew(done);
    });
  });
});

describe('subject lookup', function subjectAddLookup() {
  this.timeout(config.defaultTimeout);

  before('initialize', (done) => {
    client.clientReady
      .then(() => {
        if (!micis.loggedOn) { micis.logon(); }
        if (_.isEmpty(subject.new.newUrsis)) {
          throw new Error('ursis must have been added to lookup existing subject');
        }
        return client.call(done);
      });
  });

  it('should be able to lookup ursi just added', (done) => {
    const ursi = subject.new.newUrsis[0];
    nav.micisMenu.clickNested('Look Up a Subject');
    subject.lookup.existing(ursi, done);
  });
});
