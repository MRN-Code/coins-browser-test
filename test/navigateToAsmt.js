'use strict';

// test deps
const config = require('config');
const should = require('should');

const client = require('./lib/client.js').client;

const nav = require('./lib/nav/navigation.js')(client, config);

const timeoutDur = 25000;
const defaultStudyId = 2319; // NITEST

// include pre-requisite tests
require('./logon.js');

describe('navigate to asmt', () => {
  this.timeout(timeoutDur);

  before('initialize', (done) => {
        // wait for client to be ready before testing
    client.clientReady.then(done);
  });

  it('should load asmt', (done) => {
    nav.gotoAsmt(done);
  });

  it('should change asmt study', (done) => {
    nav.selectAsmtStudy(defaultStudyId, done);
  });
});
