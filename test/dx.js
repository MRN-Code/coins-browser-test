'use strict';

// Test for Data Exchange

const config = require('config');
const client = require('./lib/client').client;
const nav = require('./lib/nav/navigation')(client, config);
const micis = require('./lib/auth/micis')(client);
const should = require('should');

describe('Test data exchange functionality', () => {
  this.timeout(config.defaultTimeout);

  before('initialize', (done) => {
    client.clientReady.then(() => {
      if (!micis.loggedOn) {
        micis.logon();
      }

      client.call(done);
    });
  });

  it('should be accessible', (done) => {
    nav.micisMenu
      .clickNested('Browse Available Data')
      .call(done);
  });

  it('should load templates', (done) => {
    client
      .elements('#requestMenu option', (error, response) => {
        response.value.length.should.be.greaterThan(1);
      });

    client.call(done);
  });

  it('should load four modalities', (done) => {
    client.pause(1000);
    client.getText('.statisticsLabel label', (error, response) => {
      const modalities = [];
      response.forEach((text) => { modalities.push(text); });
      ['MR', 'Assessments', 'Studies', 'Subjects'].forEach((modality) => {
        modalities.should.containEql(modality);
      });
    });

    client.call(done);
  });
});
