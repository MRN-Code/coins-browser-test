'use strict';

/* globals browser */

const nav = require('./lib/nav/navigation')(browser);
const micis = require('./lib/auth/micis')(browser);
const should = require('should');

describe('Test data exchange functionality for a new request', () => {
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
    browser.customGetText(titleElement).should.be.equal(titleValue);
  });

  it('should drag an MR filter into the request workspace', () => {
    // TODO: the first drag and drop needs improvement, as sometimes the MR filter
    // gets dragged to the wrong location
    const label = '#attributeTypeSelector';
    const select = '#attributeValueSelector';
    const applyButton = 'input#applyButton';
    browser.pause(2000);
    browser
      .dragAndDrop('div.draggable.filter.MRFilter.ui-draggable > label', 'div.group.andGroup.ui-droppable > a.closeButton').pause(5000);
    browser.waitForExist(label);
    browser
      .selectByVisibleText(label, 'Label')
      .waitForExist(select);
    browser.pause(2000);
    browser
      .selectByValue(select, 'ANAT')
      .waitForExist(applyButton);
    browser
      .click(applyButton)
      .pause(2000);
    browser.customGetText(statistics).should.be.eql(['384', '0', '1', '203']);// eslint-disable-line no-unused-expressions
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
    browser.customGetText(titleElement).should.be.equal(titleValue);
  });

  it('should drag a Study filter into the request workspace', () => {
    const applyButton = 'body > div:last-child > div >form> div> input#applyButton';

    browser
      .dragAndDrop('div.draggable.filter.StudiesFilter.ui-draggable > label', 'div#request > div > div.filter.MRFilter')
      .pause(2000);
    browser
      .selectByValue('body > div:last-child > div > #attributeFilterForm > #attributeTypeDiv> #attributeTypeSelector', '22')
      .pause(2000);
    browser
      .selectByVisibleText('body > div:last-child > div > #attributeFilterForm > #attributeValueDiv > #attributeValueSelector', 'ABIDE (1)')
      .waitForExist(applyButton);
    browser
      .click(applyButton)
      .pause(2000);
    browser.customGetText(statistics).should.be.eql(['0', '0', '0', '0']);
  });

  it('should change the request workspace group to an [OR] group', () => {
    const switchButton = 'div#request > div > label.groupSwitch';
    browser.waitForExist(switchButton);
    browser.click(switchButton).pause(4000);
    browser.customGetText(statistics).should.be.eql(['2637', '1112', '2', '1315']);
  });

  it('should add another filter and a group', () => {
    const applyButton = 'body > div:last-child > div >form> div> input#applyButton';
    browser
      .dragAndDrop('div#groupContainer > div.draggable.group.andGroup.ui-draggable > div.groupLabelContainer', 'div#request > div > div.filter.MRFilter')
      .pause(1000);
    browser
      .dragAndDrop('div.draggable.filter.SubjectsFilter.ui-draggable > label', 'div#request > div > div.group.andGroup.ui-droppable')
      .pause(1000);
    browser
      .selectByVisibleText('body > div:last-child > div > #attributeFilterForm > #attributeTypeDiv> #attributeTypeSelector', 'Subject Type')
      .pause(2000);
    browser
      .selectByVisibleText('body > div:last-child > div > #attributeFilterForm > #attributeValueDiv> #attributeValueSelector', '20-29 (72)')
      .waitForExist(applyButton);
    browser
      .click(applyButton)
      .pause(4000);
    browser.customGetText(statistics).should.be.eql(['3748', '1556', '3', '1385']);
  });

  it('should delete the Studies filter', () => {
    const deleteButton = 'div.filter.StudiesFilter > a.closeButton';

    browser.waitForExist(deleteButton);
    browser
      .click(deleteButton)
      .pause(2000);
    browser.customGetText(statistics).should.be.eql(['1495', '444', '2', '273']);
  });

  it('should delete the group', () => {
    const deleteButton = 'div.group.andGroup.ui-droppable > a.closeButton';
    const confirmButton = 'input#deleteAll';

    browser.waitForExist(deleteButton);
    browser.click(deleteButton).waitForExist(confirmButton);
    browser.click(confirmButton).pause(2000);
    browser.customGetText(statistics).should.be.eql(['384', '0', '1', '203']);
  });

  it('should edit the MR filter', () => {
    const editButton = 'div.filter.MRFilter > a.editButton';
    const activeFilterForm = 'body > div:last-child > div > #attributeFilterForm';
    const label = `${activeFilterForm} > #attributeTypeDiv> #attributeTypeSelector`;
    const select = `${activeFilterForm} > #attributeValueDiv> #attributeValueSelector`;
    const applyButton = `${activeFilterForm} >div> input#applyButton`;

    browser.waitForExist(editButton);
    browser
      .click(editButton)
      .waitForExist(label);
    browser.pause(3000);
    browser.selectByValue(label, '2')
      .waitForExist(select);
    browser
      .selectByValue(select, 'PITT Scanner')
      .waitForExist(applyButton);
    browser
      .click(applyButton)
      .pause(2000);
    browser.customGetText(statistics).should.be.eql(['624', '0', '2', '183']);
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
    browser.customGetText(requestPopUp).should.be.equal('This request is for the following data/studies');
  });
});
