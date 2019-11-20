'use strict';

/* eslint-env es6 */
const navigation = require('./nav/navigation.js');
const _ = require('lodash');

module.exports = (client) => {
  const nav = navigation(client);
  const me = {};

  me.searchUser = (username) => {
    nav.micisMenu.clickNested('Users');
    client
        .selectByValue('select[name=siteId]', 'allSites')
        .click('#apply_filter')
        .waitForPaginationComplete();
    client
        .setValue('#user_list_filter input', username)
        .click('#user_list > tbody > tr > td.sorting_1 > a')
        .waitForPaginationComplete();
  };

  me.fillForm = (sampleData, username) => {
    if (!username) {
      client.setValue('form#frmUser input[name=mind_user]', sampleData.username);
    }
    client
    .setValue('form#frmUser input[name=label]', sampleData.name)
    .setValue('form#frmUser input[name=mind_password]', sampleData.password)
    .setValue('form#frmUser input[name=email]', sampleData.emailAddress)
    .setValue('form#frmUser input[name=expire_account]', sampleData.accountExpirationDate)
    .setValue('form#frmUser input[name=expire_password]', sampleData.passwordExpirationDate)
    .selectByVisibleText('select[name=siteID]', sampleData.site);
    if (sampleData.receiveCOINSNotificationEmails) {
      client.click('form#frmUser input[name=email_unsubscribed][value=f]');
    } else {
      client.click('form#frmUser input[name=email_unsubscribed][value=t]');
    }
    if (sampleData.siteAdministrator) {
      client.click('form#frmUser input[name=is_site_admin][value=Y]');
    } else {
      client.click('form#frmUser input[name=is_site_admin][value=N]');
    }
  };

  me.verifyData = (sampleData) => {
    client.getValue('form#frmUser input[name=label]').should.be.equal(sampleData.name);
    client.getValue('form#frmUser input[name=mind_user]').should.be.equal(sampleData.username);
    client.getValue('form#frmUser input[name=mind_password]').length.should.be.ok; // eslint-disable-line no-unused-expressions
    client.getValue('form#frmUser input[name=email]').should.be.equal(sampleData.emailAddress);
    client.getValue('form#frmUser input[name=expire_account]').should.be.equal(sampleData.accountExpirationDate);
    client.getValue('form#frmUser input[name=expire_password]').should.be.equal(sampleData.passwordExpirationDate);
    client.getText('form#frmUser select[name=siteID] option:checked').should.be.equal(sampleData.site);
    if (sampleData.siteAdministrator) {
      client.isSelected('input[name=is_site_admin][value=Y]').should.be.true();
    } else {
      client.isSelected('input[name=is_site_admin][value=N]').should.be.true();
    }
    if (sampleData.receiveCOINSNotificationEmails) {
      client.isSelected('input[name=email_unsubscribed][value=f]').should.be.true();
    } else {
      client.isSelected('input[name=email_unsubscribed][value=t]').should.be.true();
    }
    client.isSelected('input[name=activate][value=Y]').should.be.true();
  };

  me.setAppPermissions = (perms) => {
    perms.remove.forEach((perm) => {
      _.each(perm, (role, app) => {
        client.selectByVisibleText('#appRoles', `${app}:${role}`);
        client.click('#remove_app');
      });
    });
    perms.add.forEach((perm) => {
      _.each(perm, (role, app) => {
        client.selectByVisibleText('select[name=apps]', app);
        client.selectByVisibleText('select[name=roles]', role);
        client.click('#add_app');
      });
    });
  };

  me.setStudyPermissions = (perms) => {
    perms.remove.forEach((perm) => {
      _.each(perm, (role, app) => {
        client.selectByVisibleText('#studyRoles', `${app}:${role}`);
        client.click('#remove_study');
      });
    });
    perms.add.forEach((perm) => {
      _.each(perm, (role, study) => {
        client.click(`select[name=study_id] option[title=${study}]`);
        client.selectByVisibleText('select[name=studyRoleSel]', role);
        client.click('#add_study');
      });
    });
  };

  me.verifyAppPermissions = (perms) => {
    const roleText = client.getText('form#frmUser select#appRoles');
    perms.add.forEach((perm) => {
      _.each(perm, (role, app) => {
        roleText.should.containEql(`${app}:${role}`);
      });
    });
    perms.remove.forEach((perm) => {
      _.each(perm, (role, app) => {
        roleText.should.not.containEql(`${app}:${role}`);
      });
    });
  };

  me.verifyStudyPermissions = (perms) => {
    const roleText = client.getText('form#frmUser select#studyRoles');
    perms.add.forEach((perm) => {
      _.each(perm, (role, study) => {
        roleText.should.containEql(`${study}:${role}`);
      });
    });
    perms.remove.forEach((perm) => {
      _.each(perm, (role, study) => {
        roleText.should.not.containEql(`${study}:${role}`);
      });
    });
  };

  return me;
};
