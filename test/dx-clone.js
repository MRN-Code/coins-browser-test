'use strict';
const config = require('config');
const client = require('./lib/client').client;
const nav = require('./lib/nav/navigation')(client, config);
const micis = require('./lib/auth/micis')(client);
const should = require('should');

describe('Test data exchange functionality for cloning a request', function() {
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
    const previousRequestTemplates = '#requestMenu > option';

    client
      .elements(previousRequestTemplates)
      .then(response => {
        response.value.length.should.be.greaterThan(1);
      })
      .call(done);
  });

  it('should verify that all 4 modality filters have loaded', function(done) {
    const mrFilter = 'div.draggable.filter.MRFilter.ui-draggable';
    const filterContainer = 'div#filterContainer > div.statisticsLabel > div > label';

    client
      .waitForExist(mrFilter)
      .getText(filterContainer)
      .then(response => {
        response.should.be.eql(['MR', 'Assessments', 'Studies', 'Subjects']);
      })
      .call(done);
  });

  it('should select a previous request template', function(done) {
    const select = 'select#requestMenu';
    const open = 'input#requestOpenButton';
    const cloneIt = 'div#requestStatusMessage > a.symlink';
    const statistics = 'div#filterContainer > div.statisticsLabel > div.statisticsValue';

    client
      .waitForExist(select)
      .selectByValue(select, 460)
      .click(open)
      .pause(3000)
      .click(cloneIt)
      .getText(statistics)
      .then(response => {
        response.should.be.eql([ '2253', '1112', '1', '1112' ]);
      })
      .call(done);
  });

  it('should click on [Untitled Request] and add a new title', function(done) {
    const titleElement = 'div#requestTitle';
    const titleInput = 'input#newRequestTitle';
    const titleValue = 'Cloned Request Title';
    const okButton = 'input#okButton';

    client
      .click(titleElement)
      .setValue(titleInput, titleValue)
      .click(okButton)
      .getText(titleElement)
      .then(returnedTitle => {
        returnedTitle.should.be.equal(titleValue)
      })
      .call(done);
  });

  it('should send the request', function(done) {
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
