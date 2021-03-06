'use strict';

const asmtMenu = require('./asmtMenu.js');
const micisMenu = require('./micisMenu.js');

module.exports = (client) => {
  const me = {};

  // disable COINS navigation alerts when changing pages
  /* global window */
  me.disableNavigationAlert = () => client.execute(() => {
    if (window.preventExitPopup === undefined) {
      /* eslint-disable no-alert */
      window.alert('EXPECTED `preventExitPopup` set in pagination.js');
      /* eslint-enable no-alert */
    }
    window.preventExitPopup = true;
  });

  me.micisMenu = micisMenu(client);
  me.asmtMenu = asmtMenu(client);

  me.hoverHome = () => {
    client.waitForVisible('a.primary-nav-menu-button');
    return client
    .element('a.primary-nav-menu-button')
    .scroll()
    .click('=Menu');
  };

  me.gotoAsmt = () => {
    me
      .hoverHome()
      .click('=ASMT')
      .waitForPaginationComplete()
      .pause(3000);
  };

  me.gotoOcoins = () => client
    .url(`${client.options.baseUrl}/micis/index.php?subsite=ocoins_beta`)
    .waitForPaginationComplete();

  me.goToQueryBuilder = () => {
    client
      .scroll(0, 0);
    me.hoverHome()
      .click('=Query Builder')
      .waitForPaginationComplete();
  };

  me.selectAsmtStudy = (studyId) => {
    client.waitForExist(`select[name=asmt_study_id] option[value="${studyId}"]`);
    client
      .selectByValue('#asmt_study_id', studyId)
      .waitForPaginationComplete();
  };
  return me;
};
