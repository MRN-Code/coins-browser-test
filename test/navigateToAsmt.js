'use strict';

/* globals browser */

// test deps
const nav = require('./lib/nav/navigation.js')(browser);

const timeoutDur = 25000;
const defaultStudyId = 2319; // NITEST

// include pre-requisite tests
require('./logon.js');

describe('navigate to asmt', function navigateToAsmt() {
  this.timeout(timeoutDur);

  it('should load asmt', () => {
    nav.gotoAsmt();
  });

  it('should change asmt study', () => {
    nav.selectAsmtStudy(defaultStudyId);
  });
});
