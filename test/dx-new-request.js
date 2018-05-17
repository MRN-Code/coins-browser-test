'use strict';

/* globals browser */

const config = require('config');
const nav = require('./lib/nav/navigation')(browser, config);
const micis = require('./lib/auth/micis')(browser);
const should = require('should');

describe('Test data exchange functionality for a new request', function dxNewRequest() {
  this.timeout(config.defaultTimeout);
  const statistics = 'div#filterContainer > div.statisticsLabel > div.statisticsValue';

  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav
      .micisMenu
      .clickNested('Browse Available Data');
  });

  it('should click on [Untitled Request] and add a new title', () => {
    const titleElement = 'div#requestTitle';
    const titleValue = 'New Request Title Test';
    const okButton = 'button#okButton';

    browser.waitForExist(titleElement);
    browser
      .click(titleElement)
      .setValue('input#newRequestTitle', titleValue)
      .waitForExist(okButton);
    browser.click(okButton).pause(500);
    browser.getText(titleElement).should.be.equal(titleValue);
  });

  it('should drag an MR filter into the request workspace', () => {
    // TODO: the first drag and drop needs improvement, as sometimes the MR filter
    // gets dragged to the wrong location
    const label = 'ul.attributeList > li:nth-child(3)';
    const select = `${label} > div.attributeOptionContainer > select`;
    const applyButton = 'input#applyButton';

    browser
      .dragAndDrop('div.draggable.filter.MRFilter.ui-draggable > label', 'div.group.andGroup.ui-droppable > a.closeButton')
      .waitForExist(label);
    browser
      .click(label)
      .waitForExist(select);
    browser
      .selectByValue(select, 'ANAT')
      .waitForExist(applyButton);
    browser
      .click(applyButton)
      .pause(2000);
    browser.getText(statistics).should.be.eql(['384', '0', '1', '203']);// eslint-disable-line no-unused-expressions
  });

  it('should update the request title again', () => {
    const titleElement = 'div#requestTitle';
    const titleValue = 'Second request title update';
    const okButton = 'button#okButton';

    browser.waitForExist(titleElement);
    browser
      .click(titleElement)
      .setValue('input#newRequestTitle', titleValue)
      .waitForExist(okButton);
    browser
      .click(okButton)
      .pause(500);
    browser.getText(titleElement).should.be.equal(titleValue);
  });

  it('should drag a Study filter into the request workspace', () => {
    const activeFilterForm = 'div.ui-dialog:not([style*="display: none"]) > div.filterForm';
    const studyName = `${activeFilterForm} > ul.attributeList > li.attributeItem`;
    const select = `${studyName} > div > select`;
    const applyButton = `${activeFilterForm} > input#applyButton`;

    browser
      .dragAndDrop('div.draggable.filter.StudiesFilter.ui-draggable > label', 'div#request > div > div.filter.MRFilter')
      .waitForExist(studyName);
    browser
      .click(studyName)
      .waitForExist(select);
    browser
      .selectByVisibleText(select, 'ABIDE (1)')
      .waitForExist(applyButton);
    browser
      .click(applyButton)
      .pause(2000);
    browser.getText(statistics).should.be.eql(['0', '0', '0', '0']);
  });

  it('should change the request workspace group to an [OR] group', () => {
    const switchButton = 'div#request > div > label.groupSwitch';
    browser.waitForExist(switchButton);
    browser.click(switchButton).pause(2000);
    browser.getText(statistics).should.be.eql(['2637', '1112', '2', '1315']);
  });

  it('should add another filter and a group', () => {
    const activeFilterForm = 'div.ui-dialog:not([style*="display: none"]) > div.filterForm';
    const subjectType = `${activeFilterForm} > ul.attributeList > li:nth-child(1)`;
    const select = `${subjectType} > div > select`;
    const applyButton = `${activeFilterForm} > input#applyButton`;

    browser
      .dragAndDrop('div#groupContainer > div.draggable.group.andGroup.ui-draggable > div.groupLabelContainer', 'div#request > div > div.filter.MRFilter')
      .pause(1000);
    browser
      .dragAndDrop('div.draggable.filter.SubjectsFilter.ui-draggable > label', 'div#request > div > div.group.andGroup.ui-droppable')
      .waitForExist(subjectType);
    browser
      .click(subjectType)
      .waitForExist(select);
    browser
      .selectByVisibleText(select, '20-29 (72)')
      .waitForExist(applyButton);
    browser
      .click(applyButton)
      .pause(2000);
    browser.getText(statistics).should.be.eql(['3748', '1556', '3', '1385']);
  });

  it('should delete the Studies filter', () => {
    const deleteButton = 'div.filter.StudiesFilter > a.closeButton';

    browser.waitForExist(deleteButton);
    browser
      .click(deleteButton)
      .pause(2000);
    browser.getText(statistics).should.be.eql(['1495', '444', '2', '273']);
  });

  it('should delete the group', () => {
    const deleteButton = 'div.group.andGroup.ui-droppable > a.closeButton';
    const confirmButton = 'input#deleteAll';

    browser.waitForExist(deleteButton);
    browser.click(deleteButton).waitForExist(confirmButton);
    browser.click(confirmButton).pause(2000);
    browser.getText(statistics).should.be.eql(['384', '0', '1', '203']);
  });

  it('should edit the MR filter', () => {
    const editButton = 'div.filter.MRFilter > a.editButton';
    const activeFilterForm = 'div.ui-dialog:not([style*="display: none"]) > div.filterForm';
    const label = `${activeFilterForm} > ul.attributeList > li:nth-child(4)`;
    const select = `${label} > div.attributeOptionContainer > select`;
    const applyButton = `${activeFilterForm} > input#applyButton`;

    browser.waitForExist(editButton);
    browser
      .click(editButton)
      .waitForExist(label);
    browser.click(label)
      .waitForExist(select);
    browser
      .selectByValue(select, 'PITT Scanner')
      .waitForExist(applyButton);
    browser
      .click(applyButton)
      .pause(2000);
    browser.getText(statistics).should.be.eql(['624', '0', '2', '183']);
  });

  it('should send the request', () => {
    const sendRequest = 'input#requestSubmitButton';
    const activeForm = 'div.ui-dialog:not([style*="display: none"]) > div';
    const requestPopUp = `${activeForm} > ul.requestSourceList > h3`;

    browser
      .waitForExist(sendRequest);
    browser
      .click(sendRequest)
      .pause(3000);
    browser.waitForExist(requestPopUp);
    browser.getText(requestPopUp).should.be.equal('This request is for the following data/studies');
  });
});
