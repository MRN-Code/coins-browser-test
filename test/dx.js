'use strict';
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
      .elements("#requestMenu > option")
      .then(response => {
        response.value.length.should.be.greaterThan(1);
      })
      .call(done);
  });

  it('should verify that all 4 modality filters have loaded', function(done) {
    const modalityFilters = ['MR', 'Assessments', 'Studies', 'Subjects'];

    client
      .waitForExist('div.draggable.filter.MRFilter.ui-draggable', 5000)
      .getText('div#filterContainer > div.statisticsLabel > div > label')
      .then(response => {
        response.should.be.eql(modalityFilters);
      })
      .call(done);
  });

  it('should click on [Untitled Request] and add a new title', function(done) {
    const title = 'New Request Title Test';

    client
      .click('div#requestTitle')
      .setValue('input#newRequestTitle', title)
      .click('input#okButton')
      .getText('div#requestTitle')
      .then(returnedTitle => {
        returnedTitle.should.be.equal(title)
      })
      .call(done);
  });

  it('should drag an MR filter into the request workspace', function(done) {
    const mrFilter = 'div.draggable.filter.MRFilter.ui-draggable > label';
    // TODO: requestWorkspace needs improvement, as sometimes the MR filter
    // gets dragged to the wrong location
    const requestWorkspace = 'div.group.andGroup.ui-droppable > a#groupSwitch';
    const label = 'ul.attributeList > li:nth-child(3)';
    const select = `${label} > div.attributeOptionContainer > select`;

    client
      // Drag MR filter into the request workspace
      .dragAndDrop(mrFilter, requestWorkspace)
      // Wait for the [Label] element to exist, then click on it
      .waitForExist(label)
      .click(label)
      // Select the [ANAT] option
      .waitForExist(select)
      .selectByValue(select, 'ANAT')
      // Click [Apply] button
      .waitForExist('input#applyButton')
      .click('input#applyButton')
      // Pause until statistics update
      // Note: webdriverio 2.4.5 does not have waitUntil.  So this is a hack
      // that should eventually be removed :(
      .pause(2000)
      // Verify Statistics
      .getText('div#filterContainer > div.statisticsLabel > div.statisticsValue')
      .then(response => {
        response.should.be.eql([ '384', '0', '1', '203' ]);
      })
      .call(done);
  });

  it('should update the request title again', function(done) {
    const title = 'Second request title update';

    client
      .click('div#requestTitle')
      .setValue('input#newRequestTitle', title)
      .click('input#okButton')
      .pause(1000)
      .getText('div#requestTitle')
      .then(returnedTitle => {
        returnedTitle.should.be.equal(title)
      })
      .call(done);
  });

  it('should drag a Study filter into the request workspace', function(done) {
    const studyFilter = 'div.draggable.filter.StudiesFilter.ui-draggable > label';
    const requestWorkspace = 'div#request > div > div.filter.MRFilter';
    const studyName = 'div#ui-id-21 > ul.attributeList > li.attributeItem';
    const select = `${studyName} > div > select`;

    client
      // Drag Study filter into the request workspace
      .dragAndDrop(studyFilter, requestWorkspace)
      // Wait for the [Study Name] element to exist, then click on it
      .waitForExist(studyName)
      .click(studyName)
      // Select the [ABIDE] option
      .waitForExist(select)
      .selectByVisibleText(select, 'ABIDE (1)')
      // Click [Apply] button
      .waitForExist('div#ui-id-23 > input#applyButton')
      .click('div#ui-id-23 > input#applyButton')
      // Pause until statistics update
      // Note: webdriverio 2.4.5 does not have waitUntil.  So this is a hack
      // that should eventually be removed :(
      .pause(3000)
      // Verify Statistics
      .getText('div#filterContainer > div.statisticsLabel div.statisticsValue')
      .then(response => {
        response.should.be.eql([ '0', '0', '0', '0' ]);
      })
      .call(done);
  });

  it('should change the request workspace group to an [OR] group', function(done) {
    const switchButton = 'div#request > div a#groupSwitch';

    client
      .click(switchButton)
      // Pause until statistics update
      // Note: webdriverio 2.4.5 does not have waitUntil.  So this is a hack
      // that should eventually be removed :(
      .pause(3000)
      // Verify Statistics
      .getText('div#filterContainer > div.statisticsLabel > div.statisticsValue')
      .then(response => {
        response.should.be.eql([ '2637', '1112', '2', '1315' ]);
      })
      .call(done);
  });

  it('should add another filter and a group', function(done) {
    const andGroupPreMove = 'div#groupContainer > div.draggable.group.andGroup.ui-draggable > div.groupLabelContainer';
    const requestWorkspace = 'div#request > div > div.filter.MRFilter';
    const subjectsFilter = 'div.draggable.filter.SubjectsFilter.ui-draggable > label';
    const andGroupPostMove = 'div#request > div > div.group.andGroup.ui-droppable';
    const subjectType = 'div#ui-id-37 > ul.attributeList > li:nth-child(1)';
    const select = `${subjectType} > div > select`;

    client
      .dragAndDrop(andGroupPreMove, requestWorkspace)
      .pause(1000)
      .dragAndDrop(subjectsFilter, andGroupPostMove)
      // Wait for the [Subject Type] element to exist, then click on it
      .waitForExist(subjectType)
      .click(subjectType)
      // Select the [Subject Type] option
      .waitForExist(select)
      .selectByVisibleText(select, '20-29 (72)')
      // Click [Apply] button
      .waitForExist('div#ui-id-39 > input#applyButton')
      .click('div#ui-id-39 > input#applyButton')
      // Pause until statistics update
      // Note: webdriverio 2.4.5 does not have waitUntil.  So this is a hack
      // that should eventually be removed :(
      .pause(3000)
      // Verify Statistics
      .getText('div#filterContainer > div.statisticsLabel > div.statisticsValue')
      .then(response => {
        response.should.be.eql([ '3748', '2396', '3', '1386' ]);
      })
      .call(done)

  });

  it('should send the request', function(done) {
    const sendRequest = 'input#requestSubmitButton';
    const requestPopUp = '#ui-id-45 > ul.requestSourceList > h3';

    client
      .click(sendRequest)
      // WHAT!?  waitForExist does not wait long enough :(
      // I needed to add this pause, or else waitForExist fails...
      .pause(4000)
      .waitForExist(requestPopUp)
      .getText(requestPopUp)
      .then(response => {
        response.should.be.equal('This request is for the following data/studies');
      })
      .call(done)
  });

});
