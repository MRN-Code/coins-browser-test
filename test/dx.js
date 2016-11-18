'use strict';
// Test for Data Exchange
const config = require('config');
const client = require('./lib/client').client;
const nav = require('./lib/nav/navigation')(client, config);
const micis = require('./lib/auth/micis')(client);
const should = require('should');

describe('Test data exchange functionality', function() {
  this.timeout(config.defaultTimeout);

  before('initialize', function(done) {
    client.clientReady.then(function boot() {
      if (!micis.loggedOn) {
        micis.logon();
      }

      client.call(done);
    });
  });

  it('should open Data Exchange', function(done) {
    nav
      .micisMenu
      .clickNested('Browse Available Data')
      .call(done);
  });

  it('should verify that [Previous Request Templates] have loaded', function(done) {
    client
      .elements("#requestMenu option")
      .then(response => {
        response.value.length.should.be.greaterThan(1);
      })
      .call(done);
  });

  it('should verify that all 4 modality filters have loaded', function(done) {
    const modalityFilters = ['MR', 'Assessments', 'Studies', 'Subjects'];
    client
      .waitForExist('div#filterContainer .statisticsLabel div label')
      .getText('div#filterContainer .statisticsLabel div label')
      .then(response => {
        response.should.be.eql(modalityFilters);
      })
      .call(done);
  });
});
