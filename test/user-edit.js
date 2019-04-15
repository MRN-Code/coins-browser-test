'use strict';

/* globals browser */

/**
 * Test creating a new study.
 *
 * Steps:
 *
 *   1. Navigate to edit user from (MICIS > Admin > Users)
 *   1. Fill out form with some sample data
 *   2. Click Add
 *   3. Verify values match entered data.
 *   4. Change Study and App permissions
 *   5. Verify Study and App permissions
 *   6. Expire password and check login
 *   7. Expire account and check login
 *   8. Reset account and passowrd expiry and check login
 */
const moment = require('moment');
const micis = require('./lib/auth/micis')(browser);
const user = require('./lib/user.js')(browser);

const sampleData = browser.options.testData.userEdit.sampleData;

describe('Edit new user', () => {
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
  });
  it('should search the user', () => {
    user.searchUser(sampleData.username);
  });
  it('should fill values in the form', () => {
    // first unlock the account
    if (browser.isExisting('#unlock_account')) {
      browser.click('#unlock_account').waitForPaginationComplete();
    }
    user.fillForm(sampleData, sampleData.username);
  });
  it('should set application permissions 1', () => {
    user.setAppPermissions(sampleData.appPermissions1);
  });
  it('should set study permissions 1', () => {
    user.setStudyPermissions(sampleData.studyPermissions1);
  });

  it('should submit and see if successful', () => {
    browser.click('#create_user').waitForPaginationComplete();
    browser.getText('#page-container > div.boxBody > div > center > font').should.containEql('User Successfully Updated');
  });

  it('should verify the user data', () => {
    user.verifyData(sampleData);
  });
  it('should check app roles 1', () => {
    user.verifyAppPermissions(sampleData.appPermissions1);
  });
  it('should check study roles 1', () => {
    user.verifyStudyPermissions(sampleData.studyPermissions1);
  });
  it('should set application permissions 2', () => {
    user.setAppPermissions(sampleData.appPermissions2);
  });
  it('should set study permissions 2', () => {
    user.setStudyPermissions(sampleData.studyPermissions2);
  });
  it('should submit and see if successful', () => {
    browser.click('#create_user').waitForPaginationComplete();
    browser.getText('#page-container > div.boxBody > div > center > font').should.containEql('User Successfully Updated');
  });
  it('should check app roles 2', () => {
    user.verifyAppPermissions(sampleData.appPermissions2);
  });
  it('should check study roles 2', () => {
    user.verifyStudyPermissions(sampleData.studyPermissions2);
  });
  it('should expire password', () => {
    browser.pause(1000);
    browser.setValue('form#frmUser input[name=expire_password]', moment().subtract(10, 'days').format('MM/DD/YYYY'));
    browser.click('#create_user').waitForPaginationComplete();
    browser.getText('#page-container > div.boxBody > div > center > font').should.containEql('User Successfully Updated');
  });
  it('should logout and login with current user', () => {
    micis.logoutAndLogin(sampleData.username, sampleData.password);
  });

  it('should fail to login', () => {
    browser.getText('div.modal-body > form > div.alert.alert-close.alert-danger > span').should.containEql('Your password has expired');
  });
  it('should login with default user extend expiration date and expire account', () => {
    micis.logon();
    user.searchUser(sampleData.username);
    browser.setValue('form#frmUser input[name=expire_password]', sampleData.passwordExpirationDate);
    browser.setValue('form#frmUser input[name=expire_account]', moment().subtract(10, 'days').format('MM/DD/YYYY'));
    browser.click('#create_user').waitForPaginationComplete();
    browser.getText('#page-container > div.boxBody > div > center > font').should.containEql('User Successfully Updated');
  });

  it('should logout and login with current user', () => {
    micis.logoutAndLogin(sampleData.username, sampleData.password);
  });
  it('should fail to login', () => {
    browser.getText('div.modal-body > form > div.alert.alert-close.alert-danger > span1')
      .should.containEql('Your account has expired.');
  });
  it('should login with default user extend expiration date and expire account', () => {
    micis.logon();
    user.searchUser(sampleData.username);
    browser.setValue('form#frmUser input[name=expire_account]', sampleData.accountExpirationDate);
    browser.click('#create_user').waitForPaginationComplete();
    browser.getText('#page-container > div.boxBody > div > center > font').should.containEql('User Successfully Updated');
  });
  it('should logout and login with current user', () => {
    micis.logoutAndLogin(sampleData.username, sampleData.password);
  });
  it('should successfully to login', () => {
    browser.getText('#maincol-wide-800 > div.content > table > tbody > tr > td > div > div > div.page-header > h1')
      .should.containEql('COINS Updates');
  });
});
