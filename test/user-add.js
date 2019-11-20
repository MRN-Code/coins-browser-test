'use strict';

/* globals browser */

/**
 * Test creating a new study.
 *
 * Steps:
 *
 *   1. Navigate to add User from (MICIS > Admin > Add User)
 *   1. Fill out form with some sample data
 *   2. Click Add
 *   3. Search and Verify values match entered data.
 */
const user = require('./lib/user.js')(browser);
const nav = require('./lib/nav/navigation')(browser);
const micis = require('./lib/auth/micis')(browser);

const sampleData = browser.options.testData.userAdd.sampleData;

describe('Add a new user', () => {
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav.micisMenu.clickNested('Users');
  });
  it('should show a new user button', () => {
    browser.element('form input#add_user').should.be.ok;// eslint-disable-line no-unused-expressions
  });
  it('should open the add site form', () => {
    browser.click('form input#add_user').waitForPaginationComplete();
    browser.element('form#frmUser').should.be.ok;// eslint-disable-line no-unused-expressions
  });
  it('should fill values in the form', () => {
    user.fillForm(sampleData);
  });

  it('should set application permissions', () => {
    user.setAppPermissions(sampleData.appPermissions);
  });
  it('should set study permissions', () => {
    user.setStudyPermissions(sampleData.studyPermissions);
  });

  it('should submit and see if successful', () => {
    browser.click('#create_user').waitForPaginationComplete();
    browser.getText('#page-container > div:nth-child(5) > div > center > font').should.be.equal('User Successfully Added');
  });
  it('should verify the user data', () => {
    user.searchUser(sampleData.username);
    user.verifyData(sampleData);
  });

  it('should check app roles', () => {
    user.verifyAppPermissions(sampleData.appPermissions);
  });

  it('should check study roles', () => {
    user.verifyStudyPermissions(sampleData.studyPermissions);
  });
});
