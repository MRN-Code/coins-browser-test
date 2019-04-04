'use strict';

/* globals browser */

const nav = require('./lib/nav/navigation')(browser);
const micis = require('./lib/auth/micis')(browser);

const sampleData = browser.options.testData.dxClone;


describe('Test data exchange functionality for cloning a request', () => {
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav
      .micisMenu
      .clickNested('Browse Available Data');
  });

  it('should verify that [Open Previous Request Templates] have loaded', () => {
    browser.pause(500);
    browser.waitForPaginationComplete();
    const response = browser.elements('#requestMenu option');
    response.value.length.should.be.greaterThan(1);
  });

  it('should verify that all 4 modality filters have loaded', () => {
    browser.waitForExist('div.draggable.filter.MRFilter.ui-draggable');
    const response = browser.customGetText('div#filterContainer > div.statisticsLabel > div > label');
    response.should.be.eql(['MR', 'Assessments', 'Studies', 'Subjects']);
  });

  it('should load a Public Templates', () => {
    const publicTemplates = `select#requestMenu > optgroup[label="${sampleData.publicTemplateLabel}"]`;

    browser.waitForExist(publicTemplates);
    browser
      .selectByValue(publicTemplates, sampleData.publicTemplateValue)
      .click('input#requestOpenButton')
      .pause(3000);
    browser.waitForPaginationComplete();
    browser.click('div#requestStatusMessage > a.symlink');
    browser.waitForPaginationComplete();
    const response = browser.customGetText('div#filterContainer > div.statisticsLabel > div.statisticsValue');
    response.should.be.eql(sampleData.statisticsValue);
  });

  it('should click on [Untitled Request] and add a new title', () => {
    const titleElement = 'div#requestTitle';
    const titleValue = 'Cloned Request Title';
    const okButton = 'button#okButton';

    browser
      .click(titleElement)
      .setValue('input#newRequestTitle', titleValue)
      .waitForExist(okButton);
    browser
      .click(okButton)
      .pause(500);
    browser.waitForPaginationComplete();
    const returnedTitle = browser.getText(titleElement);
    returnedTitle.should.be.equal(titleValue);
  });

  it('should send the request', () => {
    // TODO: referencing elements based on their incrementing numeric id is currently stable,
    // but could cause problems in the future. I attempted to reference these requestPopUp vars
    // using the div class instead, but could not get it to work. The returned value was an
    // array and pseudo selectors were not grabbing the correct array index.  Maybe this can
    // be made more robust with future versions of webdriverio.
    const sendRequest = 'input#requestSubmitButton';
    const activeForm = 'div.ui-dialog:not([style*="display: none"]) > div';
    const requestPopUp = `${activeForm} > ul.requestSourceList > h3`;

    browser.waitForExist(sendRequest);
    browser.click(sendRequest).pause(3000);
    browser.waitForExist(requestPopUp);
    const response = browser.getText(requestPopUp);
    response.should.be.equal('This request is for the following data/studies');
  });
});
