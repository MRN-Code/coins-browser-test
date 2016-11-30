'use strict';
const config = require('config');
const client = require('./lib/client').client;
const nav = require('./lib/nav/navigation')(client, config);
const micis = require('./lib/auth/micis')(client);
const should = require('should');

describe('Test data exchange functionality for a new request', function dxNewRequest() {
  this.timeout(config.defaultTimeout);

  before('initialize', (done) => {
    client.clientReady.then(() => {
      if (!micis.loggedOn) {
        micis.logon();
      }

      client.call(done);
    });
  });

  it('should open Data Exchange', (done) => {
    nav
      .micisMenu
      .clickNested('Browse Available Data')
      .call(done);
  });

  it('should verify that [Previous Request Templates] have loaded', (done) => {
    const previousRequestTemplates = '#requestMenu > option';

    client
      .pause(500)
      .elements(previousRequestTemplates)
      .then(response => {
        response.value.length.should.be.greaterThan(1);
      })
      .call(done);
  });

  it('should verify that all 4 modality filters have loaded', (done) => {
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

  it('should click on [Untitled Request] and add a new title', (done) => {
    const titleElement = 'div#requestTitle';
    const titleInput = 'input#newRequestTitle';
    const titleValue = 'New Request Title Test';
    const okButton = 'input#okButton';

    client
      .waitForExist(titleElement)
      .click(titleElement)
      .setValue(titleInput, titleValue)
      .waitForExist(okButton)
      .click(okButton)
      .pause(500)
      .getText(titleElement)
      .then(returnedTitle => {
        returnedTitle.should.be.equal(titleValue)
      })
      .call(done);
  });

  it('should drag an MR filter into the request workspace', (done) => {
    const mrFilter = 'div.draggable.filter.MRFilter.ui-draggable > label';
    // TODO: requestWorkspace needs improvement, as sometimes the MR filter
    // gets dragged to the wrong location
    const requestWorkspace = 'div.group.andGroup.ui-droppable > a#groupSwitch';
    const label = 'ul.attributeList > li:nth-child(3)';
    const select = `${label} > div.attributeOptionContainer > select`;
    const applyButton = 'input#applyButton';
    const statistics = 'div#filterContainer > div.statisticsLabel > div.statisticsValue';

    client
      .dragAndDrop(mrFilter, requestWorkspace)
      .waitForExist(label)
      .click(label)
      .waitForExist(select)
      .selectByValue(select, 'ANAT')
      .waitForExist(applyButton)
      .click(applyButton)
      .pause(2000)
      .getText(statistics)
      .then(response => {
        response.should.be.eql([ '384', '0', '1', '203' ]);
      })
      .call(done);
  });

  it('should update the request title again', (done) => {
    const titleElement = 'div#requestTitle';
    const titleInput = 'input#newRequestTitle';
    const titleValue = 'Second request title update';
    const okButton = 'input#okButton';

    client
      .waitForExist(titleElement)
      .click(titleElement)
      .setValue(titleInput, titleValue)
      .waitForExist(okButton)
      .click(okButton)
      .pause(500)
      .getText(titleElement)
      .then(returnedTitle => {
        returnedTitle.should.be.equal(titleValue)
      })
      .call(done);
  });

  it('should drag a Study filter into the request workspace', (done) => {
    const studyFilter = 'div.draggable.filter.StudiesFilter.ui-draggable > label';
    const requestWorkspace = 'div#request > div > div.filter.MRFilter';
    const studyName = 'div#ui-id-21 > ul.attributeList > li.attributeItem';
    const select = `${studyName} > div > select`;
    const applyButton = 'div#ui-id-23 > input#applyButton';
    const statistics = 'div#filterContainer > div.statisticsLabel > div.statisticsValue';

    client
      .dragAndDrop(studyFilter, requestWorkspace)
      .waitForExist(studyName)
      .click(studyName)
      .waitForExist(select)
      .selectByVisibleText(select, 'ABIDE (1)')
      .waitForExist(applyButton)
      .click(applyButton)
      .pause(2000)
      .getText(statistics)
      .then(response => {
        response.should.be.eql([ '0', '0', '0', '0' ]);
      })
      .call(done);
  });

  it('should change the request workspace group to an [OR] group', (done) => {
    const switchButton = 'div#request > div a#groupSwitch';
    const statistics = 'div#filterContainer > div.statisticsLabel > div.statisticsValue';

    client
      .waitForExist(switchButton)
      .click(switchButton)
      .pause(2000)
      .getText(statistics)
      .then(response => {
        response.should.be.eql([ '2637', '1112', '2', '1315' ]);
      })
      .call(done);
  });

  it('should add another filter and a group', (done) => {
    const andGroupPreMove = 'div#groupContainer > div.draggable.group.andGroup.ui-draggable > div.groupLabelContainer';
    const requestWorkspace = 'div#request > div > div.filter.MRFilter';
    const subjectsFilter = 'div.draggable.filter.SubjectsFilter.ui-draggable > label';
    const andGroupPostMove = 'div#request > div > div.group.andGroup.ui-droppable';
    const subjectType = 'div#ui-id-37 > ul.attributeList > li:nth-child(1)';
    const select = `${subjectType} > div > select`;
    const applyButton = 'div#ui-id-39 > input#applyButton';
    const statistics = 'div#filterContainer > div.statisticsLabel > div.statisticsValue';

    client
      .dragAndDrop(andGroupPreMove, requestWorkspace)
      .pause(1000)
      .dragAndDrop(subjectsFilter, andGroupPostMove)
      .waitForExist(subjectType)
      .click(subjectType)
      .waitForExist(select)
      .selectByVisibleText(select, '20-29 (72)')
      .waitForExist(applyButton)
      .click(applyButton)
      .pause(2000)
      .getText(statistics)
      .then(response => {
        response.should.be.eql([ '3748', '2396', '3', '1386' ]);
      })
      .call(done)
  });

  it('should delete the Studies filter', (done) => {
    const deleteButton = 'div.filter.StudiesFilter > a#filterDelete';
    const statistics = 'div#filterContainer > div.statisticsLabel > div.statisticsValue';

    client
      .waitForExist(deleteButton)
      .click(deleteButton)
      .pause(2000)
      .getText(statistics)
      .then(response => {
        response.should.be.eql([ '1495', '1284', '2', '274' ]);
      })
      .call(done)
  });

  it('should delete the group', (done) => {
    const deleteButton = 'div.group.andGroup.ui-droppable > a#groupDelete';
    const confirmButton = 'input#deleteAll';
    const statistics = 'div#filterContainer > div.statisticsLabel > div.statisticsValue';

    client
      .waitForExist(deleteButton)
      .click(deleteButton)
      .waitForExist(confirmButton)
      .click(confirmButton)
      .pause(2000)
      .getText(statistics)
      .then(response => {
        response.should.be.eql([ '384', '0', '1', '203' ]);
      })
      .call(done)
  });

  it('should edit the MR filter', (done) => {
    const editButton = 'div.filter.MRFilter > a#filterEdit';
    const label = 'ul.attributeList > li:nth-child(4)';
    const select = `${label} > div.attributeOptionContainer > select`;
    const applyButton = 'div#ui-id-51 > input#applyButton';
    const statistics = 'div#filterContainer > div.statisticsLabel > div.statisticsValue';

    client
      .waitForExist(editButton)
      .click(editButton)
      .waitForExist(label)
      .click(label)
      .waitForExist(select)
      .selectByValue(select, 'PITT Scanner')
      .waitForExist(applyButton)
      .click(applyButton)
      .pause(2000)
      .getText(statistics)
      .then(response => {
        response.should.be.eql([ '624', '0', '2', '183' ]);
      })
      .call(done)
  });

  it('should send the request', (done) => {
    const sendRequest = 'input#requestSubmitButton';
    const requestPopUp = '#ui-id-57 > ul.requestSourceList > h3';

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
