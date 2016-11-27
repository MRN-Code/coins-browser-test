'use strict';

const config = require('config');
const should = require('should');

const client = require('./lib/client.js').client;
const study = require('./lib/study.js')(client, config);
const micis = require('./lib/auth/micis.js')(client);

const tempTagId = `testTag_${Date.now()}`;

describe('study', function studyTest() {
  this.timeout(config.defaultTimeout);

  before('initialize', (done) => {
    client.clientReady.then(() => {
      if (!micis.loggedOn) {
        micis.logon();
      }
      client.call(done);
    });
  });

  describe('list studies form', () => {
    it('should be accessible', (done) => {
      study.goToView('NITEST').call(done);
    });
  });

  describe('view subjects pages', () => {
    it('should be able to view subjects', (done) => {
      study.goToView('NITEST');
      study.view.subjects();
      client.call(done);
    });

    it('should be able to view subject details', (done) => {
      study.view.subjectDetails('M06158639')
        .waitForPaginationComplete()
        .call(done);
    });

    it('should be able to add a global subject tag', (done) => {
      study.view.subjectDetails
        .addTag(tempTagId, 'Temporary Subject ID', 'global')
        .moveToObject(`[value="${tempTagId}"]`) // asserts that new tag made it
        .call(done);
    });

    it('should be able to edit a global subject tag', (done) => {
      const newTag = `${tempTagId}-2`;
      client
        .isVisible(`[value="${tempTagId}"]`, (err, exists) => {
          // test if tag is in page or in table
          if (exists) {
            return;
          }
          return client // eslint-disable-line consistent-return
            .click(`//*[contains(text(), "${tempTagId}")]//..//form//input[@value="Edit"]`)
            .waitForPaginationComplete();
        })

        // use XPATH selector because of usage of hidden 'previous_value' nodes with
        // same characteristics :(
        .setValue('//*[contains(text(), "Subject Tag Value")]//..//input', newTag)

        .click('#editExtIdFrm [name="doChange"]') // TODO move these out of test file
        .waitForPaginationComplete()
        .isVisible(`[value="${newTag}"]`, (err, exists) => {
          // test if the newTag is on page or in table
          if (exists) {
            return;
          }
          return client // eslint-disable-line consistent-return
            .click(`//*[contains(text(), "${newTag}")]//..//form//input[@value="Edit"]`)
            .waitForPaginationComplete();
        })
        .call(done);
    });
  });
});
