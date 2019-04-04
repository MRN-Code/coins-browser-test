'use strict';

/* globals browser */

/**
 * Test creating a new study.
 *
 * Steps:
 *
 *   1. Navigate to add site from (MICIS > Admin > Add Site)
 *   1. Fill out form with some sample data
 *   2. Click Add
 *   3. Verify values match entered data.
 */
const _ = require('lodash');
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
  it('should show a new site button', () => {
    browser.element('form input#add_user').should.be.ok;// eslint-disable-line no-unused-expressions
  });
  it('should open the add site form', () => {
    browser.click('form input#add_user').waitForPaginationComplete();
    browser.element('form#frmUser').should.be.ok;// eslint-disable-line no-unused-expressions
  });
  it('should fill values in the form', () => {
    browser
    .setValue('form#frmUser input[name=label]', sampleData.name)
    .setValue('form#frmUser input[name=mind_user]', sampleData.username)
    .setValue('form#frmUser input[name=mind_password]', sampleData.password)
    .setValue('form#frmUser input[name=email]', sampleData.emailAddress)
    .setValue('form#frmUser input[name=expire_account]', sampleData.accountExpirationDate)
    .setValue('form#frmUser input[name=expire_password]', sampleData.passwordExpirationDate)
    .selectByVisibleText('select[name=siteID]', sampleData.site);
    if (sampleData.receiveCOINSNotificationEmails) {
      browser.click('form#frmUser input[name=email_unsubscribed][value=f]');
    } else {
      browser.click('form#frmUser input[name=email_unsubscribed][value=t]');
    }
    if (sampleData.siteAdministrator) {
      browser.click('form#frmUser input[name=is_site_admin][value=Y]');
    } else {
      browser.click('form#frmUser input[name=is_site_admin][value=N]');
    }
  });
  it('should set application permissions', () => {
    sampleData.appPermissions.forEach((perm) => {
      _.each(perm, (role, app) => {
        browser.selectByVisibleText('select[name=apps]', app);
        browser.selectByVisibleText('select[name=roles]', role);
        browser.click('#add_app');
      });
    });
  });
  it('should set study permissions', () => {
    sampleData.studyPermissions.forEach((perm) => {
      _.each(perm, (role, study) => {
        browser.click(`select[name=study_id] option[title=${study}]`);
        browser.selectByVisibleText('select[name=studyRoleSel]', role);
        browser.click('#add_study');
      });
    });
  });

  it('should submit and see if successful', () => {
    browser.click('#create_user').waitForPaginationComplete();
    browser.getText('#page-container > div:nth-child(5) > div > center > font').should.be.equal('User Successfully Added');
  });
  it('should verify the user data', () => {
    browser
      .setValue('#user_list_filter input', sampleData.username)
      .click('#user_list > tbody > tr > td.sorting_1 > a')
      .waitForPaginationComplete();
    browser.getValue('form#frmUser input[name=label]').should.be.equal(sampleData.name);
    browser.getValue('form#frmUser input[name=mind_user]').should.be.equal(sampleData.username);
    browser.getValue('form#frmUser input[name=mind_password]').length.should.be.ok; // eslint-disable-line no-unused-expressions
    browser.getValue('form#frmUser input[name=email]').should.be.equal(sampleData.emailAddress);
    browser.getValue('form#frmUser input[name=expire_account]').should.be.equal(sampleData.accountExpirationDate);
    browser.getValue('form#frmUser input[name=expire_password]').should.be.equal(sampleData.passwordExpirationDate);
    browser.getText('form#frmUser select[name=siteID] option:checked').should.be.equal(sampleData.site);
    browser.isSelected('input[name=activate][value=Y]').should.be.true();
    browser.isSelected('input[name=is_site_admin][value=N]').should.be.true();
    browser.isSelected('input[name=email_unsubscribed][value=f]').should.be.true();
  });
  it('should check app roles', () => {
    const roleText = browser.getText('form#frmUser select#appRoles');
    sampleData.appPermissions.forEach((perm) => {
      _.each(perm, (role, app) => {
        roleText.should.containEql(`${app}:${role}`);
      });
    });
  });
  it('should check study roles', () => {
    const roleText = browser.getText('form#frmUser select#studyRoles');
    sampleData.studyPermissions.forEach((perm) => {
      _.each(perm, (role, study) => {
        roleText.should.containEql(`${study}:${role}`);
      });
    });
  });
});
