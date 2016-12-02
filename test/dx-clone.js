'use strict';
const config = require('config');
const client = require('./lib/client').client;
const nav = require('./lib/nav/navigation')(client, config);
const micis = require('./lib/auth/micis')(client);
const should = require('should');

describe('Test data exchange functionality for cloning a request', function dxClone() {
  this.timeout(config.defaultTimeout);

  before('initialize', (done) => {
    client.clientReady.then(() => {
      if (!micis.loggedOn) {
        micis.logon();
      }

      nav
        .micisMenu
        .clickNested('Browse Available Data')
        .call(done);
    });
  });

  it('should verify that [Previous Request Templates] have loaded', (done) => {
    client
      .pause(500)
      .elements('#requestMenu > option')
      .then(response => {
        response.value.length.should.be.greaterThan(1);
      })
      .call(done);
  });

  it('should verify that all 4 modality filters have loaded', (done) => {
    client
      .waitForExist('div.draggable.filter.MRFilter.ui-draggable')
      .getText('div#filterContainer > div.statisticsLabel > div > label')
      .then(response => {
        response.should.be.eql(['MR', 'Assessments', 'Studies', 'Subjects']);
      })
      .call(done);
  });

  it('should select a previous request template', (done) => {
    const select = 'select#requestMenu';

    client
      .waitForExist(select)
      .selectByValue(select, 460)
      .click('input#requestOpenButton')
      .pause(3000)
      .click('div#requestStatusMessage > a.symlink')
      .getText('div#filterContainer > div.statisticsLabel > div.statisticsValue')
      .then(response => {
        response.should.be.eql([ '2253', '1112', '1', '1112' ]);
      })
      .call(done);
  });

  it('should click on [Untitled Request] and add a new title', (done) => {
    const titleElement = 'div#requestTitle';
    const titleValue = 'Cloned Request Title';
    const okButton = 'input#okButton';

    client
      .click(titleElement)
      .setValue('input#newRequestTitle', titleValue)
      .waitForExist(okButton)
      .click(okButton)
      .pause(500)
      .getText(titleElement)
      .then(returnedTitle => {
        returnedTitle.should.be.equal(titleValue)
      })
      .call(done);
  });

  it('should send the request', (done) => {
    // TODO: referencing elements based on their incrementing numeric id is currently stable,
    // but could cause problems in the future. I attempted to reference these requestPopUp vars
    // using the div class instead, but could not get it to work. The returned value was an
    // array and pseudo selectors were not grabbing the correct array index.  Maybe this can
    // be made more robust with future versions of webdriverio.
    const sendRequest = 'input#requestSubmitButton';
    const requestPopUp = '#ui-id-13 > ul.requestSourceList > h3';

    client
      .waitForExist(sendRequest)
      .click(sendRequest)
      .pause(3000)
      .waitForExist(requestPopUp)
      .getText(requestPopUp)
      .then(response => {
        response.should.be.equal('This request is for the following data/studies');
      })
      .call(done)
  });

});
