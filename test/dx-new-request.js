'use strict';

const config = require('config');
const client = require('./lib/client').client;
const nav = require('./lib/nav/navigation')(client, config);
const micis = require('./lib/auth/micis')(client);
const should = require('should');

describe('Test data exchange functionality for a new request', function dxNewRequest() {
  this.timeout(config.defaultTimeout);
  const statistics = 'div#filterContainer > div.statisticsLabel > div.statisticsValue';

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

  it('should click on [Untitled Request] and add a new title', (done) => {
    const titleElement = 'div#requestTitle';
    const titleValue = 'New Request Title Test';
    const okButton = 'button#okButton';

    client
      .waitForExist(titleElement)
      .click(titleElement)
      .setValue('input#newRequestTitle', titleValue)
      .waitForExist(okButton)
      .click(okButton)
      .pause(500)
      .getText(titleElement)
      .then((returnedTitle) => {
        returnedTitle.should.be.equal(titleValue);
      })
      .call(done);
  });

  it('should drag an MR filter into the request workspace', (done) => {
    // TODO: the first drag and drop needs improvement, as sometimes the MR filter
    // gets dragged to the wrong location
    const label = 'ul.attributeList > li:nth-child(3)';
    const select = `${label} > div.attributeOptionContainer > select`;
    const applyButton = 'input#applyButton';

    client
      .dragAndDrop('div.draggable.filter.MRFilter.ui-draggable > label', 'div.group.andGroup.ui-droppable > a#groupSwitch')
      .waitForExist(label)
      .click(label)
      .waitForExist(select)
      .selectByValue(select, 'ANAT')
      .waitForExist(applyButton)
      .click(applyButton)
      .pause(2000)
      .getText(statistics)
      .then((response) => {
        response.should.be.eql(['384', '0', '1', '203']);
      })
      .call(done);
  });

  it('should update the request title again', (done) => {
    const titleElement = 'div#requestTitle';
    const titleValue = 'Second request title update';
    const okButton = 'button#okButton';

    client
      .waitForExist(titleElement)
      .click(titleElement)
      .setValue('input#newRequestTitle', titleValue)
      .waitForExist(okButton)
      .click(okButton)
      .pause(500)
      .getText(titleElement)
      .then((returnedTitle) => {
        returnedTitle.should.be.equal(titleValue);
      })
      .call(done);
  });

  it('should drag a Study filter into the request workspace', (done) => {
    const studyName = 'div#ui-id-21 > ul.attributeList > li.attributeItem';
    const select = `${studyName} > div > select`;
    const applyButton = 'div#ui-id-23 > input#applyButton';

    client
      .dragAndDrop('div.draggable.filter.StudiesFilter.ui-draggable > label', 'div#request > div > div.filter.MRFilter')
      .waitForExist(studyName)
      .click(studyName)
      .waitForExist(select)
      .selectByVisibleText(select, 'ABIDE (1)')
      .waitForExist(applyButton)
      .click(applyButton)
      .pause(2000)
      .getText(statistics)
      .then((response) => {
        response.should.be.eql(['0', '0', '0', '0']);
      })
      .call(done);
  });

  it('should change the request workspace group to an [OR] group', (done) => {
    const switchButton = 'div#request > div a#groupSwitch';

    client
      .waitForExist(switchButton)
      .click(switchButton)
      .pause(2000)
      .getText(statistics)
      .then((response) => {
        response.should.be.eql(['2637', '1112', '2', '1315']);
      })
      .call(done);
  });

  it('should add another filter and a group', (done) => {
    const subjectType = 'div#ui-id-37 > ul.attributeList > li:nth-child(1)';
    const select = `${subjectType} > div > select`;
    const applyButton = 'div#ui-id-39 > input#applyButton';

    client
      .dragAndDrop('div#groupContainer > div.draggable.group.andGroup.ui-draggable > div.groupLabelContainer', 'div#request > div > div.filter.MRFilter')
      .pause(1000)
      .dragAndDrop('div.draggable.filter.SubjectsFilter.ui-draggable > label', 'div#request > div > div.group.andGroup.ui-droppable')
      .waitForExist(subjectType)
      .click(subjectType)
      .waitForExist(select)
      .selectByVisibleText(select, '20-29 (72)')
      .waitForExist(applyButton)
      .click(applyButton)
      .pause(2000)
      .getText(statistics)
      .then((response) => {
        response.should.be.eql(['3748', '1730', '3', '1385']);
      })
      .call(done);
  });

  it('should delete the Studies filter', (done) => {
    const deleteButton = 'div.filter.StudiesFilter > a#filterDelete';

    client
      .waitForExist(deleteButton)
      .click(deleteButton)
      .pause(2000)
      .getText(statistics)
      .then((response) => {
        response.should.be.eql(['1495', '618', '2', '273']);
      })
      .call(done);
  });

  it('should delete the group', (done) => {
    const deleteButton = 'div.group.andGroup.ui-droppable > a#groupDelete';
    const confirmButton = 'input#deleteAll';

    client
      .waitForExist(deleteButton)
      .click(deleteButton)
      .waitForExist(confirmButton)
      .click(confirmButton)
      .pause(2000)
      .getText(statistics)
      .then((response) => {
        response.should.be.eql(['384', '0', '1', '203']);
      })
      .call(done);
  });

  it('should edit the MR filter', (done) => {
    const editButton = 'div.filter.MRFilter > a#filterEdit';
    const label = 'ul.attributeList > li:nth-child(4)';
    const select = `${label} > div.attributeOptionContainer > select`;
    const applyButton = 'div#ui-id-51 > input#applyButton';

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
      .then((response) => {
        response.should.be.eql(['624', '0', '2', '183']);
      })
      .call(done);
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
      .then((response) => {
        response.should.be.equal('This request is for the following data/studies');
      })
      .call(done);
  });
});
